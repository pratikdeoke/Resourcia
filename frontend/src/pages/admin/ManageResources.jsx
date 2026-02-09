import { useEffect, useState } from "react";
import { getResources, createResource } from "../../api/resource.api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Package, 
  MapPin, 
  Users, 
  Layers, 
  Building2, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    organizationId: user?.organization_id || "", 
    name: "",
    type: "",
    capacity: 0,
    location: ""
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const load = async () => {
    try {
      const res = await getResources();
      setResources(res.data.data);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createResource(formData);
      showToast("Resource successfully added to inventory!", "success");
      
      setFormData({ 
        ...formData, 
        name: "", 
        type: "", 
        capacity: 0, 
        location: "" 
      });
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create resource", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm";
  const labelClass = "text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 20 }} 
            exit={{ opacity: 0 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border ${
              toast.type === "success" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-rose-600 border-rose-500 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Resource Inventory</h1>
          <p className="text-slate-500">Configure and monitor assets for <span className="text-indigo-600 font-semibold">{user?.organization_name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Creation Form */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Plus size={20} />
            </div>
            <h2 className="font-bold text-slate-800">Add New Asset</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className={labelClass}>Organization</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  readOnly 
                  className={`${inputClass} bg-slate-100 cursor-not-allowed text-slate-500 font-semibold`} 
                  value={user?.organization_name || "Unknown Organization"} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Resource Name</label>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input required className={inputClass} value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Conference Room B" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Category/Type</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input required className={inputClass} value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})} placeholder="e.g. Workspace" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Capacity</label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input type="number" className={inputClass} value={formData.capacity} 
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} placeholder="0" />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Physical Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input className={inputClass} value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. Level 2, West Wing" />
              </div>
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Resource"}
            </button>
          </form>
        </div>

        {/* Resources Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Layers size={18} className="text-slate-400" />
              Active Inventory
            </h3>
            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-500 border border-slate-200">
              {resources.length} Units Found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">Resource Details</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Max Occupancy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.length > 0 ? (
                  resources.map((r) => (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={r.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{r.name}</p>
                            <p className="text-xs text-slate-400 tracking-wide uppercase font-semibold">{r.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin size={14} className="text-slate-400" />
                          {r.location || "Internal Access"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">
                          <Users size={14} />
                          {r.capacity}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-400 italic">
                      No resources registered for this organization yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}