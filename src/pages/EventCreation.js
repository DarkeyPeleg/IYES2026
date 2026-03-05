import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const EventCreation = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState(DataService.getConfig());
  const [activeTab, setActiveTab] = useState('individual');
  const [newFieldName, setNewFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [saved, setSaved] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleSave = () => {
    DataService.saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleFlyerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setConfig({ ...config, flyer: canvas.toDataURL('image/jpeg', 0.7) });
        };
      };
      reader.readAsDataURL(file);
    }
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
          {saved && <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce">Settings Applied ✓</span>}
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(n => <div key={n} className={`h-2 flex-1 rounded-full ${step >= n ? 'bg-indigo-600' : 'bg-slate-200'}`} />)}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 min-h-[500px] flex flex-col justify-between">
        
        {/* STEP 1: IDENTITY + FLYER */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-slate-800">1. Event Identity</h2>
            <input className={inputCls} placeholder="Event Name" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} />
            <input className={inputCls} placeholder="Venue Location" value={config.location} onChange={e => setConfig({...config, location: e.target.value})} />
            <textarea className={`${inputCls} h-32`} placeholder="Event Description..." value={config.description} onChange={e => setConfig({...config, description: e.target.value})} />
            
            {/* Flyer Upload Area (Swapped to Step 1) */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200 text-center">
               <label className="cursor-pointer">
                  {config.flyer ? (
                    <div className="relative group">
                      <img src={config.flyer} className="h-32 mx-auto rounded-xl shadow-md mb-2" alt="Preview" />
                      <p className="text-[10px] font-black text-rose-500 uppercase">Click to Change Flyer</p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Upload Event Flyer</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFlyerUpload} />
               </label>
            </div>
          </div>
        )}

        {/* STEP 2: DATES & CAPACITY */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-slate-800">2. Scheduling & Limits</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Start Date</label>
                <input type="datetime-local" className={inputCls} value={config.startDate} onChange={e => setConfig({...config, startDate: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">End Date</label>
                <input type="datetime-local" className={inputCls} value={config.endDate} onChange={e => setConfig({...config, endDate: e.target.value})} />
              </div>
            </div>
            <input type="number" className={inputCls} placeholder="Max Attendance Capacity" value={config.capacity} onChange={e => setConfig({...config, capacity: e.target.value})} />
            <div className="pt-4">
               <Toggle label="Allow Organizations/Groups" active={config.allowGroups} onClick={() => setConfig({...config, allowGroups: !config.allowGroups})} />
            </div>
          </div>
        )}

        {/* STEP 3: DYNAMIC FORM BUILDER */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-slate-800">3. Form Fields</h2>
            
            <div className="flex gap-4 p-1 bg-slate-100 rounded-xl w-fit mb-4">
              <button onClick={() => setActiveTab('individual')} className={`px-4 py-2 rounded-lg text-xs font-black ${activeTab === 'individual' ? 'bg-white text-indigo-600 shadow' : 'text-slate-400'}`}>Individual Form</button>
              {config.allowGroups && <button onClick={() => setActiveTab('org')} className={`px-4 py-2 rounded-lg text-xs font-black ${activeTab === 'org' ? 'bg-white text-indigo-600 shadow' : 'text-slate-400'}`}>Organization Form</button>}
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
              <input className={inputCls} placeholder={`Question for ${activeTab}...`} value={newFieldName} onChange={e => setNewFieldName(e.target.value)} />
              <div className="flex gap-4">
                <select className="flex-1 p-3 rounded-xl border font-bold text-sm bg-white" value={fieldType} onChange={e => setFieldType(e.target.value)}>
                  <option value="text">Text Box</option>
                  <option value="select">Selection Dropdown</option>
                </select>
                <button onClick={addField} className="bg-indigo-600 text-white px-8 rounded-xl font-black">Add</button>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(activeTab === 'individual' ? config.customFields : config.groupFields)?.map(f => (
                <div key={f.id} className="flex justify-between items-center p-4 bg-white border rounded-2xl shadow-sm">
                  <span className="font-bold text-slate-700">{f.label} <span className="text-[9px] text-indigo-500 uppercase ml-1">[{f.type}]</span></span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleRequired(f.id)} className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${f.required ? 'bg-indigo-600 text-white' : 'text-slate-400 border-slate-200'}`}>{f.required ? 'Required' : 'Optional'}</button>
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
            <h2 className="text-2xl font-black text-slate-800">4. Security & Messages</h2>
            
            <input className={inputCls} placeholder="Custom Success Message" value={config.successMsg} onChange={e => setConfig({...config, successMsg: e.target.value})} />

            <div className="max-w-xs mx-auto space-y-4 pt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Access PIN</label>
              <div className="relative">
                <input type={showPin ? "text" : "password"} maxLength="4" className={`${inputCls} text-center text-3xl tracking-widest`} value={config.pin} onChange={e => setConfig({...config, pin: e.target.value})} />
                <button onClick={() => setShowPin(!showPin)} className="absolute right-4 top-4 text-slate-400 font-bold text-[10px] uppercase">{showPin ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black shadow-xl mt-8 hover:bg-indigo-700 active:scale-95 transition-all">
              Activate Event Configuration
            </button>
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