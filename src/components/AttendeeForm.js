import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const AttendeeForm = ({ config }) => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    DataService.register(formData);
    setStatus('Registration Successful!');
    setFormData({ name: '', phone: '' });
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className={inputCls} placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
      <input className={inputCls} placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />

      {/* DYNAMIC FIELDS GENERATED HERE */}
      {config.customFields?.map((field) => (
        <div key={field.id}>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">{field.label}</label>
          <input 
            className={inputCls} 
            placeholder={`Enter ${field.label}`}
            onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
            required
          />
        </div>
      ))}

      <button className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-lg mt-4">Register Now</button>
      {status && <p className="text-center font-bold text-green-600 mt-4">{status}</p>}
    </form>
  );
};

export default AttendeeForm;