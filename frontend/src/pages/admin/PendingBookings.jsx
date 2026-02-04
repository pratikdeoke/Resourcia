import { useEffect, useState } from "react";
import {
  getPendingBookings,
  approveBooking,
  rejectBooking,
} from "../../api/booking.api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  X, 
  Clock, 
  User, 
  Calendar, 
  Inbox,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function PendingBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const load = async () => {
    try {
      const res = await getPendingBookings();
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      showToast("Booking Approved & Synced to Calendar!", "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Error approving", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBooking(id);
      showToast("Booking request rejected.", "error");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Error rejecting", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border ${
              toast.type === "success" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Review Requests</h1>
          <p className="text-slate-500 flex items-center gap-2 mt-1">
            <Clock size={16} className="text-amber-500" />
            {bookings.length} requests awaiting your decision.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 w-full bg-slate-100 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-4">
                <Inbox size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Queue is empty!</h3>
              <p className="text-slate-500">All booking requests have been processed.</p>
            </div>
          ) : (
            <AnimatePresence>
              {bookings.map((b) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={b.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-center gap-6"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Calendar size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{b.title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        <User size={14} className="text-slate-400" />
                        <span className="font-medium text-slate-700">User ID: {b.user_id.slice(0, 8)}...</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 bg-slate-50 px-5 py-4 rounded-2xl border border-slate-100 w-full lg:w-fit">
                        
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">From</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 leading-tight">
                              {new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[11px] font-bold text-indigo-600">
                              {new Date(b.start_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center px-2">
                          <div className="h-px w-8 bg-slate-300 relative">
                            <div className="absolute -right-1 -top-[3px] w-1.5 h-1.5 border-t-2 border-r-2 border-slate-300 rotate-45" />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Until</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 leading-tight">
                              {new Date(b.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className={`text-[11px] font-bold ${
                              new Date(b.start_time).toDateString() === new Date(b.end_time).toDateString() 
                              ? "text-slate-400" 
                              : "text-rose-600"
                            }`}>
                              {new Date(b.end_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="ml-2 pl-4 border-l border-slate-200 hidden sm:block">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Duration</span>
                          <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {Math.round((new Date(b.end_time) - new Date(b.start_time)) / (1000 * 60 * 60))} Hours
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleReject(b.id)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                    >
                      <X size={20} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(b.id)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover:shadow-emerald-200"
                    >
                      <Check size={20} />
                      Approve
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}