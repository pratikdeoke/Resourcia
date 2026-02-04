import { useEffect, useState } from "react";
import { getResources } from "../../api/resource.api";
import { requestBooking } from "../../api/booking.api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarPlus, 
  Info, 
  Clock, 
  Box, 
  Type, 
  Send,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react";

export default function RequestBooking() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  useEffect(() => {
    let isMounted = true;
    getResources().then((res) => {
      if (isMounted) setResources(res.data.data || []);
    });
    return () => { isMounted = false; };
  }, []);

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(form.endTime) <= new Date(form.startTime)) {
      showToast("End time must be after start time!", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };

      await requestBooking(payload);
      showToast("Booking requested successfully!", "success");
      
      setForm({ resourceId: "", title: "", description: "", startTime: "", endTime: "" });
    } catch (err) {
      showToast(err.response?.data?.message || "Error requesting booking", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClass = "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 text-slate-700";
  const labelClass = "text-sm font-semibold text-slate-700 mb-1.5 block ml-1";

  return (
    <div className="max-w-3xl mx-auto relative px-4">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-10 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border min-w-[300px] ${
              toast.type === "success" 
                ? "bg-emerald-600 border-emerald-500 text-white" 
                : "bg-rose-600 border-rose-500 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold flex-1">{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="hover:bg-white/20 rounded-full p-1 transition-colors">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <CalendarPlus className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Request Resource</h1>
          <p className="text-slate-500">Submit a new booking request for approval.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 space-y-6">
          
          <div className="space-y-2">
            <label className={labelClass}>Select Resource</label>
            <div className="relative">
              <Box className="absolute left-3 top-3 text-slate-400" size={20} />
              <select 
                name="resourceId" 
                value={form.resourceId} 
                onChange={handleChange} 
                required 
                className={`${inputBaseClass} appearance-none`}
              >
                <option value="">Choose a resource...</option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} — ({r.type})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Event Title</label>
            <div className="relative">
              <Type className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                name="title" 
                value={form.title} 
                placeholder="e.g., Annual IOT Workshop" 
                onChange={handleChange} 
                required 
                className={inputBaseClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Description</label>
            <div className="relative">
              <Info className="absolute left-3 top-3 text-slate-400" size={20} />
              <textarea 
                name="description" 
                rows="3"
                value={form.description} 
                placeholder="Briefly explain the purpose..." 
                onChange={handleChange} 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Start Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  name="startTime" 
                  type="datetime-local" 
                  value={form.startTime} 
                  onChange={handleChange} 
                  required 
                  className={inputBaseClass}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  name="endTime" 
                  type="datetime-local" 
                  value={form.endTime} 
                  onChange={handleChange} 
                  required 
                  className={inputBaseClass}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 group"
          >
            {loading ? "Processing..." : "Submit Request"}
            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}