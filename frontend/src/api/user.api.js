import api from "./axios";

export const getPendingUsers = () =>
  api.get("/users/pending");

export const approveUser = (id) =>
  api.patch(`/users/${id}/approve`);