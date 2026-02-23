import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';

const AdminDashboard = () => {
  const [data, setData] = useState({ total: 0, checkedIn: 0, list: [] });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const stats = DataService.getAll();
    setData({
      total: stats.total || 0,
      checkedIn: stats.checkedIn || 0,
      list: stats.attendees || []
    });
  }, []);

  const handleExport = () => {
    if (data.list.length === 0) return alert("No data to export");
    const headers = ["Name", "Phone", "Email", "Location", "Gender", "Status"];
    const rows = data.list.map(p => [
      p.name, p.phone, p.email, p.location, p.gender, 
      p.hasCheckedIn ? 'Checked-In' : 'Pending'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Attendee_List.csv`;
    link.click();
  };

  const filteredList = data.list.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase()) || 
    person.phone.includes(filter)
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header & Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Event Management</h1>
          <p className="text-slate-500 font-medium">Overview of registrations and venue access</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-slate-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data
        </button>
      </div>

      {/* 2. Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Registered" value={data.total} color="blue" />
        <StatCard label="Total Checked-In" value={data.checkedIn} color="green" />
        <StatCard label="Attendance Rate" value={`${data.total > 0 ? ((data.checkedIn/data.total)*100).toFixed(1) : 0}%`} color="indigo" />
      </div>

      {/* 3. Attendee Database */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">Attendee Records</h3>
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-5">Name & Phone</th>
                <th className="px-8 py-5 hidden md:table-cell">Contact Info</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredList.map(person => (
                <tr key={person.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-900 capitalize">{person.name}</p>
                    <p className="text-xs text-slate-400">{person.phone}</p>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <p className="text-sm text-slate-600">{person.email}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{person.location} • {person.gender}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                      person.hasCheckedIn ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {person.hasCheckedIn ? 'Checked-In' : 'Registered'}
                    </span>
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

const StatCard = ({ label, value, color }) => {
  const themes = {
    blue: "text-blue-600 border-blue-100",
    green: "text-green-600 border-green-100",
    indigo: "text-indigo-600 border-indigo-100"
  };
  return (
    <div className={`bg-white p-8 rounded-[2rem] border-2 ${themes[color]} shadow-sm`}>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
      <h3 className={`text-4xl font-black ${themes[color].split(' ')[0]}`}>{value}</h3>
    </div>
  );
};

export default AdminDashboard;