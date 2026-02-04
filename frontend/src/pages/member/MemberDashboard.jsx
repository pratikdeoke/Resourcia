import { useEffect, useState } from "react";
import { getMyBookings } from "../../api/booking.api";
import { Link } from "react-router-dom";
import { 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowRight,
  TrendingUp,
  ClipboardList
} from "lucide-react";

export default function MemberDashboard() {
  const [recentBookings, setRecentBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getMyBookings().then(res => setRecentBookings(res.data.data.slice(0, 3)));
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMED': return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case 'PENDING': return "bg-amber-100 text-amber-700 border-amber-200";
      case 'REJECTED': return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
            <p className="text-slate-400 mt-2 max-w-md">
              Manage your resource bookings and track your requests in one place.
            </p>
            <div className="flex items-center gap-2 mt-4 text-emerald-400 text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Member
            </div>
          </div>
          <Link 
            to="/member/request"
            className="flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg shadow-white/10"
          >
            <Plus size={20} />
            New Booking
          </Link>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<CalendarDays className="text-indigo-600" />} label="Total Bookings" value={recentBookings.length} />
        <StatCard icon={<Clock className="text-amber-600" />} label="Pending" value={recentBookings.filter(b => b.status === 'PENDING').length} />
        <StatCard icon={<TrendingUp className="text-emerald-600" />} label="Account Type" value="Standard" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          <Link to="/member/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentBookings.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Resource Title</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {b.title}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
                <ClipboardList size={24} />
              </div>
              <p className="text-slate-500">No recent bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}