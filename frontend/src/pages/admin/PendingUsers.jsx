import { useEffect, useState } from "react";
import { getPendingUsers, approveUser } from "../../api/user.api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCheck, 
  Mail, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  UserPlus, 
  Users 
} from "lucide-react";

export default function PendingUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 4000);
  };

  const load = async () => {
    try {
      const res = await getPendingUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to load pending users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      showToast("User account activated successfully!");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Error approving user");
    }
  };

  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-4 left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800"
          >
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <UserPlus className="text-indigo-600" size={32} />
            Pending Approvals
          </h1>
          <p className="text-slate-500 mt-1">Review and activate new member registrations.</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-2 text-indigo-700 font-bold">
          <Users size={18} />
          {users.length} Awaiting Activation
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading user database...</div>
      ) : (
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                <UserCheck size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
              <p className="text-slate-500">No new users are waiting for approval.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {users.map((u) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={u.id}
                  className="group bg-white border border-slate-200 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-lg hover:border-indigo-100 transition-all"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                      {getInitials(u.name)}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {u.name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Mail size={14} />
                        {u.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 text-[11px] font-black uppercase tracking-wider">
                      <ShieldAlert size={14} />
                      Pending Verify
                    </div>
                    <button
                      onClick={() => handleApprove(u.id)}
                      className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <UserCheck size={18} />
                      Approve Account
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}