import { calendar } from '../config/googleCalendar.js';
import { mapBookingToCalendarEvent } from '../utils/calendarEventMapper.js';
import * as bookingRepo from '../repositories/booking.repository.js';

export const createCalendarEvent = async (booking, calendarId) => {
  if (!calendar || !calendarId) return null;

  const resource = await bookingRepo.getResourceById(booking.resource_id);
  const event = mapBookingToCalendarEvent(booking, resource);

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event,
  });

  return response.data.id;
};

export const deleteCalendarEvent = async (eventId, calendarId) => {
  if (!calendar || !eventId || !calendarId) return;

  await calendar.events.delete({
    calendarId,
    eventId,
  });
};