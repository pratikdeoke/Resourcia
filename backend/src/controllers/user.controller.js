import * as userService from '../services/user.service.js';
import { successResponse } from '../utils/response.js';

export const register = async (req, res, next) => {
  // console.log("HEADERS:", req.headers["content-type"]);
  // console.log("BODY:", req.body);
  try {
    const { organizationId, name, email, password } = req.body;

    if (!organizationId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required including organizationId",
      });
    }

    const user = await userService.registerMember({ organizationId, name, email, password });
    res.status(201).json(
      successResponse(user, 'Registration request sent for approval')
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