import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

export default function Message() {
  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post("/admin/message", form);

      toast.success(`Sent to ${res.data.count} users`);
      setForm({ subject: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Send Message</h1>

      <form onSubmit={handleSend} className="space-y-4">

        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) =>
            setForm({ ...form, subject: e.target.value })
          }
          className="w-full p-3 border rounded"
        />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
          className="w-full p-3 border rounded h-40"
        />

        <button
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}