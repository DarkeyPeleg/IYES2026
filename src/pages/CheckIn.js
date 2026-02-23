import React from 'react';
import CheckInForm from '../components/CheckInForm';
import { DataService } from '../services/DataService';

const CheckIn = () => {
  const config = DataService.getConfig();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        
        {/* Day Indicator / Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 text-white px-6 py-2 rounded-full flex items-center gap-3 shadow-xl">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gate Access Active</span>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-slate-100 p-8 md:p-16 text-center">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {config.name || 'Event Check-In'}
            </h1>
            <p className="text-slate-500 font-medium">Please enter your phone number to verify your entry for today.</p>
          </header>

          <CheckInForm />

          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase">Step 1</p>
              <p className="text-xs font-bold text-slate-400">Search</p>
            </div>
            <div className="w-12 h-[1px] bg-slate-100"></div>
            <div className="text-center text-blue-600">
              <p className="text-[10px] font-black uppercase">Step 2</p>
              <p className="text-xs font-bold">Verify</p>
            </div>
            <div className="w-12 h-[1px] bg-slate-100"></div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase">Step 3</p>
              <p className="text-xs font-bold text-slate-400">Enter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;