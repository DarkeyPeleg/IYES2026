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
    <div className="min-h-screen lg:flex animate-in fade-in duration-700">
      
      {/* LEFT COLUMN: Event Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        {config.flyer ? (
          <>
            <img src={config.flyer} alt="Event Flyer" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center">
             <div className="text-white/10 text-9xl font-black select-none tracking-tighter">GATE</div>
          </div>
        )}
        
        <div className="relative z-10 p-16 flex flex-col justify-end w-full">
          <div className="w-16 h-1 w-12 bg-indigo-500 mb-6"></div>
          <h1 className="text-5xl font-black text-white mb-2 leading-tight uppercase tracking-tighter">
            {config.name}
          </h1>
          <p className="text-indigo-300 font-bold uppercase tracking-[0.3em] text-xs">
            Entrance Management Terminal
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Check-In Logic */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900">Verify Access</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Enter registered phone number</p>
            </div>

            <form onSubmit={handleCheckIn} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Attendee Phone</label>
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
                Check In Now
              </button>
            </form>

            {/* Status Feedback Area */}
            {status && (
              <div className={`mt-8 p-6 rounded-3xl animate-in zoom-in duration-300 ${status.success ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                <div className="text-center">
                  <p className={`text-xl font-black ${status.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {status.success ? '✓ ACCESS GRANTED' : '✕ ACCESS DENIED'}
                  </p>
                  
                  {status.success && (
                    <div className="mt-2">
                      <p className="text-slate-900 font-bold text-lg">{status.data.name}</p>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Welcome to {config.name}</p>
                    </div>
                  )}
                  
                  {!status.success && (
                    <p className="text-rose-600 text-sm font-bold mt-1">{status.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Powered by IYES Security
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckIn;