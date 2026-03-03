import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const GroupForm = ({ config }) => {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if any fields exist
    if (!config.groupFields || config.groupFields.length === 0) {
      setStatus('Error: No organization fields have been configured.');
      return;
    }

    const result = DataService.registerGroup(formData);
    
    if (result.success) {
      setStatus(config.successMsg || 'Organization Registered Successfully!');
      setFormData({});
      e.target.reset(); // Reset dynamic inputs
    } else {
      setStatus(result.message || 'Registration failed.');
    }
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* CORE CHANGE: 
          Hardcoded "Official Org Name" is removed. 
          Only fields added in the Setup Console (Organization Tab) appear here.
      */}

      {config.groupFields && config.groupFields.length > 0 ? (
        config.groupFields.map((field) => (
          <div key={field.id} className="animate-in fade-in slide-in-from-bottom-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
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
                placeholder={`Enter ${field.label.toLowerCase()}...`} 
                required={field.required} 
                onChange={e => setFormData({...formData, [field.label]: e.target.value})} 
              />
            )}
          </div>
        ))
      ) : (
        <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center">
          <p className="text-slate-400 text-sm font-bold italic">
            Organization form is empty. Add fields in Setup Console (Step 3).
          </p>
        </div>
      )}

      {config.groupFields?.length > 0 && (
        <button className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-700 active:scale-95 transition-all mt-4">
          Register Organization
        </button>
      )}

      {status && (
        <div className={`mt-4 p-4 rounded-xl text-center font-bold text-sm ${status.includes('Error') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {status}
        </div>
      )}
    </form>
  );
};

export default GroupForm;