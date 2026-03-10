import React, { useState, useEffect, useCallback } from 'react';
import { DataService } from '../services/DataService';
import { FiDownload, FiSearch, FiUsers, FiCheckCircle, FiActivity, FiRefreshCcw, FiMapPin } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, attendees: [] });
  const [activeTab, setActiveTab] = useState('individual');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. REFRESH LOGIC (Fetches all existing data)
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await DataService.getStats();
      setStats({
        total: data.total || 0,
        checkedIn: data.checkedIn || 0,
        attendees: data.attendees || []
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. DUAL LIVE SSE CONNECTIONS
  useEffect(() => {
    loadData();

    const API_BASE_URL = 'https://plusureventsbackend.vercel.app';
    
    // Connect to both Individual and Group live streams
    const indivSource = new EventSource(`${API_BASE_URL}/api/v1/attendee/live`);
    const groupSource = new EventSource(`${API_BASE_URL}/api/v1/attendee-group/live`);

    const processLiveEntry = (event, type) => {
      try {
        const raw = JSON.parse(event.data);
        const data = raw.data ? (typeof raw.data === 'string' ? JSON.parse(raw.data) : raw.data) : raw;

        const newEntry = {
          id: data.id,
          name: data.name || `${data.firstname || ''} ${data.lastname || ''}`.trim() || "New User",
          email: data.contact_person_email || data.email || "N/A",
          phone: data.contact_person_phone || data.phone || "N/A",
          residence: data.address || data.residence || "N/A",
          hasCheckedIn: false,
          isGroup: type === 'group' || !!data.number_heads,
          created_at: data.created_at || new Date().toISOString()
        };

        setStats((prev) => {
          // Check for existing ID + Type to avoid duplicate rows
          if (prev.attendees.find(item => item.id === newEntry.id && item.isGroup === newEntry.isGroup)) return prev;
          
          const updated = [newEntry, ...prev.attendees];
          return {
            ...prev,
            total: updated.length,
            attendees: updated
          };
        });
      } catch (err) {
        console.error(`${type} SSE Parse Error:`, err);
      }
    };

    indivSource.onmessage = (e) => processLiveEntry(e, 'individual');
    groupSource.onmessage = (e) => processLiveEntry(e, 'group');

    // Cleanup on unmount
    return () => {
      indivSource.close();
      groupSource.close();
    };
  }, [loadData]);

  // 3. FILTERING
  const filteredData = (stats.attendees || [])
    .filter(a => activeTab === 'org' ? a.isGroup : !a.isGroup)
    .filter(a => {
      const searchStr = `${a.name} ${a.phone} ${a.residence}`.toLowerCase();
      return searchStr.includes(filter.toLowerCase());
    });

  // 4. CHECK-IN (Handled by attendee object)
  const handleCheckIn = async (attendee) => {
    try {
      const success = await DataService.checkIn(attendee.id, attendee.isGroup);
      if (success) {
        setStats(prev => ({
          ...prev,
          checkedIn: prev.checkedIn + 1,
          attendees: prev.attendees.map(a => 
            (a.id === attendee.id && a.isGroup === attendee.isGroup) ? { ...a, hasCheckedIn: true } : a
          )
        }));
      }
    } catch (err) {
      alert("Verification failed. Please try again.");
    }
  };

  // 5. EXPORT
  const exportToCSV = () => {
    if (!stats.attendees.length) return;
    const data = stats.attendees.map(a => ({ 
      Name: a.name, 
      Phone: a.phone, 
      Location: a.residence,
      Type: a.isGroup ? "Organization" : "Individual"
    }));
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(","));
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8," + [headers, ...rows].join("\n")));
    link.setAttribute("download", `IYES_Live_Manifest.csv`);
    link.click();
  };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[#0a0510] font-sans">
      <header className="shrink-0 p-8 lg:px-12 border-b border-white/5 bg-[#0d0714]">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-purple-400 text-[9px] font-black uppercase tracking-[0.3em]">Satellite Feed Active</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">IYES <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#f89c1d]">2026</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={loadData} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all">
              <FiRefreshCcw className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={exportToCSV} className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black border border-white/10 text-white bg-white/5 uppercase">
              <FiDownload /> Export CSV
            </button>
            <div className="relative">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm font-bold text-white outline-none focus:border-purple-500 w-full md:w-80" 
                value={filter} 
                onChange={e => setFilter(e.target.value)} 
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Registrations" value={stats.total} color="purple" icon={<FiActivity/>} />
          <StatCard title="Verified at Gate" value={stats.checkedIn} color="emerald" icon={<FiCheckCircle/>} />
          <StatCard title="Individuals" value={stats.attendees.filter(a => !a.isGroup).length} color="blue" icon={<FiUsers/>} />
          <StatCard title="Organizations" value={stats.attendees.filter(a => a.isGroup).length} color="amber" icon={<FiUsers/>} />
        </div>
      </header>

      <div className="flex-grow flex flex-col bg-[#0d0714] overflow-hidden">
        <div className="flex p-4 bg-white/5 border-b border-white/5 gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('individual')} 
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'individual' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:text-white/60'}`}
          >
            Individuals
          </button>
          <button 
            onClick={() => setActiveTab('org')} 
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'org' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:text-white/60'}`}
          >
            Organizations
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 bg-[#0d0714]/95 backdrop-blur-xl z-20">
              <tr className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                <th className="p-6 pl-12 border-b border-white/5 w-20 text-center">#</th>
                <th className="p-6 border-b border-white/5">Identity</th>
                <th className="p-6 border-b border-white/5">Contact Info</th>
                <th className="p-6 border-b border-white/5 text-right pr-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((a, i) => (
                <tr key={`${a.isGroup ? 'g' : 'i'}-${a.id}`} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 pl-12 text-center text-white/20 font-mono text-xs">{i + 1}</td>
                  <td className="p-6">
                    <p className="font-black text-white text-sm uppercase leading-none">{a.name}</p>
                    <p className="text-[10px] text-white/30 uppercase mt-2 flex items-center gap-1"><FiMapPin size={8}/> {a.residence}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-white/60 tracking-widest">{a.phone}</p>
                    <p className="text-[10px] text-white/20 uppercase mt-1 tracking-widest truncate max-w-[200px]">{a.email}</p>
                  </td>
                  <td className="p-6 text-right pr-12">
                    <button 
                      onClick={() => handleCheckIn(a)} 
                      className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase border transition-all ${a.hasCheckedIn ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-[#f89c1d] text-white border-transparent hover:shadow-[0_0_20px_rgba(248,156,29,0.3)] active:scale-95'}`}
                    >
                      {a.hasCheckedIn ? 'Verified ✓' : 'Verify Entry'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && !loading && (
            <div className="py-32 text-center">
               <p className="text-white/10 font-black uppercase text-[10px] tracking-[0.5em]">No synchronization data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }) => {
  const colors = { 
    purple: 'border-purple-500/20 bg-purple-500/5 text-purple-400', 
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400', 
    blue: 'border-blue-500/20 bg-blue-500/5 text-blue-400', 
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-400' 
  };
  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} backdrop-blur-md flex justify-between items-center`}>
      <div>
        <p className="text-[8px] font-black uppercase tracking-widest mb-2 opacity-60">{title}</p>
        <p className="text-3xl font-black text-white tabular-nums">{value}</p>
      </div>
      <div className="text-2xl opacity-20">{icon}</div>
    </div>
  );
};

export default AdminDashboard;