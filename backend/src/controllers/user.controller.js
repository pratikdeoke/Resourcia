import * as userService from '../services/user.service.js';
import { successResponse } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { organizationName, name, email, password } = req.body;

    if (!organizationName || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including organizationName",
      });
    }

    const user = await userService.registerMember({
      organizationName,
      name,
      email,
      password,
    });

    res.status(201).json(
      successResponse(user, "Registration request sent for approval")
    );
  } catch (err) {
    next(err);
  }
};

export const getPending = async (req, res, next) => {
  try {
    const users = await userService.listPendingUsers(
      req.user.organizationId
    );
    res.json(successResponse(users));
  } catch (err) {
    next(err);
  }
};

export const approve = async (req, res, next) => {
  try {
    const user = await userService.approveUser(
      req.params.id,
      req.user.organizationId
    );

    res.json(successResponse(user, 'User approved'));
  } catch (err) {
    next(err);
  }
};

export const changeRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const updatedUser = await userService.changeUserRole({
      requester: req.user,
      targetUserId: req.params.id,
      newRole: role,
    });

    res.json(successResponse(updatedUser, 'User role updated'));
  } catch (err) {
    next(err);
  }
};