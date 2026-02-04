import api from "./axios";

export const requestBooking = (data) =>
  api.post("/user-bookings/request", data);

export const getMyBookings = () =>
  api.get("/user-bookings/my");

export const getPendingBookings = () =>
  api.get("/bookings/pending");

export const approveBooking = (id) =>
  api.patch(`/bookings/${id}/approve`);

export const rejectBooking = (id) =>
  api.patch(`/bookings/${id}/reject`);