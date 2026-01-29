import { Router } from 'express';
import {
  createUserBooking,
  getMyUserBookings,
} from '../controllers/booking.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/rbac.middleware.js';

import { validate } from '../middlewares/validate.middleware.js'
import {
  createBookingSchema,
  updateBookingSchema,
  bookingIdParamSchema,
  bookingQuerySchema
} from '../validations/index.js'

const router = Router();

// MEMBER → request a booking
router.post(
  '/request',
  authenticate,
  authorizeRoles('MEMBER'),
  validate(createBookingSchema),
  createUserBooking
);

// MEMBER → view own bookings
router.get(
  '/my',
  authenticate,
  authorizeRoles('MEMBER'),
  getMyUserBookings
);

export default router;