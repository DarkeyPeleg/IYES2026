import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const CheckInForm = () => {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState({ status: 'idle', user: null, error: '' });

  const handleCheckIn = (e) => {
    e.preventDefault();
    setResult({ status: 'searching', user: null, error: '' });

    // Small delay to make it feel like it's "checking the database"
    setTimeout(() => {
      const response = DataService.checkIn(phone);
      
      if (response.success) {
        setResult({ status: 'success', user: response.data, error: '' });
        // Reset for next attendee after 3 seconds
        setTimeout(() => {
          setPhone('');
          setResult({ status: 'idle', user: null, error: '' });
        }, 3000);
      } else {
        setResult({ status: 'error', user: null, error: response.message });
      }
    }, 500);
  };

  // SUCCESS STATE (Large font for visibility at the door)
  if (result.status === 'success') {
    return (
      <div className="py-8 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-200">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-black text-slate-900 uppercase truncate px-4">
          {result.user.name}
        </h2>
        <p className="text-green-600 font-black text-sm uppercase tracking-[0.2em] mt-2">Verified Attendee ✓</p>
        <p className="text-slate-400 text-xs mt-6 font-bold uppercase tracking-widest animate-pulse">Ready for next guest...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleCheckIn} className="space-y-6">
      <div className="relative">
        <label className="absolute -top-3 left-8 bg-white px-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="050 000 0000"
          className="w-full p-6 bg-slate-50 border-2 border-slate-100 focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none transition-all text-2xl font-black text-center text-slate-700"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <button 
        disabled={result.status === 'searching'}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
      >
        {result.status === 'searching' ? (
          <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        ) : (
          "Confirm Entrance"
        )}
      </button>

      {result.status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100">
          <p className="text-red-600 font-bold text-sm">{result.error}</p>
          <button 
            onClick={() => window.location.href='/register'}
            className="mt-2 text-xs font-black text-blue-600 uppercase underline"
          >
            Register Now
          </button>
        </div>
      )}
    </form>
  );
};

export default CheckInForm;