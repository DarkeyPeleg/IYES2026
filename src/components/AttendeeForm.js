import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const AttendeeForm = ({ config }) => {
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Safety check: Don't submit if there are no fields
    if (!config.customFields || config.customFields.length === 0) {
      setStatus('Error: No registration fields have been set up.');
      return;
    }

    const result = DataService.register(formData);
    
    if (result.success) {
      setStatus(config.successMsg || 'Registration Successful!');
      setFormData({});
      e.target.reset(); // Clears all dynamic inputs
    } else {
      setStatus(result.message);
    }
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* CORE CHANGE: 
          We removed the hardcoded Name and Phone inputs. 
          The form now ONLY shows what you create in the Setup Console.
      */}

      {config.customFields && config.customFields.length > 0 ? (
        config.customFields.map((field) => (
          <div key={field.id} className="animate-in fade-in slide-in-from-bottom-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
              {field.label} {field.required && <span className="text-rose-500">*</span>}
            </label>

            {field.type === 'select' ? (
              <select 
                className={inputCls}
                required={field.required}
                onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input 
                type={field.type || 'text'}
                className={inputCls} 
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                required={field.required}
                onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
              />
            )}
          </div>
        ))
      ) : (
        <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center">
          <p className="text-slate-400 text-sm font-bold italic">
            Form is currently empty. Please add fields in the Setup Console.
          </p>
        </div>
      )}

      {config.customFields?.length > 0 && (
        <button className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-indigo-700 active:scale-95 transition-all mt-4">
          Register Now
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

export default AttendeeForm;