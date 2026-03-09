import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const GroupForm = () => {
  const [formData, setFormData] = useState({
    firstname: '', 
    lastname: '', 
    email: '', 
    phone: '', 
    residence: '', 
    firstTime: false
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await DataService.registerGroup(formData);
    
    if (result.success) {
      setStatus('Organization Registered Successfully!');
      setFormData({ 
        firstname: '', lastname: '', email: '', phone: '', residence: '', firstTime: false 
      });
      setTimeout(() => setStatus(''), 5000);
    } else {
      setStatus(result.message || 'Registration failed');
    }
  };

  // PREMIUM OBSIDIAN INPUT STYLING
  const inputCls = "w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-300 text-sm font-semibold text-white placeholder:text-white/20 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Representative Info */}
        <div>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Rep. First Name</label>
          <input 
            className={inputCls} 
            value={formData.firstname} 
            onChange={e => setFormData({...formData, firstname: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Rep. Last Name</label>
          <input 
            className={inputCls} 
            value={formData.lastname} 
            onChange={e => setFormData({...formData, lastname: e.target.value})} 
            required 
          />
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Org. Email</label>
          <input 
            type="email" 
            className={inputCls} 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required 
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Contact Phone</label>
          <input 
            className={inputCls} 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
            required 
          />
        </div>

        {/* Location Info */}
        <div className="md:col-span-2">
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Organization Location</label>
          <input 
            className={inputCls} 
            value={formData.residence} 
            onChange={e => setFormData({...formData, residence: e.target.value})} 
            required 
          />
        </div>

        {/* First Time Check */}
        <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 transition-all hover:bg-white/10">
          <input 
            type="checkbox" 
            id="groupFirstTime"
            checked={formData.firstTime} 
            onChange={e => setFormData({...formData, firstTime: e.target.checked})}
            className="w-5 h-5 accent-purple-600 cursor-pointer rounded border-white/20 bg-transparent"
          />
          <label htmlFor="groupFirstTime" className="text-[10px] font-black text-white/60 uppercase tracking-widest cursor-pointer">
            Is this organization's first time?
          </label>
        </div>

      </div>

      {/* THE GLOWING BUTTON SECTION */}
      <div className="pt-4 relative group">
        {/* Animated Outer Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#f89c1d] to-purple-600 rounded-2xl blur-md opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        
        <button className="relative w-full bg-[#f89c1d] hover:bg-purple-700 text-white font-black py-5 rounded-2xl transition-all duration-500 text-[10px] uppercase tracking-[0.3em] active:scale-[0.98] shadow-2xl overflow-hidden">
          {/* Subtle Shine Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          Register Organization
        </button>
      </div>

      {status && (
        <div className={`mt-4 p-3 rounded-xl text-center font-black text-[10px] uppercase tracking-widest animate-in zoom-in-95 ${status.includes('failed') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
          {status}
        </div>
      )}
    </form>
  );
};

export default GroupForm;