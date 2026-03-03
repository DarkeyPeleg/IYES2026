import React, { useState } from 'react';
import { DataService } from '../services/DataService';
import AttendeeForm from '../components/AttendeeForm';
import GroupForm from '../components/GroupForm';

const Registration = () => {
  const [regType, setRegType] = useState('individual');
  const [config] = useState(DataService.getConfig());
  
  const isExpired = config.linkExpiry && new Date() > new Date(config.linkExpiry);

  if (isExpired) {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] shadow-xl text-center border border-slate-100">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">⌛</div>
        <h2 className="text-2xl font-black text-slate-900">Registration Closed</h2>
        <p className="text-slate-500 mt-2 font-medium">This event link has expired.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      {/* LEFT COLUMN: Visual & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden">
        {config.flyer ? (
          <img src={config.flyer} alt="Event" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center">
             <span className="text-white/20 text-9xl font-black select-none">IYES</span>
          </div>
        )}
        <div className="relative z-10 p-16 flex flex-col justify-end w-full bg-gradient-to-t from-indigo-950/80 to-transparent">
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">{config.name}</h1>
          <div className="flex items-center gap-4 text-indigo-100 font-bold uppercase tracking-widest text-sm">
            <span>{config.location}</span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
            <span>{new Date(config.startDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-xl space-y-8">
          {/* Mobile Flyer (only shows on small screens) */}
          <div className="lg:hidden mb-8 rounded-3xl overflow-hidden shadow-lg">
            <img src={config.flyer} alt="Flyer" className="w-full h-auto" />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Join the Event</h2>
            <p className="text-slate-500 font-medium">{config.description}</p>
          </div>

          {config.allowGroups && (
            <div className="flex p-1 bg-slate-100 rounded-2xl w-full max-w-sm">
              <button 
                onClick={() => setRegType('individual')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${regType === 'individual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >Individual</button>
              <button 
                onClick={() => setRegType('group')}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${regType === 'group' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >Organization</button>
            </div>
          )}

          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {regType === 'individual' ? <AttendeeForm config={config} /> : <GroupForm config={config} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;