import { Routes, Route, Navigate } from "react-router-dom";

import LoginAdmin from "../pages/LoginAdmin";
import LoginUser from "../pages/LoginUser";
import RegisterUser from "../pages/RegisterUser";

import RequestBooking from "../pages/member/RequestBooking";
import MyBookings from "../pages/member/MyBookings";

import PendingBookings from "../pages/admin/PendingBookings";
import ManageResources from "../pages/admin/ManageResources";
import PendingUsers from "../pages/admin/PendingUsers";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Resources from "../pages/admin/Resources";
import MemberDashboard from "../pages/member/MemberDashboard";
import Layout from "../components/Layout";

import RegisterOrganization from "../pages/organization/RegisterOrganization";

export default function AppRoutes() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const Home = () => {
    if (!token) return <Navigate to="/register-organization" />;
    return user?.role === "ADMIN" ? <Navigate to="/admin" /> : <Navigate to="/member" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register-organization" element={<RegisterOrganization />} />
      <Route path="/login-admin" element={<LoginAdmin />} />
      <Route path="/login-user" element={<LoginUser />} />
      <Route path="/register-user" element={<RegisterUser />} />

      <Route path="/member/request" element={<Layout><RequestBooking /></Layout>} />
      <Route path="/member/bookings" element={<Layout><MyBookings /></Layout>} />

      <Route path="/admin/bookings" element={<Layout><PendingBookings /></Layout>} />
      <Route path="/admin/resources" element={<Layout><ManageResources /></Layout>} />
      <Route path="/admin/users" element={<Layout><PendingUsers /></Layout>} />

      <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />

      <Route path="/member" element={<Layout><MemberDashboard /></Layout>} />
      <Route path="/resources" element={<Resources />} />

    </Routes>
  );
}