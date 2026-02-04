import { Router } from 'express';
import { register, getPending, approve, changeRole } from '../controllers/user.controller.js';
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

router.patch(
  '/:id/role',
  authenticate,
  authorizeRoles('ADMIN'),
  changeRole
);

export default router;