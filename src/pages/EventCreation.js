import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const EventCreation = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState(DataService.getConfig());
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' or 'org'
  const [newFieldName, setNewFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    DataService.saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addField = () => {
    if (!newFieldName) return;
    const id = Date.now().toString();
    const field = { 
      id, 
      label: newFieldName, 
      type: fieldType, 
      required: true, 
      options: fieldType === 'select' ? ['Male', 'Female', 'Other'] : [] 
    };
    
    const targetKey = activeTab === 'individual' ? 'customFields' : 'groupFields';
    setConfig({ ...config, [targetKey]: [...(config[targetKey] || []), field] });
    setNewFieldName('');
  };

  const removeField = (id) => {
    const targetKey = activeTab === 'individual' ? 'customFields' : 'groupFields';
    setConfig({ ...config, [targetKey]: config[targetKey].filter(f => f.id !== id) });
  };

  const toggleRequired = (id) => {
    const targetKey = activeTab === 'individual' ? 'customFields' : 'groupFields';
    const updated = config[targetKey].map(f => f.id === id ? { ...f, required: !f.required } : f);
    setConfig({ ...config, [targetKey]: updated });
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Progress Header */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Setup Console</h1>
          {saved && <span className="text-emerald-600 font-bold animate-pulse">✓ Settings Applied</span>}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(n => <div key={n} className={`h-2 flex-1 rounded-full ${step >= n ? 'bg-indigo-600' : 'bg-slate-200'}`} />)}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 min-h-[500px] flex flex-col justify-between">
        {/* STEP 1: IDENTITY */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-slate-800">1. Event Identity</h2>
            <input className={inputCls} placeholder="Event Name" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} />
            <input className={inputCls} placeholder="Venue Location" value={config.location} onChange={e => setConfig({...config, location: e.target.value})} />
            <textarea className={`${inputCls} h-32`} placeholder="Event Description..." value={config.description} onChange={e => setConfig({...config, description: e.target.value})} />
          </div>
        )}

        {/* STEP 2: DATES & CAPACITY */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-slate-800">2. Scheduling & Limits</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="datetime-local" className={inputCls} value={config.startDate} onChange={e => setConfig({...config, startDate: e.target.value})} />
              <input type="datetime-local" className={inputCls} value={config.endDate} onChange={e => setConfig({...config, endDate: e.target.value})} />
            </div>
            <input type="number" className={inputCls} placeholder="Max Attendance" value={config.capacity} onChange={e => setConfig({...config, capacity: e.target.value})} />
            <Toggle label="Enable Organization Registration" active={config.allowGroups} onClick={() => setConfig({...config, allowGroups: !config.allowGroups})} />
          </div>
        )}

        {/* STEP 3: DYNAMIC FORM BUILDER */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-slate-800">3. Field Configuration</h2>
            
            <div className="flex gap-4 p-1 bg-slate-100 rounded-xl w-fit mb-4">
              <button onClick={() => setActiveTab('individual')} className={`px-4 py-2 rounded-lg text-xs font-black ${activeTab === 'individual' ? 'bg-white text-indigo-600 shadow' : 'text-slate-400'}`}>Individual</button>
              {config.allowGroups && <button onClick={() => setActiveTab('org')} className={`px-4 py-2 rounded-lg text-xs font-black ${activeTab === 'org' ? 'bg-white text-indigo-600 shadow' : 'text-slate-400'}`}>Organization</button>}
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
              <input className={inputCls} placeholder="Field Label (e.g. Gender)" value={newFieldName} onChange={e => setNewFieldName(e.target.value)} />
              <div className="flex gap-4">
                <select className="flex-1 p-3 rounded-xl border font-bold text-sm" value={fieldType} onChange={e => setFieldType(e.target.value)}>
                  <option value="text">Text Input</option>
                  <option value="select">Dropdown (Select)</option>
                </select>
                <button onClick={addField} className="bg-indigo-600 text-white px-8 rounded-xl font-black">Add</button>
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(activeTab === 'individual' ? config.customFields : config.groupFields)?.map(f => (
                <div key={f.id} className="flex justify-between items-center p-4 bg-white border rounded-2xl shadow-sm">
                  <span className="font-bold text-slate-700">{f.label} <span className="text-[10px] text-indigo-500 uppercase">({f.type})</span></span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleRequired(f.id)} className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${f.required ? 'bg-indigo-600 text-white' : 'text-slate-400 border-slate-200'}`}>{f.required ? 'Required' : 'Optional'}</button>
                    <button onClick={() => removeField(f.id)} className="text-rose-500 font-bold">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: SECURITY & FINISH */}
        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 text-center">
            <h2 className="text-2xl font-black text-slate-800">4. Finalize & Deploy</h2>
            <div className="max-w-xs mx-auto space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Access PIN</label>
              <input type="password" maxLength="4" className={`${inputCls} text-center text-3xl tracking-widest`} value={config.pin} onChange={e => setConfig({...config, pin: e.target.value})} />
            </div>
            <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black shadow-xl mt-8">Activate Event Portal</button>
          </div>
        )}

        <div className="flex justify-between mt-10 border-t pt-6">
          <button onClick={() => setStep(step - 1)} disabled={step === 1} className={`font-black text-xs uppercase ${step === 1 ? 'text-slate-200' : 'text-slate-400'}`}>Previous</button>
          {step < 4 && <button onClick={() => setStep(step + 1)} className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-black">Continue</button>}
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ label, active, onClick }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-3">
    <div className={`w-10 h-5 rounded-full relative transition-all ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-5' : 'left-0.5'}`} />
    </div>
    <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{label}</span>
  </button>
);

export default EventCreation;