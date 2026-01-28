import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repositories/user.repository.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

// Register a new ADMIN user
export const registerAdminService = async ({
  organizationId,
  name,
  email,
  password,
}) => {
  if (!organizationId || !name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await findUserByEmail(organizationId, email, false);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return createUser({
    organizationId,
    name,
    email,
    passwordHash,
    role: "ADMIN",
  });
};

// Generate JWT token for user
const generateToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      role: user.role,
      organizationId: user.organization_id,
      is_active: user.is_active,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

// Login as ADMIN
export const loginAdminService = async ({ organizationId, email, password }) => {
  const user = await findUserByEmail(organizationId, email, true);

  if (!user || user.role !== "ADMIN") {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    token: generateToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// Login as MEMBER
export const loginUserService = async ({ organizationId, email, password }) => {
  const user = await findUserByEmail(organizationId, email, true);

  if (!user || user.role !== "MEMBER") {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    token: generateToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};