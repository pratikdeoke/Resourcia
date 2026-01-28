import bcrypt from 'bcrypt';
import * as userRepo from '../repositories/user.repository.js';

export const registerMember = async ({
  organizationId,
  name,
  email,
  password,
}) => {
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  const existing = await userRepo.findUserByEmail(
    organizationId,
    email,
    false
  );

  if (existing) {
    throw new Error('User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return userRepo.createMember({
    organizationId,
    name,
    email,
    passwordHash,
  });
};

export const listPendingUsers = async (organizationId) => {
  return userRepo.getPendingUsers(organizationId);
};

export const approveUser = async (userId, organizationId) => {
  const user = await userRepo.findUserById(userId);

  if (!user || user.organization_id !== organizationId) {
    throw new Error('User not found');
  }

  return userRepo.activateUser(userId);
};