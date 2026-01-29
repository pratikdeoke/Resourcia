import { Router } from "express";
import {
  createBookingController,
  getUserBookingsController,
  updateBookingController,
  cancelBookingController,
  getPendingBookingsController,
  approveBookingController,
  rejectBookingController,
} from "../controllers/booking.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/rbac.middleware.js";

import { validate } from '../middlewares/validate.middleware.js'
import {
  createBookingSchema,
  updateBookingSchema,
  bookingIdParamSchema,
  bookingQuerySchema
} from '../validations/index.js'

const router = Router();

// Create a booking
// Any authenticated user can create
router.post(
  "/",
  authenticate,
  validate(createBookingSchema),
  createBookingController
);

// Get all bookings for logged-in user
router.get(
  "/",
  authenticate,
  validate(bookingQuerySchema),
  getUserBookingsController
);

// Update a booking
// Only ADMIN or the user who created booking can update
router.put(
  "/:id",
  authenticate,
  validate(bookingIdParamSchema),
  validate(updateBookingSchema),
  updateBookingController
);


// Cancel a booking
// Only ADMIN or the user who created booking can cancel
router.delete(
  "/:id",
  authenticate,
  validate(bookingIdParamSchema),
  cancelBookingController
);

//  * ADMIN → view all pending booking requests
router.get(
  '/pending',
  authenticate,
  authorizeRoles('ADMIN'),
  validate(bookingQuerySchema),
  getPendingBookingsController
);

// ADMIN → approve booking
router.patch(
  '/:id/approve',
  authenticate,
  authorizeRoles('ADMIN'),
  validate(bookingIdParamSchema),
  approveBookingController
);

// ADMIN → reject booking
router.patch(
  '/:id/reject',
  authenticate,
  authorizeRoles('ADMIN'),
  validate(bookingIdParamSchema),
  rejectBookingController
);

// ADMIN → cancel booking
router.patch(
  '/:id/cancel',
  authenticate,
  authorizeRoles('ADMIN'),
  validate(bookingIdParamSchema),
  cancelBookingController
);

export default router;