import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const GroupForm = ({ config }) => {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!config.groupFields || config.groupFields.length === 0) {
      setStatus('Error: No fields set up.');
      return;
    }

    const result = DataService.registerGroup(formData);
    if (result.success) {
      setStatus(config.successMsg || 'Success!');
      setFormData({});
      e.target.reset();
    } else {
      setStatus(result.message);
    }
  };

  // PADDING REDUCED FROM p-4 TO p-3
  const inputCls = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-sm font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {config.groupFields && config.groupFields.length > 0 ? (
        config.groupFields.map((field) => (
          <div key={field.id}>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">
              {field.label} {field.required && <span className="text-rose-500">*</span>}
            </label>

            {field.type === 'select' ? (
              <select 
                className={inputCls} 
                required={field.required} 
                onChange={e => setFormData({...formData, [field.label]: e.target.value})}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input 
                type={field.type || 'text'}
                className={inputCls} 
                placeholder={`Enter ${field.label.toLowerCase()}`} 
                required={field.required} 
                onChange={e => setFormData({...formData, [field.label]: e.target.value})} 
              />
            )}
          </div>
        ))
      ) : null}

      <button className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all mt-2 text-xs uppercase tracking-widest">
        Register Organization
      </button>

      {status && (
        <div className={`mt-2 p-2 rounded-lg text-center font-bold text-[10px] ${status.includes('Error') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {status}
        </div>
      )}
    </form>
  );
};

export default GroupForm;