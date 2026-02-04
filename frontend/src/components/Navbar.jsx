import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LogOut, 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Users, 
  PlusCircle, 
  Menu, 
  X 
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login-user");
  };

  if (!token) return null;
  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200
    ${isActive(path) 
      ? "bg-slate-900 text-white shadow-md" 
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
  `;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Package className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Resourcia
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user?.role === "ADMIN" ? (
              <>
                <Link to="/admin" className={navLinkClass("/admin")}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/admin/resources" className={navLinkClass("/admin/resources")}>
                  <Package size={18} /> Resources
                </Link>
                <Link to="/admin/bookings" className={navLinkClass("/admin/bookings")}>
                  <ClipboardList size={18} /> Bookings
                </Link>
                <Link to="/admin/users" className={navLinkClass("/admin/users")}>
                  <Users size={18} /> Users
                </Link>
              </>
            ) : (
              <>
                <Link to="/member" className={navLinkClass("/member")}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/member/request" className={navLinkClass("/member/request")}>
                  <PlusCircle size={18} /> New Booking
                </Link>
                <Link to="/member/bookings" className={navLinkClass("/member/bookings")}>
                  <ClipboardList size={18} /> My Bookings
                </Link>
              </>
            )}

            <div className="ml-4 pl-4 border-l border-slate-200">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2 animate-in slide-in-from-top duration-300">
          <Link to={user?.role === "ADMIN" ? "/admin" : "/member"} className="block px-4 py-2 text-slate-700">Dashboard</Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600">Logout</button>
        </div>
      )}
    </nav>
  );
}