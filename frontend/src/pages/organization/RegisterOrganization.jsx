import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrganization } from "../../api/organization.api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Shield,
  Clock
} from "lucide-react";

export default function RegisterOrganization() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [organization, setOrganization] = useState({
    name: "",
    domain: "",
    timezone: "",
    calendarEmail: "",
  });

  const [owner, setOwner] = useState({
    name: "",
    email: "",
    password: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrganization({
        organization,
        owner,
      });

      showToast("Organization created successfully!", "success");
      setTimeout(() => navigate("/login-admin"), 2000);
    } catch (err) {
      showToast(err.response?.data?.message || "Setup failed. Check your details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-700";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-y-auto">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-4 left-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border ${
              toast.type === "success" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-rose-600 border-rose-500 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl my-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-200 p-8 md:p-12"
        >
          <div className="flex justify-center mb-6">
            <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Shield size={14} /> Organization Setup
            </span>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Workspace</h1>
            <p className="text-slate-500 mt-2 font-medium">Initialize your organization's booking portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-1">
                <Building2 size={16} className="text-indigo-500" />
                Organization Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Organization Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      required 
                      placeholder="University of Tech" 
                      value={organization.name}
                      onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                      className={inputClass} 
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Domain</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      placeholder="unitech.edu" 
                      value={organization.domain}
                      onChange={(e) => setOrganization({ ...organization, domain: e.target.value })}
                      className={inputClass} 
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Timezone</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      required
                      placeholder="Asia/Kolkata" 
                      value={organization.timezone}
                      onChange={(e) => setOrganization({ ...organization, timezone: e.target.value })}
                      className={inputClass} 
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Calendar Service Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      placeholder="service@google.com" 
                      value={organization.calendarEmail}
                      onChange={(e) => setOrganization({ ...organization, calendarEmail: e.target.value })}
                      className={inputClass} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-1">
                <User size={16} className="text-indigo-500" />
                Root Administrator
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Admin Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      required 
                      placeholder="Master Admin" 
                      value={owner.name}
                      onChange={(e) => setOwner({ ...owner, name: e.target.value })}
                      className={inputClass} 
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Admin Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required 
                      placeholder="admin@domain.com" 
                      value={owner.email}
                      onChange={(e) => setOwner({ ...owner, email: e.target.value })}
                      className={inputClass} 
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Security Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••" 
                      value={owner.password}
                      onChange={(e) => setOwner({ ...owner, password: e.target.value })}
                      className={inputClass} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] shadow-xl shadow-indigo-100 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Organization"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
             <span className="text-slate-400 font-medium">Already have an organization?</span>{" "}
             <Link to="/login-admin" className="text-indigo-600 font-bold hover:underline">Login as Admin</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}