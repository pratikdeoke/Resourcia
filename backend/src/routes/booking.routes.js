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

const router = Router();

/**
 * Create a booking
 * Any authenticated user can create
 */
router.post(
  "/",
  authenticate,
  createBookingController
);

/**
 * Get all bookings for logged-in user
 */
router.get(
  "/",
  authenticate,
  getUserBookingsController
);

/**
 * Update a booking
 * Only ADMIN or the user who created booking can update
 * For simplicity, assume owner check is in service
 */
router.put(
  "/:id",
  authenticate,
  updateBookingController
);

/**
 * Cancel a booking
 * Only ADMIN or the user who created booking can cancel
 */
router.delete(
  "/:id",
  authenticate,
  cancelBookingController
);

/**
 * ADMIN → view all pending booking requests
 */
router.get(
  '/pending',
  authenticate,
  authorizeRoles('ADMIN'),
  getPendingBookingsController
);

// ADMIN → approve booking
router.patch(
  '/:id/approve',
  authenticate,
  authorizeRoles('ADMIN'),
  approveBookingController
);

// ADMIN → reject booking
router.patch(
  '/:id/reject',
  authenticate,
  authorizeRoles('ADMIN'),
  rejectBookingController
);

//  * ADMIN → cancel booking
router.patch(
  '/:id/cancel',
  authenticate,
  authorizeRoles('ADMIN'),
  cancelBookingController
);

export default router;