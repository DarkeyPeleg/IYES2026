import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';

const CheckIn = () => {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null);
  const config = DataService.getConfig();

  // Premium UX: Lock the body scroll for a professional terminal feel
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleCheckIn = (e) => {
    e.preventDefault();
    const result = DataService.checkIn(phone);
    setStatus(result);
    // Clear input on success to prepare for next guest
    if (result.success) setPhone('');
  };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-white font-sans">
      
      {/* LEFT SIDE: Premium Framed Visuals (Matching Registration) */}
      <div className="hidden lg:flex lg:w-5/12 h-full bg-slate-950 items-center justify-center relative overflow-hidden border-r border-white/5">
        {config.flyer ? (
          <>
            <img 
              src={config.flyer} 
              className="absolute inset-0 w-full h-full object-cover opacity-10 blur-[60px] scale-125" 
              alt="bg" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
            
            <div className="relative z-10 w-[75%] h-[75%] flex items-center justify-center">
              <div className="relative group">
                <div className="absolute -inset-6 bg-indigo-500/20 rounded-[3rem] blur-3xl transition-all duration-700"></div>
                <img 
                  src={config.flyer} 
                  alt="Event Flyer" 
                  className="relative z-10 max-h-full max-w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] rounded-[2.5rem] border border-white/10 object-contain" 
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-white/5 text-[10rem] font-black rotate-12 uppercase select-none tracking-tighter">GATE</div>
        )}
        
        <div className="absolute bottom-10 left-10 z-20">
          <p className="text-white/40 font-black text-[9px] uppercase tracking-[0.5em] mb-1">Gate Management</p>
          <div className="h-0.5 w-8 bg-indigo-500"></div>
        </div>
      </div>

      {/* RIGHT SIDE: Terminal Interaction Area */}
      <div className="w-full lg:w-7/12 h-full flex flex-col bg-white">
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-slate-950 p-6 flex-shrink-0 flex justify-between items-center">
          <h1 className="text-white font-black text-lg tracking-tight uppercase">{config.name}</h1>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>

        {/* CENTERED INTERACTION CONTENT */}
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-10">
            
            <div className="bg-white p-12 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Access Control</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Enter Registered Phone</p>
              </div>

              <form onSubmit={handleCheckIn} className="space-y-8">
                <div className="space-y-3">
                  <input 
                    type="tel" 
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-4xl font-bold text-center tracking-[0.2em] focus:border-indigo-600 focus:bg-white outline-none transition-all placeholder:text-slate-200"
                    placeholder="0000000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <button className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-[0.97] text-sm uppercase tracking-[0.3em]">
                  Verify Identity
                </button>
              </form>

              {/* Status Display Area */}
              {status && (
                <div className={`mt-10 p-6 rounded-[2.5rem] animate-in zoom-in-95 duration-300 ${status.success ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                  <div className="text-center">
                    <p className={`text-xl font-black uppercase tracking-tighter ${status.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {status.success ? '✓ Identity Confirmed' : '✕ Access Denied'}
                    </p>
                    {status.success && (
                      <div className="mt-2">
                        <p className="text-slate-900 font-bold text-lg leading-tight">{status.data.name}</p>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Guest Verified</p>
                      </div>
                    )}
                    {!status.success && <p className="text-rose-600 text-xs font-bold mt-1 uppercase tracking-wider">{status.message}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Live Stats Bar */}
            <div className="flex justify-center gap-12 pt-6">
               <div className="text-center">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{DataService.getStats().checkedIn}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">In Venue</p>
               </div>
               <div className="w-[1px] h-10 bg-slate-100"></div>
               <div className="text-center">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{DataService.getStats().total}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expected</p>
               </div>
            </div>

          </div>
        </div>

        {/* FIXED FOOTER */}
        <footer className="p-8 border-t border-slate-50 bg-white/90 backdrop-blur-md flex-shrink-0 flex justify-between items-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
            Security Node v2.1
          </p>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default CheckIn;