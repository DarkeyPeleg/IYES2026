import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(DataService.getStats());
  const [config] = useState(DataService.getConfig());
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(DataService.getStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const dynamicColumns = config.customFields || [];
  
  const filteredAttendees = stats.attendees.filter(a => {
    const searchTerm = filter.toLowerCase();
    return Object.values(a).some(val => String(val).toLowerCase().includes(searchTerm));
  });

  // Export Logic: Converts dynamic data into a downloadable CSV file
  const exportToCSV = () => {
    if (stats.attendees.length === 0) return alert("No data to export");

    const headers = ["Type", ...dynamicColumns.map(c => c.label), "Status", "Time"];
    const rows = stats.attendees.map(a => [
      a.isGroup ? "ORG" : "IND",
      ...dynamicColumns.map(c => a[c.label] || ""),
      a.hasCheckedIn ? "Checked In" : "Registered",
      new Date(a.registeredAt).toLocaleString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.name}_Attendance.csv`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 animate-in fade-in duration-500">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">
            {config.name} <span className="text-indigo-600">.</span>
          </h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mt-2">
            Command & Control Terminal
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            Export CSV
          </button>
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:border-indigo-600 w-64 shadow-xl shadow-slate-200/50"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* 2. ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registrations" value={stats.total} icon="👥" color="indigo" />
        <StatCard title="Successful Check-ins" value={stats.checkedIn} icon="🏁" color="emerald" />
        <StatCard title="Remaining Guests" value={stats.total - stats.checkedIn} icon="⏳" color="amber" />
        <StatCard 
          title="Arrival Rate" 
          value={stats.total > 0 ? `${Math.round((stats.checkedIn / stats.total) * 100)}%` : '0%'} 
          icon="📊" 
          color="rose" 
        />
      </div>

      {/* 3. DYNAMIC DATA TABLE */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Live Attendance Feed</h3>
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-12">Category</th>
                {dynamicColumns.map(col => (
                  <th key={col.id} className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{col.label}</th>
                ))}
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-12 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAttendees.length > 0 ? filteredAttendees.map((person, i) => (
                <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="p-6 pl-12">
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl ${person.isGroup ? 'bg-amber-100 text-amber-700' : 'bg-indigo-600 text-white shadow-md shadow-indigo-200'}`}>
                      {person.isGroup ? 'ORG' : 'IND'}
                    </span>
                  </td>
                  {dynamicColumns.map(col => (
                    <td key={col.id} className="p-6 text-sm font-bold text-slate-700">{person[col.label] || '—'}</td>
                  ))}
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${person.hasCheckedIn ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-200'}`}></div>
                      <span className="text-[10px] font-black uppercase text-slate-400">{person.hasCheckedIn ? 'Verified' : 'Pending'}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right pr-12 text-[10px] font-bold text-slate-400 uppercase">
                    {new Date(person.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={dynamicColumns.length + 3} className="p-24 text-center">
                    <div className="text-slate-300 mb-2 text-4xl">📂</div>
                    <p className="text-slate-400 font-bold italic text-sm">Waiting for incoming registration data...</p>
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

// COMPONENT: STAT CARD
const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border-2 bg-white shadow-xl shadow-slate-200/40 flex items-center gap-6 group hover:scale-[1.02] transition-transform`}>
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-inner ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;