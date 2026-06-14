import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { Send, Loader2, Mail } from "lucide-react"; // Recommended: lucide-react

export default function Message() {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await api.post("/admin/message", form);
      toast.success(`Message sent successfully to ${res.data.count} users`);
      setForm({ subject: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Mail size={24} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Broadcast Message</h1>
          <p className="text-sm text-slate-500">Send an update to all registered users.</p>
        </div>
      </div>

      <form onSubmit={handleSend} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
          <input
            placeholder="e.g. System Maintenance Update"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Message Content</label>
          <textarea
            placeholder="Write your message here..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg h-40 resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Broadcast
            </>
          )}
        </button>
      </form>
    </div>
  );
}