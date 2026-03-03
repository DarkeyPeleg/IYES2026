import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const CheckIn = () => {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(null);
  // Removed the unused 'config' variable to clear the warning

  const handleCheckIn = (e) => {
    e.preventDefault();
    const result = DataService.checkIn(phone);
    setStatus(result);
    if (result.success) setPhone('');
  };

  return (
    <div className="min-h-screen lg:flex">
      {/* ... keeping your existing split layout JSX ... */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <form onSubmit={handleCheckIn} className="bg-white p-10 rounded-[3rem] shadow-2xl">
            <h2 className="text-2xl font-black mb-8 text-center">Gate Check-In</h2>
            <input 
              className="w-full p-6 bg-slate-50 border-2 rounded-3xl text-center text-2xl"
              placeholder="Attendee Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button className="w-full bg-slate-900 text-white font-black py-6 rounded-3xl mt-4">
              Verify Access
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;