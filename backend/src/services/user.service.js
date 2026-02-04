import bcrypt from "bcrypt";
import * as userRepo from "../repositories/user.repository.js";
import { findOrganizationByName } from "../repositories/organization.repository.js";

export const registerMember = async ({
  organizationName,
  name,
  email,
  password,
}) => {
  if (!organizationName || !name || !email || !password) {
    throw new Error("All fields are required");
  }

  const org = await findOrganizationByName(organizationName);
  if (!org) {
    throw new Error("Organization not found");
  }

  const existing = await userRepo.findUserByEmail(
    org.id,
    email,
    false
  );

  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return userRepo.createMember({
    organizationId: org.id,
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

export const changeUserRole = async ({
  requester,
  targetUserId,
  newRole,
}) => {
  if (!['ADMIN', 'MEMBER'].includes(newRole)) {
    throw new Error('Invalid role');
  }

  const targetUser = await userRepo.findUserById(targetUserId);

  if (!targetUser) {
    throw new Error('User not found');
  }

  if (targetUser.organization_id !== requester.organizationId) {
    throw new Error('Unauthorized action');
  }

  if (requester.id === targetUser.id) {
    throw new Error('You cannot change your own role');
  }

  if (requester.role === 'ADMIN' && requester.is_owner !== true) {
    throw new Error('Only owner can change user roles');
  }

  return userRepo.updateUserRole(targetUserId, newRole);
};