import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Imagelogo from "../assets/images/IMG_5009.png";
import axios from "axios";

const ChurchRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    day: '',
    month: '',
    address: '',
    email: '',
    phone: '',
    occupation: '',
    gender: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDayChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= 31)) {
      setFormData({ ...formData, day: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/youth/register`,
        formData
      );

      if (response.data?.success === true) {
        setStatus("success");
        setFormData({
          fullName: '',
          day: '',
          month: '',
          address: '',
          email: '',
          phone: '',
          occupation: '',
          gender: ''
        });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("error");
        setErrorMessage(response.data?.message || "Registration failed");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Network or server error";
      setErrorMessage(msg);
      setStatus("error");
      setTimeout(() => setStatus(null), 6000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 relative">
      {loading && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-[2px]">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center border border-gray-100">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
            <p className="mt-4 font-bold text-gray-900 tracking-widest text-xs uppercase">
              Processing...
            </p>
          </div>
        </div>
      )}

      <div className={`relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl p-8 border border-gray-100 transition-all duration-500 ${loading ? 'blur-[4px] pointer-events-none' : ''}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl shadow-inner flex items-center justify-center mb-4 overflow-hidden border border-gray-100">
            <img src={Imagelogo} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                <span className="block text-green-600">The Redeemed Christian Church of God</span>
                <span className="block text-2xl font-semibold text-gray-800">Glory of God Zone</span>
                <span className="block text-lg font-medium text-gray-500">Region 37, Lagos Province</span>
              </h1>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-4">
                Bio Data Registration
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all hover:scale-105 cursor-default">
              <span className="animate-bounce">
                <AlertCircle size={14} />
              </span>
              Youth and young adult
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Full Name" />
          <InputField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email Address" />
          <InputField label="Phone Number" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone Number" />
          <InputField label="Occupation" value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} placeholder="e.g. Student" />
          <InputField label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Residential Address" />

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Birth Day" type="number" min="1" max="31" value={formData.day} onChange={handleDayChange} placeholder="DD" />
            <SelectField label="Birth Month" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} options={['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']} />
          </div>

          <SelectField label="Gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} options={['Male', 'Female']} />

          <button disabled={loading} type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all">
            {loading ? "Processing..." : "Submit Bio Data"}
          </button>
        </form>
      </div>

      {status === 'success' && <PopupSuccess />}
      {status === 'error' && <PopupError message={errorMessage} />}
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{label}</label>
    <input {...props} required className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 focus:ring-2 focus:ring-red-500 outline-none text-sm" />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">{label}</label>
    <select {...props} required className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 focus:ring-2 focus:ring-red-500 outline-none text-sm">
      <option value="">Select</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const PopupSuccess = () => (
  <div className="fixed top-10 left-4 right-4 z-[100] max-w-lg mx-auto">
    <div className="bg-white p-4 rounded-3xl shadow border border-green-200 flex items-center gap-4">
      <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle2 size={24} /></div>
      <div><h4 className="font-bold">Information Received!</h4><p className="text-xs text-gray-500">Your details are saved.</p></div>
    </div>
  </div>
);

const PopupError = ({ message }) => (
  <div className="fixed top-10 left-4 right-4 z-[100] max-w-lg mx-auto">
    <div className="bg-white p-4 rounded-3xl shadow border border-red-200 flex items-center gap-4">
      <div className="bg-red-100 p-3 rounded-full text-red-600"><AlertCircle size={24} /></div>
      <div><h4 className="font-bold">Submission Failed</h4><p className="text-xs text-red-500">{message}</p></div>
    </div>
  </div>
);

export default ChurchRegistrationForm;