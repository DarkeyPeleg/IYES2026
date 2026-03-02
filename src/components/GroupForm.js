import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const GroupForm = ({ config }) => {
  const [formData, setFormData] = useState({
    name: '', // Institution Name
    location: '',
    count: '',
    phone: '',
    email: ''
  });
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Register as a group type
    const result = DataService.registerGroup({
      ...formData,
      isGroup: true 
    });

    if (result.success) {
      setStatus({ 
        message: config?.successMsg || `Group "${formData.name}" Registered Successfully!`, 
        type: 'success' 
      });
      setFormData({ name: '', location: '', count: '', phone: '', email: '' });
    } else {
      setStatus({ message: 'Registration failed. Please try again.', type: 'error' });
    }
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all text-base";
  const labelCls = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 1. Institution Name - Always Required */}
      <div>
        <label className={labelCls}>Name of Institution / Org</label>
        <input
          placeholder="e.g. University of Ghana / Tech Hub"
          className={inputCls}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      {/* 2. Responsive Row: Phone (Always) & Email (Conditional) */}
      <div className={`grid grid-cols-1 ${config?.fields?.email ? 'md:grid-cols-2' : ''} gap-4`}>
        <div>
          <label className={labelCls}>Contact Phone</label>
          <input
            type="tel"
            placeholder="Primary contact number"
            className={inputCls}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>

        {/* Logic: Only show Email if enabled in Setup Console */}
        {config?.fields?.email && (
          <div>
            <label className={labelCls}>Org Email</label>
            <input
              type="email"
              placeholder="org@example.com"
              className={inputCls}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
        )}
      </div>

      {/* 3. Responsive Row: Number of People & Location (Conditional) */}
      <div className={`grid grid-cols-1 ${config?.fields?.location ? 'md:grid-cols-2' : ''} gap-4`}>
        <div>
          <label className={labelCls}>Number of People</label>
          <input
            type="number"
            placeholder="Expected count"
            className={inputCls}
            value={formData.count}
            onChange={(e) => setFormData({...formData, count: e.target.value})}
            required
          />
        </div>

        {/* Logic: Only show Location if enabled in Setup Console */}
        {config?.fields?.location && (
          <div>
            <label className={labelCls}>City / Branch</label>
            <input
              placeholder="Current location"
              className={inputCls}
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
        )}
      </div>

      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] mt-4 uppercase tracking-widest text-xs">
        Register Organization
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

export default GroupForm;