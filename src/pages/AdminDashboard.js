import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';

const AdminDashboard = () => {
  // 1. INITIALIZE WITH DEFAULTS: Prevents the "filter of undefined" error
  const [stats, setStats] = useState({
    total: 0,
    checkedIn: 0,
    attendees: [] // Always start with an empty array
  });
  const [activeTab, setActiveTab] = useState('individual');
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const data = await DataService.getStats();
      // Ensure we always have an array even if data.attendees is missing
      setStats({
        ...data,
        attendees: data.attendees || []
      });
      setError(null);
    } catch (err) {
      setError("Terminal Access Denied: Check your Auth Token");
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Live sync every 5s
    return () => clearInterval(interval);
  }, []);

  // 2. SAFE FILTERING: Added optional chaining and default empty array
  const filteredData = (stats.attendees || [])
    .filter(a => activeTab === 'org' ? a.isGroup : !a.isGroup)
    .filter(a => {
        const searchStr = `${a.firstname} ${a.lastname} ${a.name} ${a.phone}`.toLowerCase();
        return searchStr.includes(filter.toLowerCase());
    });

  const handleCheckIn = async (id) => {
    const success = await DataService.checkIn(id);
    if (success) loadData();
  };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[#0a0510] font-sans selection:bg-purple-500/30">
      
      {/* ERROR OVERLAY: Appears if Token is missing */}
      {error && (
        <div className="absolute inset-0 z-[100] bg-[#0a0510]/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 border border-rose-500/20 bg-rose-500/5 rounded-[2.5rem]">
            <p className="text-rose-400 font-black text-xs uppercase tracking-widest mb-4">Security Breach</p>
            <h2 className="text-white text-2xl font-black mb-6">{error}</h2>
            <p className="text-white/40 text-sm mb-8">Please ensure the auth_token cookie is set via the Login portal or Browser Console.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white text-black font-black rounded-xl uppercase text-[10px] tracking-widest">Retry Terminal Link</button>
          </div>
        </div>
      )}

      {/* ANALYTICS HEADER */}
      <header className="shrink-0 p-8 lg:px-12 border-b border-white/5 bg-[#0d0714]">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-[0.3em] mb-3">
              Analytics Terminal v2.1
            </span>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">IYES <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#f89c1d]">2026</span></h1>
          </div>
          <input 
            placeholder="Search Records..." 
            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm font-bold text-white outline-none focus:border-purple-500 w-80 transition-all placeholder:text-white/20" 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Registrations" value={stats.total} color="purple" />
          <StatCard title="Verified In" value={stats.checkedIn} color="emerald" />
          <StatCard title="Individual" value={(stats.attendees || []).filter(a => !a.isGroup).length} color="blue" />
          <StatCard title="Org" value={(stats.attendees || []).filter(a => a.isGroup).length} color="amber" />
        </div>
      </header>

      {/* TABLE AREA */}
      <div className="flex-grow flex flex-col bg-[#0d0714] relative overflow-hidden">
        <div className="flex p-4 bg-white/5 border-b border-white/5 gap-2 shrink-0">
          <button onClick={() => setActiveTab('individual')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'individual' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-white/40'}`}>Individuals</button>
          <button onClick={() => setActiveTab('org')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'org' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-white/40'}`}>Organizations</button>
        </div>

        <div className="flex-grow overflow-y-auto scrollbar-hide">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 bg-[#0d0714]/95 backdrop-blur-xl z-20">
              <tr className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                <th className="p-6 pl-12 border-b border-white/5">Identity</th>
                <th className="p-6 border-b border-white/5">Contact</th>
                <th className="p-6 border-b border-white/5 text-right pr-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((a, i) => (
                <tr key={a.id || i} className="group hover:bg-white/[0.02]">
                  <td className="p-6 pl-12">
                    <p className="font-black text-white text-sm">{a.name || `${a.firstname} ${a.lastname}`}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-tighter">{a.email || a.contact_person_email}</p>
                  </td>
                  <td className="p-6 text-sm font-bold text-white/60 tracking-widest">{a.phone || a.contact_person_phone}</td>
                  <td className="p-6 text-right pr-12">
                    <button onClick={() => handleCheckIn(a.id)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${a.hasCheckedIn ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#f89c1d] text-white shadow-lg shadow-orange-500/10'}`}>
                      {a.hasCheckedIn ? 'Verified ✓' : 'Verify Entry'}
                    </button>
                  </td>
                </tr>
              ))}
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
    <div className={`p-6 rounded-3xl border ${colors[color]} backdrop-blur-md`}>
      <p className="text-[8px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">{title}</p>
      <p className="text-3xl font-black tracking-tighter text-white">{value}</p>
    </div>
  );
};

export default AdminDashboard;