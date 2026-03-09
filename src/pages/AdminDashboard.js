import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(DataService.getStats());
  const [activeTab, setActiveTab] = useState('individual');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setStats(DataService.getStats()), 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = stats.attendees
    .filter(a => activeTab === 'org' ? a.isGroup : !a.isGroup)
    .filter(a => Object.values(a).some(v => String(v).toLowerCase().includes(filter.toLowerCase())));

  const handleCheckIn = (id) => {
    DataService.checkIn(id);
    setStats(DataService.getStats());
  };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[#0a0510] font-sans selection:bg-purple-500/30">
      {/* 1. ANALYTICS HEADER (Pinned) */}
      <header className="shrink-0 p-8 lg:px-12 lg:pt-12 pb-6 border-b border-white/5 bg-[#0d0714]">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-[0.3em] mb-3">
              Analytics Terminal v2.1
            </span>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">IYES <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#f89c1d]">2026</span></h1>
          </div>
          
          <div className="relative group">
            <input 
              placeholder="Search ID/Phone/Name..." 
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm font-bold text-white outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 w-80 transition-all placeholder:text-white/20" 
              value={filter} 
              onChange={e => setFilter(e.target.value)} 
            />
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Registrations" value={stats.total} color="purple" />
          <StatCard title="Verified In" value={stats.checkedIn} color="emerald" />
          <StatCard title="Individuals" value={stats.attendees.filter(a => !a.isGroup).length} color="blue" />
          <StatCard title="Organizations" value={stats.attendees.filter(a => a.isGroup).length} color="amber" />
        </div>
      </header>

      {/* 2. COMMAND TABLE AREA */}
      <div className="flex-grow flex flex-col bg-[#0d0714] relative overflow-hidden">
        {/* Subtle noise texture to match Registration page */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* TAB SWITCHER */}
        <div className="flex p-4 bg-white/5 border-b border-white/5 gap-2 shrink-0 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('individual')} 
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'individual' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'text-white/40 hover:text-white/60'}`}
          >
            Individual Records
          </button>
          <button 
            onClick={() => setActiveTab('org')} 
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'org' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'text-white/40 hover:text-white/60'}`}
          >
            Organizations
          </button>
        </div>

        {/* INDEPENDENT SCROLL TABLE */}
        <div className="flex-grow overflow-y-auto scrollbar-hide">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 bg-[#0d0714]/95 backdrop-blur-xl z-20 border-b border-white/5">
              <tr className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                <th className="p-6 pl-12 border-b border-white/5">Full Name / Identity</th>
                <th className="p-6 border-b border-white/5">Contact Phone</th>
                <th className="p-6 border-b border-white/5">Residential Hub</th>
                <th className="p-6 border-b border-white/5 text-right pr-12">Action Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.length > 0 ? filteredData.map((a, i) => (
                <tr key={a.id || i} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 pl-12">
                    <p className="font-black text-white text-sm">{a.firstname} {a.lastname}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-tighter">{a.email}</p>
                  </td>
                  <td className="p-6 text-sm font-bold text-white/60 tracking-widest">{a.phone}</td>
                  <td className="p-6 text-sm font-bold text-white/60 uppercase">{a.residence}</td>
                  <td className="p-6 text-right pr-12">
                    <button 
                      onClick={() => handleCheckIn(a.id)} 
                      className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                        a.hasCheckedIn 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-[#f89c1d] text-white hover:bg-purple-600 shadow-lg shadow-orange-500/10'
                      }`}
                    >
                      {a.hasCheckedIn ? 'Verified ✓' : 'Verify Entry'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-32 text-center">
                    <p className="text-white/20 font-black italic text-sm tracking-widest">NO RECORDS FOUND IN ENCRYPTED CACHE</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const colors = {
    purple: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
    blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
  };
  return (
    <div className={`p-6 rounded-[2rem] border ${colors[color]} backdrop-blur-md`}>
      <p className="text-[8px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">{title}</p>
      <p className="text-3xl font-black tracking-tighter text-white">{value}</p>
    </div>
  );
};

export default AdminDashboard;