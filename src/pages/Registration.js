import React, { useState } from 'react'; // Removed unused useEffect
import { DataService } from '../services/DataService';
import AttendeeForm from '../components/AttendeeForm';
import GroupForm from '../components/GroupForm';

const Registration = () => {
  const [regType, setRegType] = useState('individual');
  // Removed setConfig since we only need to read the data
  const [config] = useState(DataService.getConfig());
  
  // Logic: Is the link expired?
  const isExpired = config.linkExpiry && new Date() > new Date(config.linkExpiry);

  if (isExpired) {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] shadow-xl text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">⌛</div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Registration Closed</h2>
        <p className="text-slate-500 mt-2 font-medium">The registration link for this event has expired. Please contact the organizer for assistance.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-10">
      {/* 1. Flyer Display */}
      {config.flyer && (
        <div className="mb-8 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white animate-in slide-in-from-top duration-700">
          <img src={config.flyer} alt="Event Flyer" className="w-full h-auto" />
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{config.name}</h1>
        <p className="text-slate-500 font-medium mt-2">{config.description || 'Welcome! Please fill the form below to register.'}</p>
        
        {config.location && (
          <div className="flex items-center justify-center gap-2 mt-2 text-xs font-bold text-indigo-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {config.location}
          </div>
        )}
      </div>

      {/* 2. Type Switcher (Only shows if Group Reg is enabled) */}
      {config.allowGroups && (
        <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 max-w-sm mx-auto shadow-inner">
          <button 
            onClick={() => setRegType('individual')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${regType === 'individual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
          >
            Individual
          </button>
          <button 
            onClick={() => setRegType('group')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${regType === 'group' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-500'}`}
          >
            Group/Org
          </button>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {regType === 'individual' ? (
          <AttendeeForm config={config} />
        ) : (
          <GroupForm config={config} />
        )}
      </div>
    </div>
  );
};

export default Registration;