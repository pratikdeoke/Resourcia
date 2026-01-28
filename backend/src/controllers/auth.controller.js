import {
  registerAdminService,
  loginAdminService,
  loginUserService,
} from "../services/auth.service.js";

export const registerAdmin = async (req, res) => {
  try {
    const user = await registerAdminService(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const result = await loginAdminService(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await loginUserService(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};