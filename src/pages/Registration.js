import React, { useState } from 'react';
import AttendeeForm from '../components/AttendeeForm';
import GroupForm from '../components/GroupForm'; // We will create this next

const Registration = () => {
  const [regType, setRegType] = useState('individual'); // 'individual' or 'group'

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Registration</h1>
        <p className="text-slate-500 font-medium mt-2">Choose your registration type below</p>
      </div>

      {/* Type Switcher */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 max-w-sm mx-auto">
        <button 
          onClick={() => setRegType('individual')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${regType === 'individual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Individual
        </button>
        <button 
          onClick={() => setRegType('group')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${regType === 'group' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Organization/Group
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-8 md:p-12 border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {regType === 'individual' ? <AttendeeForm /> : <GroupForm />}
      </div>
    </div>
  );
};

export default Registration;