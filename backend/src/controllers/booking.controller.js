import {
  createBookingService,
  getUserBookingsService,
  updateBookingService,
  requestUserBooking,
  listUserBookings,
  getPendingBookings,
  approveBooking,
  rejectBooking,
  cancelBookingService,
} from "../services/booking.service.js";

import { successResponse } from "../utils/response.js";

// ADMIN → Create a new booking
export const createBookingController = async (req, res, next) => {
  try {
    const booking = await createBookingService({
      organizationId: req.user.organizationId,
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json(successResponse(booking));
  } catch (err) {
    next(err);
  }
};

//  ADMIN → Get all bookings for logged-in user
export const getUserBookingsController = async (req, res, next) => {
  try {
    const bookings = await getUserBookingsService(req.user.id);
    res.json(successResponse(bookings));
  } catch (err) {
    next(err);
  }
};


//  ADMIN → Update a booking
export const updateBookingController = async (req, res, next) => {
  try {
    const booking = await updateBookingService(req.params.id, req.body);
    res.json(successResponse(booking));
  } catch (err) {
    next(err);
  }
};


//  MEMBER → Request a booking
export const createUserBooking = async (req, res, next) => {
  try {
    const booking = await requestUserBooking({
      organizationId: req.user.organizationId,
      userId: req.user.id,
      resourceId: req.body.resourceId,
      title: req.body.title,
      description: req.body.description,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });

    res.status(201).json(successResponse(booking, "Booking request submitted"));
  } catch (err) {
    next(err);
  }
};

//  MEMBER → View own bookings
export const getMyUserBookings = async (req, res, next) => {
  try {
    const bookings = await listUserBookings(req.user.id);
    res.json(successResponse(bookings));
  } catch (err) {
    next(err);
  }
};

export const getPendingBookingsController = async (req, res) => {
  const bookings = await getPendingBookings(
    req.user.organizationId
  );

  res.json({
    success: true,
    data: bookings
  });
};

export const approveBookingController = async (req, res, next) => {
  try {
    const booking = await approveBooking(
      req.params.id,
      req.user.organizationId
    );

    res.json({
      success: true,
      message: 'Booking approved',
      data: booking
    });
  } catch (err) {
      next(err);
    } 
};

export const rejectBookingController = async (req, res, next) => {
  try {
    const booking = await rejectBooking(req.params.id, req.user.organizationId);

    res.json({
      success: true,
      message: 'Booking rejected',
      data: booking
    });
  } catch (err) {
      next(err);
    }
};


//  Cancel a booking
//  ADMIN → can cancel any
//  MEMBER → can cancel own only
export const cancelBookingController = async (req, res) => {
  console.log("User ID from request:", req.user.id);
  try {
    const booking = await cancelBookingService(
      req.params.id,
      req.user.id,
      req.user.role
    ); 

    res.status(200).json({
      success: true,
      message: "Booking cancelled",
      data: booking,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};