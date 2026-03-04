import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(DataService.getStats());
  const [config] = useState(DataService.getConfig());
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' or 'org'
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(DataService.getStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Switch columns based on the active tab
  const dynamicColumns = activeTab === 'individual' 
    ? (config.customFields || []) 
    : (config.groupFields || []);

  // Filter logic for the active tab
  const tabData = stats.attendees.filter(a => activeTab === 'org' ? a.isGroup : !a.isGroup);
  
  const filteredData = tabData.filter(a => {
    const searchTerm = filter.toLowerCase();
    return Object.values(a).some(val => String(val).toLowerCase().includes(searchTerm));
  });

  const exportToCSV = () => {
    if (filteredData.length === 0) return alert("No data in this tab to export");
    const headers = [...dynamicColumns.map(c => c.label), "Status", "Time"];
    const rows = filteredData.map(a => [
      ...dynamicColumns.map(c => a[c.label] || ""),
      a.hasCheckedIn ? "Checked In" : "Registered",
      new Date(a.registeredAt).toLocaleString()
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.name}_${activeTab}_Data.csv`;
    link.click();
  };

  const deleteAttendee = (id) => {
    if (window.confirm("Are you sure you want to remove this record?")) {
      // Logic to delete would go here in DataService
      alert("Delete functionality triggered for ID: " + id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER & METRICS (Always visible) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">{config.name}</h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[9px] mt-1">Analytics Terminal</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportToCSV} className="bg-white border-2 border-slate-100 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Export {activeTab}</button>
          <input 
            type="text" 
            placeholder={`Search ${activeTab}s...`} 
            className="bg-white border-2 border-slate-100 rounded-2xl px-5 py-2.5 text-sm font-bold outline-none focus:border-indigo-600 w-64 shadow-xl shadow-slate-200/40"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total" value={stats.total} icon="👥" color="indigo" />
        <StatCard title="Verified" value={stats.checkedIn} icon="✅" color="emerald" />
        <StatCard title="Individual" value={stats.attendees.filter(a => !a.isGroup).length} icon="👤" color="blue" />
        <StatCard title="Organization" value={stats.attendees.filter(a => a.isGroup).length} icon="🏢" color="amber" />
      </div>

      {/* TABS & DATA TABLE */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="flex p-4 bg-slate-50/50 border-b border-slate-100 gap-2">
          <button 
            onClick={() => setActiveTab('individual')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'individual' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Individual Records
          </button>
          <button 
            onClick={() => setActiveTab('org')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'org' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Organization Records
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                {dynamicColumns.map(col => (
                  <th key={col.id} className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-10">{col.label}</th>
                ))}
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.length > 0 ? filteredData.map((person, i) => (
                <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                  {dynamicColumns.map(col => (
                    <td key={col.id} className="p-6 text-sm font-bold text-slate-700 pl-10">{person[col.label] || '—'}</td>
                  ))}
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${person.hasCheckedIn ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <span className="text-[10px] font-black uppercase text-slate-400">{person.hasCheckedIn ? 'In' : 'Out'}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right pr-10">
                    <button onClick={() => deleteAttendee(person.id)} className="text-rose-400 hover:text-rose-600 font-bold text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={dynamicColumns.length + 2} className="p-24 text-center">
                    <p className="text-slate-400 font-bold italic text-sm">No {activeTab} registrations found.</p>
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

const StatCard = ({ title, value, icon, color }) => (
  <div className="p-6 rounded-3xl border border-slate-100 bg-white shadow-lg flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-${color}-50 text-${color}-600 shadow-inner`}>{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{title}</p>
      <p className="text-xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;