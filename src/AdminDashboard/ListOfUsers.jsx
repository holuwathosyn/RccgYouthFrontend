import React, { useEffect, useState } from "react";
import { 
  Download, 
  Search, 
  Trash2, 
  Calendar, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../api/api";
import { useAuth } from "../Context/AuthContext";

const YouthRegistrationAdmin = () => {
  const { admin } = useAuth();
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/youths");
      setMembers(res.data?.data || []);
    } catch (error) {
      console.error("FETCH ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await api.delete(`/admin/youths/${id}`);
      setMembers((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("DELETE ERROR:", error.response?.data || error.message);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member?.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchesMonth = monthFilter === "All" || member?.month === monthFilter;
    return matchesSearch && matchesMonth;
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredMembers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Youth Registrations");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(fileData, `RCCG_Youth_Registration_${Date.now()}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Youth Registration Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {admin?.name || "Admin"}</p>
          </div>
          <button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all">
            <Download size={18} /> Export
          </button>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-gray-400" size={18} />
            <input type="text" placeholder="Search name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="relative w-full sm:w-48">
            <Calendar className="absolute left-4 top-4 text-gray-400" size={18} />
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
              <option value="All">All Months</option>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">Loading members...</div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>{["Name", "Occupation", "Gender", "Birthday", "Email", "Phone", "Address", "Action"].map((h) => <th key={h} className="p-4 text-sm font-semibold text-gray-600">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMembers.map((member) => (
                    <tr key={member._id}>
                      <td className="p-4">{member.fullName}</td>
                      <td className="p-4 text-gray-600">{member.occupation}</td>
                      <td className="p-4 text-gray-600">{member.gender}</td>
                      <td className="p-4 text-gray-600">{member.day} {member.month}</td>
                      <td className="p-4 text-gray-600">{member.email}</td>
                      <td className="p-4 text-gray-600">{member.phone}</td>
                      <td className="p-4 text-gray-600">{member.address}</td>
                      <td className="p-4"><button onClick={() => deleteMember(member._id)} className="text-red-500"><Trash2 size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Everything as Block */}
            <div className="md:hidden space-y-4">
              {filteredMembers.map((member) => (
                <div key={member._id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-lg">{member.fullName}</h3>
                    <button onClick={() => deleteMember(member._id)} className="p-2 text-red-500 bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                  
                  {/* Every item is a block */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Briefcase size={14}/> {member.occupation}</div>
                    <div className="flex items-center gap-2"><Calendar size={14}/> {member.day} {member.month}</div>
                    <div className="flex items-center gap-2"><Mail size={14}/> {member.email}</div>
                    <div className="flex items-center gap-2"><Phone size={14}/> {member.phone}</div>
                    <div className="flex items-center gap-2"><MapPin size={14}/> {member.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YouthRegistrationAdmin;