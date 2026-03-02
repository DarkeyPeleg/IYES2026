import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const EventCreation = () => {
  const [config, setConfig] = useState(DataService.getConfig());
  const [showPin, setShowPin] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    DataService.saveConfig(config);
    setSaved(true);
    setShowBroadcast(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleFlyerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setConfig({ ...config, flyer: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const inputCls = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-sm";

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Setup Console</h1>
          <p className="text-slate-500 font-medium italic">Configure Global Event & Marketing Parameters</p>
        </div>
        {saved && (
          <span className="bg-green-500 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest animate-bounce shadow-lg shadow-green-100">
            Settings Saved! ✓
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          
          {/* MULTI-SELECT STRATEGY SECTION */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Registration Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setConfig({...config, regMode: {...config.regMode, preReg: !config.regMode.preReg}})}
                className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${config.regMode.preReg ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50 opacity-60'}`}
              >
                <div className="text-left">
                  <p className={`font-black ${config.regMode.preReg ? 'text-indigo-900' : 'text-slate-400'}`}>Online Pre-Reg</p>
                  <p className="text-[10px] text-slate-500 font-medium">Public link for social media</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.regMode.preReg ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-transparent'}`}>✓</div>
              </button>

              <button 
                type="button"
                onClick={() => setConfig({...config, regMode: {...config.regMode, onSite: !config.regMode.onSite}})}
                className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${config.regMode.onSite ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100 bg-slate-50 opacity-60'}`}
              >
                <div className="text-left">
                  <p className={`font-black ${config.regMode.onSite ? 'text-emerald-900' : 'text-slate-400'}`}>On-Site Portal</p>
                  <p className="text-[10px] text-slate-500 font-medium">For tablets at the entrance</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.regMode.onSite ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'}`}>✓</div>
              </button>
            </div>
          </section>

          {/* IDENTITY & BRANDING */}
          <section className="space-y-4 pt-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Event Identity & Branding</h3>
            <input className={inputCls} placeholder="Event Name" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} required />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className={inputCls} placeholder="Venue/Location" value={config.location} onChange={e => setConfig({...config, location: e.target.value})} />
              <input className={inputCls} type="datetime-local" value={config.dateTime} onChange={e => setConfig({...config, dateTime: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Program Flyer</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all overflow-hidden relative">
                  {config.flyer ? (
                    <img src={config.flyer} className="w-full h-full object-cover" alt="Flyer" />
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-[10px] font-bold text-slate-400 mt-2">Upload Flyer</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleFlyerUpload} />
                </label>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Link Expiration</label>
                <input type="datetime-local" className={inputCls} value={config.linkExpiry} onChange={e => setConfig({...config, linkExpiry: e.target.value})} />
                <p className="text-[9px] text-slate-400 italic">Global registration cut-off time.</p>
              </div>
            </div>

            <textarea className={`${inputCls} h-24 resize-none`} placeholder="Event Description" value={config.description} onChange={e => setConfig({...config, description: e.target.value})} />
            <input className={inputCls} placeholder="Custom Success Message" value={config.successMsg} onChange={e => setConfig({...config, successMsg: e.target.value})} />
          </section>

          <section className="space-y-4 pt-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Field Configuration</h3>
            <div className="flex flex-wrap gap-x-10 gap-y-6 pt-2">
               <Toggle label="Enable Groups" active={config.allowGroups} onClick={() => setConfig({...config, allowGroups: !config.allowGroups})} />
               <Toggle label="Ask Email" active={config.fields.email} onClick={() => setConfig({...config, fields: {...config.fields, email: !config.fields.email}})} />
               <Toggle label="Ask Gender" active={config.fields.gender} onClick={() => setConfig({...config, fields: {...config.fields, gender: !config.fields.gender}})} />
               <Toggle label="Ask Location" active={config.fields.location} onClick={() => setConfig({...config, fields: {...config.fields, location: !config.fields.location}})} />
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Security PIN</h3>
            <div className="relative">
              <input 
                type={showPin ? "text" : "password"} 
                maxLength="4" 
                className="w-full bg-white/10 border-2 border-white/10 p-5 rounded-2xl text-4xl font-black text-center tracking-[0.5em] outline-none"
                value={config.pin}
                onChange={e => setConfig({...config, pin: e.target.value.replace(/\D/g, '')})}
              />
              <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                {showPin ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center shadow-xl">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Marketing Deployment</h3>
            
            <button type="submit" onClick={handleSave} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
              Deploy & Broadcast
            </button>

            {showBroadcast && (
               <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-left animate-in zoom-in duration-300">
                 <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Social Media Broadcast</p>
                 <div className="text-[11px] text-slate-600 leading-relaxed font-medium mb-3">
                   🚀 Join us for <span className="font-bold">{config.name}</span>! <br/>
                   📍 {config.location || 'At the venue'}<br/>
                   🔗 Register: {window.location.origin}/register
                 </div>
                 <button 
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`🚀 Join us for ${config.name}! Register here: ${window.location.origin}/register`);
                    alert("Broadcast message copied!");
                  }}
                  className="w-full py-2 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg hover:bg-indigo-200"
                 >
                   COPY MESSAGE
                 </button>
               </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

const Toggle = ({ label, active, onClick }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-4">
    <div className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-green-500' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
    </div>
    <span className={`text-xs font-black uppercase tracking-tight ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
  </button>
);

export default EventCreation;