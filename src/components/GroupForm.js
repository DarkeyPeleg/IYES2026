import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const GroupForm = () => {
  const [formData, setFormData] = useState({
    name: '', // This will be the Institution Name
    location: '',
    count: '',
    phone: ''
  });
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Re-mapping for the data service to keep 'name' as the primary identifier
    const result = DataService.registerGroup({
      ...formData,
      isGroup: true 
    });

    if (result.success) {
      setStatus({ message: `Group "${formData.name}" Registered Successfully!`, type: 'success' });
      setFormData({ name: '', location: '', count: '', phone: '' });
    }
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-base";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Name of Institution / Org</label>
        <input
          placeholder="e.g. University of Ghana / Google"
          className={inputCls}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Contact Phone</label>
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
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Number of People</label>
          <input
            type="number"
            placeholder="Total count"
            className={inputCls}
            value={formData.count}
            onChange={(e) => setFormData({...formData, count: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Location</label>
        <input
          placeholder="City / Branch"
          className={inputCls}
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          required
        />
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] mt-4">
        Register Organization
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

export default GroupForm;