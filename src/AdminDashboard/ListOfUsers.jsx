import React, { useEffect, useState } from "react";
import { Users, Download, Search, Trash2, UserCheck } from "lucide-react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const YouthRegistrationAdmin = () => {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/youths`, { withCredentials: true });
      setMembers(res.data.data || []);
    } catch (error) {
      console.log("FETCH ERROR:", error.response?.data || error.message);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const deleteMember = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/youths/${id}`, { withCredentials: true });
      setMembers((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log("DELETE ERROR:", error.response?.data || error.message);
    }
  };

  const filteredMembers = members.filter((member) =>
    member.fullName.toLowerCase().includes(search.toLowerCase())
  );

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
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Youth Registration Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage registered church youths</p>
            </div>
            <button
              onClick={exportToExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold transition-all"
            >
              <Download size={18} /> Export Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <Users className="text-blue-500 mb-2" />
            <p className="text-sm text-gray-500">Total Members</p>
            <h2 className="text-2xl font-bold">{members.length}</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <UserCheck className="text-emerald-500 mb-2" />
            <p className="text-sm text-gray-500">Male</p>
            <h2 className="text-2xl font-bold">{members.filter((m) => m.gender === "Male").length}</h2>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <UserCheck className="text-pink-500 mb-2" />
            <p className="text-sm text-gray-500">Female</p>
            <h2 className="text-2xl font-bold">{members.filter((m) => m.gender === "Female").length}</h2>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl p-4 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                {["Name", "Occupation", "Gender", "Birthday", "Email", "Phone", "Address", "Action"].map((h) => (
                  <th key={h} className="p-4 text-sm font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id} className="border-t border-gray-100">
                  <td className="p-4">{member.fullName}</td>
                  <td className="p-4">{member.occupation}</td>
                  <td className="p-4">{member.gender}</td>
                  <td className="p-4">{member.day} {member.month}</td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4">{member.phone}</td>
                  <td className="p-4">{member.address}</td>
                  <td className="p-4">
                    <button onClick={() => deleteMember(member._id)} className="text-red-500"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredMembers.map((member) => (
            <div key={member._id} className="bg-white p-5 rounded-3xl shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900">{member.fullName}</h3>
                <p className="text-xs text-gray-500 mt-1">{member.occupation} • {member.gender}</p>
                <p className="text-xs text-gray-400">{member.email} • {member.phone}</p>
              </div>
              <button onClick={() => deleteMember(member._id)} className="p-2 text-red-500 bg-red-50 rounded-xl">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YouthRegistrationAdmin;