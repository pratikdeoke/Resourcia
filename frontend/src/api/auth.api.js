import api from "./axios";

export const loginAdmin = (data) =>
  api.post("/auth/login-admin", data);

export const loginUser = (data) =>
  api.post("/auth/login-user", data);

export const registerUser = (data) =>
  api.post("/users/register", data);