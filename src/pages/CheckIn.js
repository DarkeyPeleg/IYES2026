import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const CheckIn = () => {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null);
  const config = DataService.getConfig();

  const handleCheckIn = (e) => {
    e.preventDefault();
    const result = DataService.checkIn(phone);
    setStatus(result);
    // Clear input on success to prepare for next guest
    if (result.success) setPhone('');
  };

  return (
    /* h-screen + overflow-hidden stops the WHOLE page from scrolling */
    <div className="h-screen overflow-hidden lg:flex bg-white">
      
      {/* LEFT COLUMN: Fixed Visuals (Matches Registration Page) */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-slate-100 items-center justify-center relative border-r border-slate-100 overflow-hidden">
        {config.flyer ? (
          <>
            <img src={config.flyer} className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20" alt="bg" />
            <img 
              src={config.flyer} 
              alt="Event Flyer" 
              className="relative z-10 max-h-[85vh] w-auto shadow-2xl rounded-2xl border-4 border-white object-contain" 
            />
          </>
        ) : (
          <div className="text-slate-300 font-black text-9xl tracking-tighter opacity-20 rotate-12 select-none">IYES</div>
        )}
        <div className="absolute bottom-12 left-12 z-20">
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-1">Security Terminal</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{config.name}</h1>
        </div>
      </div>

      {/* RIGHT COLUMN: The Interaction Area */}
      <div className="w-full lg:w-1/2 h-full flex flex-col bg-white">
        
        {/* Mobile Header (Fixed height on mobile, hidden on desktop) */}
        {config.flyer && (
          <div className="lg:hidden h-48 w-full flex-shrink-0 relative overflow-hidden">
            <img src={config.flyer} alt="Flyer" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6">
              <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest">Check-In Portal</p>
              <h1 className="text-white text-xl font-black uppercase tracking-tight">{config.name}</h1>
            </div>
          </div>
        )}

        {/* SCROLLABLE CONTAINER: Only this part moves */}
        <div className="flex-grow overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-md mx-auto p-8 md:p-12 space-y-10">
            
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Verify Access</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Ready for Entry</p>
              </div>

              <form onSubmit={handleCheckIn} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Registered Phone</label>
                  <input 
                    type="tel" 
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-3xl font-bold text-center tracking-[0.2em] focus:border-indigo-600 focus:bg-white outline-none transition-all"
                    placeholder="0000000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <button className="w-full bg-slate-900 text-white font-black py-6 rounded-3xl shadow-xl hover:bg-indigo-600 transition-all active:scale-95 text-lg uppercase tracking-widest">
                  Confirm Access
                </button>
              </form>

              {/* Status Feedback */}
              {status && (
                <div className={`mt-8 p-6 rounded-[2.5rem] animate-in zoom-in duration-300 ${status.success ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                  <div className="text-center">
                    <p className={`text-xl font-black uppercase tracking-tighter ${status.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {status.success ? '✓ Verified' : '✕ Denied'}
                    </p>
                    {status.success && (
                      <div className="mt-2">
                        <p className="text-slate-900 font-bold text-lg leading-none mb-1">{status.data.name}</p>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Entry Approved</p>
                      </div>
                    )}
                    {!status.success && <p className="text-rose-600 text-xs font-bold mt-1">{status.message}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Subtle Stats Row */}
            <div className="flex justify-center gap-8 pt-4">
               <div className="text-center">
                  <p className="text-2xl font-black text-slate-900 leading-none">{DataService.getStats().checkedIn}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Checked In</p>
               </div>
               <div className="w-[1px] h-8 bg-slate-100"></div>
               <div className="text-center">
                  <p className="text-2xl font-black text-slate-900 leading-none">{DataService.getStats().total}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Reg</p>
               </div>
            </div>

          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-slate-50 bg-white/80 backdrop-blur-md text-center lg:text-left flex-shrink-0">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
            Official Gate Management Terminal
          </p>
        </div>

      </div>
    </div>
  );
};

export default CheckIn;