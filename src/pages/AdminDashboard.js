import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(DataService.getStats());
  const [config] = useState(DataService.getConfig());
  const [filter, setFilter] = useState('');

  // Auto-refresh stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(DataService.getStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAttendees = stats.attendees.filter(a => 
    a.name.toLowerCase().includes(filter.toLowerCase()) || 
    a.phone.includes(filter)
  );

  const checkInRate = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;
  const capacityRate = config.capacity > 0 ? Math.round((stats.total / config.capacity) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{config.name}</h1>
          <p className="text-slate-500 font-medium">Live Event Analytics & Management</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Export Report</button>
          <button onClick={() => window.location.reload()} className="bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-200">Refresh Data</button>
        </div>
      </div>

      {/* 2. Top Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registered" value={stats.total} icon="👥" color="indigo" />
        <StatCard title="Checked In" value={stats.checkedIn} icon="✅" color="emerald" />
        <StatCard title="Arrival Rate" value={`${checkInRate}%`} icon="📈" color="blue" />
        <StatCard title="Capacity Used" value={`${capacityRate}%`} icon="🏢" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Attendee List (2/3 Width) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-800">Recent Registrations</h2>
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 w-64"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">Attendee</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAttendees.length > 0 ? filteredAttendees.slice(0, 10).map((person, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-8">
                      <p className="font-bold text-slate-900">{person.name}</p>
                      <p className="text-xs text-slate-500">{person.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${person.isGroup ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {person.isGroup ? 'Group' : 'Individual'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${person.hasCheckedIn ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <span className="text-xs font-bold text-slate-600">{person.hasCheckedIn ? 'Present' : 'Absent'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-400">
                      {new Date(person.registeredAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="p-10 text-center text-slate-400 font-medium italic">No attendees found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Event Health (1/3 Width) */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Event Snapshot</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>Venue Capacity</span>
                    <span>{stats.total} / {config.capacity}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${capacityRate}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span>Check-in Progress</span>
                    <span>{stats.checkedIn} / {stats.total}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${checkInRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Background decorative element */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickLink to="/register" label="Registration Page" icon="🔗" />
              <QuickLink to="/checkin" label="Gate Terminal" icon="🚪" />
              <QuickLink to="/organizer/create-event" label="Edit Setup" icon="⚙️" />
              <QuickLink to="/settings" label="Admin Profile" icon="👤" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl bg-${color}-50 flex items-center justify-center text-2xl shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const QuickLink = ({ to, label, icon }) => (
  <a href={to} className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
    <span className="text-xl mb-1">{icon}</span>
    <span className="text-[10px] font-black uppercase text-center">{label}</span>
  </a>
);

export default AdminDashboard;