import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const GroupForm = ({ config }) => {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('');

  // THE FIX: Changed to 'async' to match the DataService update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!config.groupFields || config.groupFields.length === 0) {
      setStatus('Error: No fields set up.');
      return;
    }

    const result = await DataService.registerGroup(formData);
    if (result.success) {
      setStatus(config.successMsg || 'Success!');
      // THE FIX: Clears internal state
      setFormData({});
      // THE FIX: Resets physical HTML inputs
      e.target.reset();
    } else {
      setStatus(result.message);
    }
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 text-sm font-semibold text-slate-700 shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
        {config.groupFields && config.groupFields.length > 0 ? (
          config.groupFields.map((field) => (
            <div key={field.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-indigo-600 transition-colors">
                {field.label} {field.isRequired === "1" && <span className="text-rose-500">*</span>}
              </label>

              {field.field_type === 'select' ? (
                <select 
                  className={inputCls} 
                  // THE FIX: Ties UI value to state so it can reset
                  value={formData[field.label] || ""}
                  required={field.isRequired === "1"} 
                  onChange={e => setFormData({...formData, [field.label]: e.target.value})}
                >
                  <option value="">Select Option</option>
                  {field.fieldOptions?.map((opt, index) => (
                    <option key={index} value={opt.option_value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type={field.field_type || 'text'}
                  className={inputCls} 
                  placeholder={field.label} 
                  // THE FIX: Ties UI value to state so it can reset
                  value={formData[field.label] || ""}
                  required={field.isRequired === "1"} 
                  onChange={e => setFormData({...formData, [field.label]: e.target.value})} 
                />
              )}
            </div>
          ))
        ) : null}
      </div>

      <div className="pt-2">
        <button className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-500/30 transition-all duration-500 text-[10px] uppercase tracking-[0.3em] active:scale-[0.98]">
          Register Organization
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

export default GroupForm;