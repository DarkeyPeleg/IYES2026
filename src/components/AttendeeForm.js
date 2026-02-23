import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const AttendeeForm = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', gender: '', location: ''
  });
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = DataService.register(formData);
    
    if (result.success) {
      setStatus({ message: 'Registration Successful!', type: 'success' });
      setFormData({ name: '', phone: '', email: '', gender: '', location: '' });
    } else {
      setStatus({ message: result.message, type: 'error' });
    }
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-base";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
        <input
          placeholder="Enter full name"
          className={inputCls}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      {/* Responsive Row 1: Phone & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Phone</label>
          <input
            type="tel"
            placeholder="050 000 0000"
            className={inputCls}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Email</label>
          <input
            type="email"
            placeholder="email@example.com"
            className={inputCls}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      {/* Responsive Row 2: Gender & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Gender</label>
          <select 
            className={inputCls}
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Location</label>
          <input
            placeholder="City"
            className={inputCls}
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
        </div>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] mt-4">
        Register Now
      </button>

      {status.message && (
        <div className={`p-4 rounded-xl text-center font-bold text-sm ${
          status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status.message}
        </div>
      )}
    </form>
  );
};

export default AttendeeForm;