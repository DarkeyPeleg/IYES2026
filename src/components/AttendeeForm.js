import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const AttendeeForm = () => {
  const [formData, setFormData] = useState({
    firstname: '', lastname: '', email: '', phone: '', residence: '', firstTime: false
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await DataService.register(formData);
    if (result.success) {
      setStatus('Registration Successful!');
      setFormData({ firstname: '', lastname: '', email: '', phone: '', residence: '', firstTime: false });
      setTimeout(() => setStatus(''), 5000); // Clear status after 5s
    }
  };

  // PREMIUM DARK INPUTS: Matches the Obsidian theme of Registration.js
  const inputCls = "w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-300 text-sm font-semibold text-white placeholder:text-white/20 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input placeholder="First Name" className={inputCls} value={formData.firstname} onChange={e => setFormData({...formData, firstname: e.target.value})} required />
        <input placeholder="Last Name" className={inputCls} value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} required />
        <input placeholder="Email" type="email" className={inputCls} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input placeholder="Phone" className={inputCls} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
        
        <div className="md:col-span-2">
          <input placeholder="Residence (e.g. Legon, Accra)" className={inputCls} value={formData.residence} onChange={e => setFormData({...formData, residence: e.target.value})} required />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
          <input 
            type="checkbox" 
            id="ft"
            checked={formData.firstTime} 
            onChange={e => setFormData({...formData, firstTime: e.target.checked})} 
            className="w-5 h-5 accent-purple-600 rounded border-white/20 bg-transparent" 
          />
          <label htmlFor="ft" className="text-[10px] font-black uppercase tracking-widest text-white/60">First time at IYES?</label>
        </div>
      </div>
      
      {/* THE GLOWING BUTTON SECTION */}
      <div className="pt-4 relative group">
        {/* Animated Glow Layer (Behind Button) */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#f89c1d] to-purple-600 rounded-2xl blur-md opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        
        <button className="relative w-full bg-[#f89c1d] hover:bg-purple-700 text-white font-black py-5 rounded-2xl transition-all duration-500 text-[10px] uppercase tracking-[0.3em] active:scale-[0.98] shadow-2xl overflow-hidden">
          {/* Subtle shine effect on the button */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          Confirm Registration
        </button>
      </div>

      {status && (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-black rounded-xl text-[10px] uppercase tracking-widest animate-pulse">
          {status}
        </div>
      )}
    </form>
  );
};

export default AttendeeForm;