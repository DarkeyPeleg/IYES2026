import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const AttendeeForm = ({ config }) => {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = DataService.register(formData);
    if (result.success) {
      setStatus(config.successMsg || 'Registration Complete');
      setFormData({});
      e.target.reset();
    } else {
      setStatus(result.message);
    }
  };

  /**
   * REFINED PREMIUM SCALING
   * p-4: The professional standard for "spacious but tidy"
   * rounded-xl: Sharp enough to be professional, soft enough to be modern
   */
  const inputCls = "w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 text-sm font-semibold text-slate-700 shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
        {config.customFields?.map((field) => (
          <div key={field.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-indigo-600 transition-colors">
              {field.label} {field.required && <span className="text-rose-500">*</span>}
            </label>

            {field.type === 'select' ? (
              <select 
                className={inputCls}
                required={field.required}
                onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
              >
                <option value="">Select...</option>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input 
                type={field.type || 'text'}
                className={inputCls} 
                placeholder={field.label}
                required={field.required}
                onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
              />
            )}
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-500/30 transition-all duration-500 text-[10px] uppercase tracking-[0.3em] active:scale-[0.98]">
          Confirm Registration
        </button>
      </div>

      {status && (
        <div className={`mt-4 p-3 rounded-xl text-center font-bold text-[10px] animate-in zoom-in-95 ${status.includes('Error') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {status}
        </div>
      )}
    </form>
  );
};

export default AttendeeForm;