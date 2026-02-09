import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingBookings } from "../../api/booking.api";
import { getPendingUsers } from "../../api/user.api";
import { 
  ShieldCheck, 
  ClipboardList, 
  UserPlus, 
  Settings, 
  ArrowUpRight,
  Copy,
  LayoutGrid
} from "lucide-react";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ bookings: 0, users: 0 });
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  useEffect(() => {
    Promise.all([getPendingBookings(), getPendingUsers()]).then(([bookings, users]) => {
      setCounts({
        bookings: bookings.data.data.length,
        users: users.data.data.length,
      });
    });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-2">
            <ShieldCheck size={16} />
            Administrator Portal
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome, {user?.name}
          </h1>
        </div>
        
        <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
            <LayoutGrid size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Org Name</p>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono font-bold text-slate-700">{user?.organization_name || "Unknown Organization"}</code>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <AdminStatCard 
          title="Pending Bookings"
          count={counts.bookings}
          icon={<ClipboardList className="text-amber-600" />}
          link="/admin/bookings"
          description="Awaiting approval"
          color="amber"
        />

        <AdminStatCard 
          title="New User Requests"
          count={counts.users}
          icon={<UserPlus className="text-indigo-600" />}
          link="/admin/users"
          description="Verify accounts"
          color="indigo"
        />

        <AdminStatCard 
          title="Active Resources"
          count="Manage"
          icon={<Settings className="text-slate-600" />}
          link="/admin/resources"
          description="Update inventory"
          color="slate"
        />
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
          <ShieldCheck className="text-white" size={28} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-bold text-indigo-900 text-lg">Admin Tip</h4>
          <p className="text-indigo-700/80">
            Always verify user credentials before granting access to premium resources. 
            You can manage resource availability in the "Manage Resources" tab.
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ title, count, icon, link, description, color }) {
  const colorMap = {
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <Link to={link} className="group bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
          {icon}
        </div>
        <ArrowUpRight className="text-slate-300 group-hover:text-slate-600 transition-colors" size={20} />
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-900 mb-1">{count}</h3>
        <p className="font-bold text-slate-700">{title}</p>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>
    </Link>
  );
}