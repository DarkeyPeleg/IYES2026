import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const AttendeeForm = ({ config }) => {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', gender: '', location: ''
  });
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = DataService.register(formData);
    
    if (result.success) {
      // Logic: Use the Custom Success Message from Setup Console, fallback to default if empty
      setStatus({ 
        message: config?.successMsg || 'Registration Successful!', 
        type: 'success' 
      });
      setFormData({ name: '', phone: '', email: '', gender: '', location: '' });
    } else {
      setStatus({ message: result.message, type: 'error' });
    }
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all text-base";
  const labelCls = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name - Always Required */}
      <div>
        <label className={labelCls}>Full Name</label>
        <input
          placeholder="Enter full name"
          className={inputCls}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      {/* Row: Phone (Always) & Email (Conditional) */}
      <div className={`grid grid-cols-1 ${config?.fields?.email ? 'md:grid-cols-2' : ''} gap-4`}>
        <div>
          <label className={labelCls}>Phone</label>
          <input
            type="tel"
            placeholder="050 000 0000"
            className={inputCls}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>
        
        {/* Logic: Only show Email if enabled in Setup Console */}
        {config?.fields?.email && (
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              className={inputCls}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
        )}
      </div>

      {/* Row: Gender & Location (Both Conditional) */}
      <div className={`grid grid-cols-1 ${(config?.fields?.gender && config?.fields?.location) ? 'md:grid-cols-2' : ''} gap-4`}>
        
        {/* Logic: Only show Gender if enabled */}
        {config?.fields?.gender && (
          <div>
            <label className={labelCls}>Gender</label>
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
        )}

        {/* Logic: Only show Location if enabled */}
        {config?.fields?.location && (
          <div>
            <label className={labelCls}>Location</label>
            <input
              placeholder="City"
              className={inputCls}
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
        )}
      </div>

      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] mt-4">
        Register Now
      </button>

      {status.message && (
        <div className={`p-4 rounded-xl text-center font-bold text-sm animate-in fade-in duration-300 ${
          status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status.message}
        </div>
      )}
    </form>
  );
};

export default AttendeeForm;