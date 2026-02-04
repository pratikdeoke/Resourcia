import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Search, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const [formData, setFormData] = useState({
    organizationName: "", 
    name: "",
    email: "",
    password: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      showToast("Registration successful! Redirecting to login...", "success");
      setTimeout(() => navigate("/login-user"), 2000);
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed. Check the Org Name.", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 text-slate-700";
  const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
      
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

      <div className="w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-14 w-14 bg-emerald-100 text-emerald-600 rounded-2xl mb-4">
              <UserPlus size={28} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Join Organization</h1>
            <p className="text-slate-500 mt-2 font-medium text-sm">Create your member account to start booking.</p>
          </div>

          <div className="mb-8 bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
            <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              <span className="font-bold">Note:</span> Ensure you enter the exact <span className="underline">Organization Name</span> provided by your administrator.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Organization Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    name="organizationName" 
                    required 
                    placeholder="e.g. Test College 5" 
                    onChange={handleChange} 
                    className={inputClass} 
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input name="name" required placeholder="John Doe" onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input name="email" type="email" required placeholder="john@company.com" onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input name="password" type="password" required placeholder="Min. 6 characters" onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group mt-4 active:scale-95 shadow-lg shadow-slate-200 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-medium text-slate-500">
            Already a member?{" "}
            <Link to="/login-user" className="text-emerald-600 font-bold hover:underline underline-offset-4">
              Login here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}