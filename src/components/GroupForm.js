import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const GroupForm = () => {
  const [formData, setFormData] = useState({
    name: '',                
    address: '',             
    contact_person_name: '',  
    contact_person_phone: '', 
    contact_person_email: '', 
    number_heads: ''         
  });
  
  // Changed to object for specialized styling
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });
    
    try {
      const result = await DataService.registerGroup(formData);
      
      if (result.success) {
        setStatus({ type: 'success', msg: 'Organization Registered Successfully!' });
        setFormData({ name: '', address: '', contact_person_name: '', contact_person_phone: '', contact_person_email: '', number_heads: '' });
        setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
      } else {
        // Capture specific error message from De Graft's backend
        setStatus({ type: 'error', msg: result.message || 'Submission Error. Please try again.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network failure. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-300 text-sm font-semibold text-white placeholder:text-white/20 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Organization Identity */}
        <div className="md:col-span-2">
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Organization / Group Name</label>
          <input 
            className={inputCls} 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            placeholder="e.g. UPSA Student Union"
            required 
            disabled={loading}
          />
        </div>

        {/* Contact Person Details */}
        <div>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Contact Person Name</label>
          <input 
            className={inputCls} 
            value={formData.contact_person_name} 
            onChange={e => setFormData({...formData, contact_person_name: e.target.value})} 
            required 
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Contact Phone</label>
          <input 
            className={inputCls} 
            value={formData.contact_person_phone} 
            onChange={e => setFormData({...formData, contact_person_phone: e.target.value})} 
            required 
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Contact Email</label>
          <input 
            type="email"
            className={inputCls} 
            value={formData.contact_person_email} 
            onChange={e => setFormData({...formData, contact_person_email: e.target.value})} 
            required 
            disabled={loading}
          />
        </div>

        {/* Logistic Details */}
        <div>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Address / Location</label>
          <input 
            className={inputCls} 
            value={formData.address} 
            onChange={e => setFormData({...formData, address: e.target.value})} 
            required 
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Expected Number of Heads</label>
          <input 
            type="number"
            className={inputCls} 
            value={formData.number_heads} 
            onChange={e => setFormData({...formData, number_heads: e.target.value})} 
            required 
            disabled={loading}
          />
        </div>
      </div>

      <div className="pt-4 relative group">
        {/* Glow effect dimming when loading */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-[#f89c1d] to-purple-600 rounded-2xl blur-md transition duration-700 ${loading ? 'opacity-10' : 'opacity-25 group-hover:opacity-100'}`}></div>
        <button 
          disabled={loading}
          className="relative w-full bg-[#f89c1d] hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black py-5 rounded-2xl transition-all duration-500 text-[10px] uppercase tracking-[0.3em] active:scale-[0.98] shadow-2xl disabled:shadow-none overflow-hidden"
        >
          {/* Shine effect animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {loading ? 'Transmitting Data...' : 'Confirm Organization Registration'}
        </button>
      </div>

      {status.msg && (
        <div className={`mt-4 p-3 rounded-xl text-center font-black text-[10px] uppercase tracking-widest animate-pulse border ${
          status.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {status.msg}
        </div>
      )}
    </form>
  );
};

export default GroupForm;