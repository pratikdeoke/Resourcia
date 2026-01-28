import { Router } from 'express';
import { register, getPending, approve } from '../controllers/user.controller.js';
import {authenticate} from '../middlewares/auth.middleware.js';
import {authorizeRoles} from '../middlewares/rbac.middleware.js';

const router = Router();

router.post('/register', register);

router.get(
  '/pending',
  authenticate,
  authorizeRoles('ADMIN'),
  getPending
);

router.patch(
  '/:id/approve',
  authenticate,
  authorizeRoles('ADMIN'),
  approve
);

export default router;