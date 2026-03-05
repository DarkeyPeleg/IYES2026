import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';
import AttendeeForm from '../components/AttendeeForm';
import GroupForm from '../components/GroupForm';

const Registration = () => {
  const [regType, setRegType] = useState('individual');
  const [config] = useState(DataService.getConfig());
  
  // High-End UX: Lock the body scroll to create a fixed "Terminal" app feel
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const isExpired = config.linkExpiry && new Date() > new Date(config.linkExpiry);

  if (isExpired) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full p-12 bg-white rounded-[3rem] shadow-2xl text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
          <div className="text-4xl mb-4">⌛</div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Portal Closed</h2>
          <p className="text-slate-400 mt-2 font-medium text-sm text-center">This registration link has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-white font-sans">
      
      {/* LEFT SIDE: Premium Framed Visuals */}
      <div className="hidden lg:flex lg:w-5/12 h-full bg-slate-950 items-center justify-center relative overflow-hidden border-r border-white/5">
        {config.flyer ? (
          <>
            {/* 1. Deep Background Layer: Blurred and Darkened */}
            <img 
              src={config.flyer} 
              className="absolute inset-0 w-full h-full object-cover opacity-10 blur-[60px] scale-125" 
              alt="bg" 
            />
            
            {/* 2. Gradient Vignette: Softens the edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent" />

            {/* 3. The "Frame": Keeps the picture from showing "too full" */}
            <div className="relative z-10 w-[75%] h-[75%] flex items-center justify-center">
              <div className="relative group">
                <div className="absolute -inset-6 bg-indigo-500/20 rounded-[3rem] blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                <img 
                  src={config.flyer} 
                  alt="Event Flyer" 
                  className="relative z-10 max-h-full max-w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] rounded-[2.5rem] border border-white/10 object-contain hover:scale-[1.02] transition-transform duration-700" 
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-white/5 text-[10rem] font-black rotate-12 uppercase select-none tracking-tighter">IYES</div>
        )}
        
        <div className="absolute bottom-10 left-10 z-20">
          <p className="text-white/40 font-black text-[9px] uppercase tracking-[0.5em] mb-1">Authenticated Terminal</p>
          <div className="h-0.5 w-8 bg-indigo-500"></div>
        </div>
      </div>

      {/* RIGHT SIDE: High-End Interactive Form */}
      <div className="w-full lg:w-7/12 h-full flex flex-col bg-white relative">
        
        {/* Mobile Header Image (Fixed) */}
        {config.flyer && (
          <div className="lg:hidden h-40 w-full flex-shrink-0 relative overflow-hidden">
            <img src={config.flyer} alt="Flyer" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-end p-6">
               <h1 className="text-white text-xl font-black uppercase tracking-tight">{config.name}</h1>
            </div>
          </div>
        )}

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-grow overflow-y-auto scrollbar-hide">
          <div className="max-w-2xl mx-auto p-8 md:p-14 lg:p-20 space-y-12">
            
            <header className="space-y-4">
              <div className="space-y-2">
                <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">Official Portal</p>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  {config.name}
                </h1>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {config.location || 'Accra, Ghana'}
                </span>
                {config.startDate && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {new Date(config.startDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <p className="text-slate-400 font-medium leading-relaxed text-sm max-w-lg">
                {config.description}
              </p>
            </header>

            {/* Premium Tab Selector */}
            {config.allowGroups && (
              <div className="flex p-1.5 bg-slate-100/80 rounded-[1.5rem] w-full sticky top-0 z-20 backdrop-blur-md shadow-sm border border-white/50">
                <button 
                  onClick={() => setRegType('individual')}
                  className={`flex-1 py-3.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${regType === 'individual' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                >Individual</button>
                <button 
                  onClick={() => setRegType('group')}
                  className={`flex-1 py-3.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${regType === 'group' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                >Organization</button>
              </div>
            )}

            {/* THE FORM */}
            <div className="pb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {regType === 'individual' ? <AttendeeForm config={config} /> : <GroupForm config={config} />}
            </div>

          </div>
        </div>

        {/* FIXED FOOTER */}
        <footer className="p-8 border-t border-slate-50 bg-white/90 backdrop-blur-md flex-shrink-0 flex justify-between items-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
            Terminal v2.1
          </p>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-center">System Live</span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Registration;