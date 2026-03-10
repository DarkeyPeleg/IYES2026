import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';
import AttendeeForm from '../components/AttendeeForm';
import GroupForm from '../components/GroupForm';
import IYESFlyer from '../img/flyer.jpeg';
import { Link } from 'react-router-dom';

const Registration = () => {
  const [regType, setRegType] = useState('individual');

  useEffect(() => {
    // LOCK VIEWPORT: Prevents page-level scrolling to keep the flyer pinned
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-[#0a0510] font-sans selection:bg-purple-500/30">
      
      {/* LEFT SIDE: CINEMATIC FLYER FRAME */}
      <div className="hidden lg:flex lg:w-5/12 h-full items-center justify-center relative overflow-hidden shrink-0 border-r border-white/5 bg-[#0a0510]">
        
        {/* Ambient background glow (Pulsing Animation) */}
        <div className="absolute inset-0 z-0">
          <img 
            src={IYESFlyer} 
            className="w-full h-full object-cover opacity-20 blur-[120px] scale-150 animate-pulse" 
            style={{ animationDuration: '15s' }}
            alt="Ambient Glow" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0510] via-transparent to-purple-950/30" />
        </div>

        {/* Digital Frame (Scaled Down for Premium Feel) */}
        <div className="relative z-10 w-[65%] h-auto aspect-[3/4.2] flex items-center justify-center">
          <div className="relative group p-1.5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
            
            {/* Dynamic Backlight */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-[#f89c1d] rounded-3xl blur-xl opacity-10 group-hover:opacity-30 transition-all duration-700"></div>
            
            {/* The Image Container */}
            <div className="relative z-10 w-full h-full overflow-hidden rounded-2xl bg-[#0d0714] border border-white/5 group-hover:border-purple-500/30 transition-all duration-500">
              <img 
                src={IYESFlyer} 
                alt="IYES Ghana 2026" 
                className="relative z-0 w-full h-full object-contain transform group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
              />
              
              {/* Gold Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#f89c1d]/10 rounded-bl-full border-l border-b border-[#f89c1d]/20 blur-sm pointer-events-none"></div>
            </div>
          </div>
        </div>
        
        {/* Authenticated Terminal Label */}
        <div className="absolute bottom-12 left-12 z-20 flex flex-col gap-1.5">
          <Link to="/dashboard"> <p className="text-white/40 font-black text-[9px] uppercase tracking-[0.5em] leading-none">Authenticated Terminal</p></Link>
          <div className="h-0.5 w-12 bg-[#f89c1d] rounded-full shadow-[0_0_8px_rgba(248,156,29,0.5)]"></div>
        </div>
      </div>

      {/* RIGHT SIDE: INTERACTIVE REGISTRATION CONSOLE */}
      <div className="w-full lg:w-7/12 h-full flex flex-col bg-[#0d0714] relative">
        {/* Noise texture overlay for high-end material look */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <header className="px-8 pt-12 lg:px-20 lg:pt-20 pb-6 shrink-0 z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-[0.3em]">
                Secure Portal 2.0
              </span>
              <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Register <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#f89c1d] italic">Now.</span>
              </h1>
            </div>
            <div className="md:text-right space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">UPSA AUDITORIUM</p>
                <p className="text-[10px] font-black text-[#f89c1d] uppercase tracking-widest">MARCH 10TH - 13TH, 2026</p>
            </div>
          </div>
          
          {/* HIGH-END TAB SELECTOR */}
          <div className="relative flex p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl max-w-md">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl transition-all duration-500 ease-out shadow-lg ${regType === 'group' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
            />
            <button 
              onClick={() => setRegType('individual')}
              className={`relative z-10 flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${regType === 'individual' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >Individual</button>
            <button 
              onClick={() => setRegType('group')}
              className={`relative z-10 flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${regType === 'group' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
            >Organization</button>
          </div>
        </header>

        {/* INDEPENDENT SCROLL AREA */}
        <div className="flex-grow overflow-y-auto px-8 lg:px-20 scrollbar-hide py-6">
          <div className="max-w-xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {regType === 'individual' ? <AttendeeForm /> : <GroupForm />}
            </div>
          </div>
        </div>

        {/* PREMIUM MINIMALIST FOOTER */}
        <footer className="px-8 lg:px-20 py-8 border-t border-white/5 shrink-0 flex justify-between items-center bg-[#0d0714]/80 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Auth ID: IYES-26-SYS</p>
            <div className="h-4 w-px bg-white/5"></div>
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Terminal v2.1</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Gateway Active</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Registration;