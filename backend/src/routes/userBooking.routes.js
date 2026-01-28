import { Router } from 'express';
import {
  createUserBooking,
  getMyUserBookings,
} from '../controllers/booking.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/rbac.middleware.js';

const router = Router();

// MEMBER → request a booking
router.post(
  '/request',
  authenticate,
  authorizeRoles('MEMBER'),
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