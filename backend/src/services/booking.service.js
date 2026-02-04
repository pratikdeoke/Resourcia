import {
  createBooking,
  getBookingsByResource,
  getBookingsByUser,
  updateBooking,
  cancelBooking,
  getBookingById
} from "../repositories/booking.repository.js";

import * as bookingRepo from "../repositories/booking.repository.js";
import { acquireLock, releaseLock } from "../utils/redisLock.js";
import { createCalendarEvent, deleteCalendarEvent } from './googleCalendar.service.js';

// ADMIN - Create booking directly
export const createBookingService = async ({
  organizationId,
  resourceId,
  userId,
  title,
  description,
  startTime,
  endTime,
}) => {
  if (!organizationId || !resourceId || !userId || !title || !startTime || !endTime) {
    throw new Error("Missing required booking fields");
  }

  if (new Date(startTime) >= new Date(endTime)) {
    throw new Error("Start time must be before end time");
  }

  const conflicts = await getBookingsByResource(resourceId, startTime, endTime);
  if (conflicts.length > 0) {
    throw new Error("Resource is already booked for the selected time range");
  }

  return createBooking({
    organizationId,
    resourceId,
    userId,
    title,
    description,
    startTime,
    endTime,
    status: "CONFIRMED",
  });
};

// Get bookings for a user
export const getUserBookingsService = async (userId) => {
  if (!userId) throw new Error("User ID is required");
  return getBookingsByUser(userId);
};

// Update a booking
export const updateBookingService = async (id, data) => {
  if (!id) throw new Error("Booking ID is required");

  const existingBooking = await getBookingById(id);

  if (!existingBooking) {
    throw new Error("Booking not found");
  }

  if (existingBooking.status === 'CONFIRMED') {
    throw new Error("Approved bookings cannot be updated");
  }

  const { startTime, endTime, resourceId } = data;

  if (startTime && endTime && resourceId) {
    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error("Start time must be before end time");
    }

    const conflicts = await getBookingsByResource(resourceId, startTime, endTime);
    if (conflicts.some((b) => b.id !== id)) {
      throw new Error("Resource is already booked for the selected time range");
    }
  }

  return updateBooking(id, data);
};

export const requestUserBooking = async (data) => {
  const { resourceId } = data;
  const lockKey = `resource:${resourceId}`;

  const lockAcquired = await acquireLock(lockKey);
  if (!lockAcquired) {
    throw new Error('Resource is currently being booked. Try again.');
  }

  try {
    const conflicts = await bookingRepo.getBookingsByResource(
      resourceId,
      data.startTime,
      data.endTime
    );

    if (conflicts.length > 0) {
      throw new Error('Resource already booked for this time slot');
    }

    return await bookingRepo.createBooking({
      ...data,
      status: 'PENDING',
    });
  } finally {
    await releaseLock(lockKey);
  }
};


// MEMBER - List own bookings
export const listUserBookings = async (userId) => {
  return getBookingsByUser(userId);
};


export const getPendingBookings = async (organizationId) => {
  return bookingRepo.getPendingBookings(organizationId);
};

// ADMIN - approve booking
export const approveBooking = async (bookingId, organizationId) => {
  const booking = await bookingRepo.getBookingById(bookingId);

  if (!booking || booking.organization_id !== organizationId) {
    throw new Error('Booking not found');
  }

  if (booking.status !== 'PENDING') {
    throw new Error('Only pending bookings can be approved');
  }

  const org = await bookingRepo.getOrganizationById(organizationId);

  let googleEventId = null;

  if (org?.google_calendar_id) {
    googleEventId = await createCalendarEvent(
      booking,
      org.google_calendar_id
    );
  }
  const resource = await bookingRepo.getResourceById(booking.resource_id);

  return bookingRepo.updateBookingStatus(
    bookingId,
    'CONFIRMED',
    googleEventId,
    resource
  );
};

// ADMIN - reject booking
export const rejectBooking = async (bookingId, organizationId) => {
  const booking = await bookingRepo.getBookingById(bookingId);

  console.log('Booking:', booking);
  console.log('Org ID from user:', organizationId);

  if (!booking || booking.organization_id !== organizationId) {
    throw new Error('Booking not found');
  }

  if (booking.status !== 'PENDING') {
    throw new Error('Only pending bookings can be rejected');
  }

  return bookingRepo.updateBookingStatus(bookingId, 'REJECTED');
};

// ADMIN - cancel booking
export const cancelBookingService = async (bookingId, userId, role) => {
  const booking = await bookingRepo.getBookingById(bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (role !== 'ADMIN' && booking.user_id !== userId) {
    throw new Error('Not authorized to cancel this booking');
  }

  if (booking.status === 'CANCELLED') {
    throw new Error('Booking already cancelled');
  }

  if (booking.google_event_id) {
    await deleteCalendarEvent(booking.google_event_id, booking.google_calendar_id);
  }

  return bookingRepo.updateBookingStatus(bookingId, 'CANCELLED');
};