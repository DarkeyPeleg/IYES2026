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
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-6">
        <div className="max-w-md w-full p-10 bg-white rounded-[3rem] shadow-xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">⌛</div>
          <h2 className="text-2xl font-black text-slate-900">Registration Closed</h2>
          <p className="text-slate-500 mt-2 font-medium">This event is no longer accepting registrations.</p>
        </div>
      </div>
    );
  }

  return (
    /* h-screen + overflow-hidden stops the WHOLE page from scrolling */
    <div className="h-screen overflow-hidden lg:flex bg-white">
      
      {/* LEFT COLUMN: Fixed Visuals (50% width on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-slate-100 items-center justify-center relative border-r border-slate-100">
        {config.flyer ? (
          <>
            <img src={config.flyer} className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-10" alt="bg" />
            <img 
              src={config.flyer} 
              alt="Event Flyer" 
              className="relative z-10 max-h-[90%] max-w-[90%] shadow-2xl rounded-2xl border-4 border-white object-contain" 
            />
          </>
        ) : (
          <div className="text-slate-200 font-black text-9xl tracking-tighter opacity-20">IYES</div>
        )}
      </div>

      {/* RIGHT COLUMN: The Form Area */}
      <div className="w-full lg:w-1/2 h-full flex flex-col bg-white">
        
        {/* Mobile Flyer (Fixed height on mobile, hidden on desktop) */}
        {config.flyer && (
          <div className="lg:hidden h-48 w-full flex-shrink-0 relative overflow-hidden">
            <img src={config.flyer} alt="Flyer" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center p-6">
              <h1 className="text-white text-xl font-black uppercase tracking-tight">{config.name}</h1>
            </div>
          </div>
        )}

        {/* SCROLLABLE CONTAINER: Only this part moves */}
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-xl mx-auto p-8 md:p-16 space-y-10">
            
            <div className="space-y-3">
              <h1 className="hidden lg:block text-4xl font-black text-slate-900 tracking-tighter leading-none">
                {config.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {config.location || 'Venue TBA'}
                </span>
                {config.startDate && (
                  <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {new Date(config.startDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                {config.description}
              </p>
            </div>

            {/* Registration Type Switcher */}
            {config.allowGroups && (
              <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full sticky top-0 z-10 shadow-sm">
                <button 
                  onClick={() => setRegType('individual')}
                  className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${regType === 'individual' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}
                >Individual</button>
                <button 
                  onClick={() => setRegType('group')}
                  className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${regType === 'group' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}
                >Organization</button>
              </div>
            )}

            {/* Dynamic Form Content */}
            <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {regType === 'individual' ? <AttendeeForm config={config} /> : <GroupForm config={config} />}
            </div>

          </div>
        </div>

        {/* Fixed Footer (Stays at the bottom of the right column) */}
        <div className="p-6 border-t border-slate-50 bg-white/80 backdrop-blur-md text-center lg:text-left flex-shrink-0">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
            IYES 2026 Verification System
          </p>
        </div>

      </div>
    </div>
  );
};

export default Registration;