import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';

const Settings = () => {
  const [profile, setProfile] = useState({ name: '', email: '', role: '', avatar: null });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [newPin, setNewPin] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    const admin = DataService.getUserProfile();
    setProfile(admin);
  }, []);

  const showAlert = (message, type) => {
    setStatus({ message, type });
    setTimeout(() => setStatus({ message: '', type: '' }), 4000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile({ ...profile, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const saveGeneralProfile = (e) => {
    e.preventDefault();
    DataService.saveUserProfile(profile);
    showAlert("Profile details updated!", "success");
    setTimeout(() => window.location.reload(), 1000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return showAlert("Passwords do not match", "error");
    DataService.updatePassword(passwords.new);
    setPasswords({ current: '', new: '', confirm: '' });
    showAlert("Login password changed!", "success");
  };

  const handlePinUpdate = (e) => {
    e.preventDefault();
    if (newPin.length !== 4) return showAlert("PIN must be 4 digits", "error");
    DataService.updateEventPin(newPin);
    setNewPin('');
    showAlert("Entrance PIN updated!", "success");
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all";

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-slate-900">Account & Security</h1>

      {status.message && (
        <div className={`fixed top-24 right-8 z-50 p-4 rounded-2xl shadow-2xl font-bold animate-in slide-in-from-right duration-300 ${
          status.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Profile & Avatar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              {profile.avatar ? (
                <img src={profile.avatar} className="w-full h-full rounded-full object-cover border-4 border-indigo-50 shadow-md" alt="Avatar" />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">
                  {profile.name?.charAt(0)}
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-indigo-600 p-2.5 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            
            <form onSubmit={saveGeneralProfile} className="space-y-4">
              <input className={inputCls} value={profile.name} placeholder="Full Name" onChange={e => setProfile({...profile, name: e.target.value})} />
              <input className={inputCls} value={profile.role} placeholder="Job Title / Role" onChange={e => setProfile({...profile, role: e.target.value})} />
              {/* RE-ADDED EMAIL FIELD HERE */}
              <input className={inputCls} type="email" value={profile.email} placeholder="Email Address" onChange={e => setProfile({...profile, email: e.target.value})} />
              <button className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">Save Profile</button>
            </form>
          </div>
        </div>

        {/* RIGHT: Security Controls */}
        <div className="lg:col-span-2 space-y-8">
          {/* Password Section */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              Password Management
            </h2>
            <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="password" placeholder="Current Password" className={inputCls} value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required />
              <div className="hidden md:block"></div>
              <input type="password" placeholder="New Password" className={inputCls} value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} required />
              <input type="password" placeholder="Confirm New Password" className={inputCls} value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required />
              <div className="md:col-span-2">
                <button className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-all">Update Login Password</button>
              </div>
            </form>
          </div>

          {/* PIN Section */}
          <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl text-white">
            <h2 className="text-xl font-black mb-2">Event Access PIN</h2>
            <p className="text-slate-400 text-sm mb-8 font-medium">This 4-digit code is required for the Admin Dashboard and Entrance Verification.</p>
            
            <form onSubmit={handlePinUpdate} className="flex flex-col md:flex-row items-center gap-6">
              <input 
                type="text" 
                maxLength="4" 
                placeholder="0000" 
                className="w-full md:w-48 p-5 bg-white/10 border-2 border-white/20 rounded-2xl text-center text-4xl font-black tracking-[0.4em] focus:border-white focus:bg-white/20 outline-none transition-all text-white"
                value={newPin}
                onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                required
              />
              <button className="w-full md:w-auto bg-white text-slate-900 font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-slate-100 transition-all active:scale-95">
                Update Security PIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;