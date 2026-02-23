import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';

const EventCreation = () => {
  const [config, setConfig] = useState({
    name: '',
    pin: '',
    capacity: '',
    location: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = DataService.getConfig();
    setConfig(existing);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    DataService.saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-center px-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Setup Console</h1>
          <p className="text-slate-500 font-medium">Configure your event parameters</p>
        </div>
        {saved && (
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase animate-bounce">
            Config Saved ✓
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-slate-100">
          <form onSubmit={handleSave} className="space-y-6">
            
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Event Identity</h3>
              <div className="space-y-4">
                <input 
                  placeholder="Event Name (e.g. Annual Tech Gala)" 
                  className={inputCls}
                  value={config.name}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                  required
                />
                <input 
                  placeholder="Venue Location" 
                  className={inputCls}
                  value={config.location}
                  onChange={(e) => setConfig({...config, location: e.target.value})}
                />
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Security PIN</h3>
                <input 
                  type="password"
                  maxLength="4"
                  placeholder="4-Digit PIN" 
                  className={`${inputCls} text-center text-2xl font-black tracking-[0.5em]`}
                  value={config.pin}
                  onChange={(e) => setConfig({...config, pin: e.target.value})}
                  required
                />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Capacity</h3>
                <input 
                  type="number"
                  placeholder="Max Attendees" 
                  className={inputCls}
                  value={config.capacity}
                  onChange={(e) => setConfig({...config, capacity: e.target.value})}
                />
              </div>
            </section>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
              Update Event Configuration
            </button>
          </form>
        </div>

        {/* Right Column: Quick Links & Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Live Preview</p>
            <h2 className="text-2xl font-black mb-1">{config.name || 'Untitled Event'}</h2>
            <p className="text-slate-400 text-sm">{config.location || 'Location not set'}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold">Admin Status</span>
                  <span className="text-xs text-red-400 font-black uppercase tracking-tighter">Locked By PIN</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-bold">Target</span>
                  <span className="text-xs text-white font-black uppercase">{config.capacity || 'Unlimited'} Guests</span>
               </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-6">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Registration Link</p>
            <p className="text-[11px] font-mono text-indigo-700 break-all bg-white/50 p-2 rounded-lg">
              {window.location.origin}/register
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventCreation;