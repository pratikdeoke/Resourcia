import { useEffect, useState } from "react";
import { getMyBookings } from "../../api/booking.api";
import { 
  Calendar, 
  Clock, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Search,
  Filter
} from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then((res) => {
        setBookings(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'CONFIRMED': 
        return { color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <CheckCircle2 size={16} /> };
      case 'REJECTED': 
        return { color: "text-rose-600 bg-rose-50 border-rose-100", icon: <XCircle size={16} /> };
      default: 
        return { color: "text-amber-600 bg-amber-50 border-amber-100", icon: <Clock size={16} /> };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-500 text-sm">Track and manage your resource requests.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading your bookings...</div>
        ) : bookings.length > 0 ? (
          bookings.map((b) => {
            const config = getStatusConfig(b.status);
            return (
              <div 
                key={b.id} 
                className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all hover:border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg ${config.color.split(' ')[1]}`}>
                    <Calendar className={config.color.split(' ')[0]} size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {b.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Tag size={14} /> {b.resource_name || "Resource"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> 
                        {new Date(b.startTime).toLocaleDateString()} • {new Date(b.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${config.color}`}>
                    {config.icon}
                    {b.status}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <AlertCircle size={20} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No bookings yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-1">
              When you make a resource request, it will appear here with its current status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}