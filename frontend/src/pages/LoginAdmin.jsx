import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/auth.api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgId, setOrgId] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const [organizationName, setOrganizationName] = useState("");
  
  const navigate = useNavigate();

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin({ organizationName, email, password });
      const { token, user } = res.data.data;

      const userWithOrgName = { 
        ...user, 
        organization_name: organizationName 
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithOrgName));

      showToast("Authentication successful! Redirecting...", "success");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      showToast(err.response?.data?.message || "Invalid Admin Credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-700";
  const iconClass = "absolute left-3 top-3.5 text-slate-400";
  const labelClass = "text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-4 left-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border ${
              toast.type === "success" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-rose-600 border-rose-500 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-200 p-8 md:p-10"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-16 w-16 bg-slate-900 text-white rounded-2xl mb-4 shadow-xl rotate-3">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Access</h1>
            <p className="text-slate-500 mt-2 font-medium">Command center login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Organization</label>
              <div className="relative">
                <Building2 className={iconClass} size={20} />
                <input
                  type="text"
                  placeholder="Organization Name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Admin Email</label>
              <div className="relative">
                <Mail className={iconClass} size={20} />
                <input
                  type="email"
                  placeholder="admin@org.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Secure Key</label>
              <div className="relative">
                <Lock className={iconClass} size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group mt-4 active:scale-95 shadow-lg shadow-slate-200"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center space-y-4">
            <p className="text-sm text-slate-500 font-medium">
              Need a workspace?{" "}
              <Link to="/register-organization" className="text-indigo-600 font-bold hover:underline underline-offset-4">
                Create an organization
              </Link>
            </p>
            <Link to="/login-user" className="block text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
              Switch to User Login
            </Link>
          </div>
        </motion.div>

        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>
    </div>
  );
}