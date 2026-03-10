import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';
import { FiDownload, FiSearch, FiUsers, FiCheckCircle, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    checkedIn: 0,
    attendees: []
  });
  const [activeTab, setActiveTab] = useState('individual');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. INITIAL LOAD & SSE STREAM
  useEffect(() => {
    // Load existing data first
    const fetchInitial = async () => {
      try {
        const data = await DataService.getStats();
        setStats({
          total: data.total || 0,
          checkedIn: data.checkedIn || 0,
          attendees: data.attendees || []
        });
      } catch (err) {
        console.error("Initial Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();

    // SETUP SSE STREAM
    const API_BASE_URL = 'https://plusureventsbackend.vercel.app';
    const eventSource = new EventSource(`${API_BASE_URL}/api/v1/attendee/stream`);

    eventSource.onmessage = (event) => {
      try {
        const newAttendee = JSON.parse(event.data);
        console.log("New registration received:", newAttendee);

        setStats((prev) => {
          // Add new attendee to the start of the list
          const updatedAttendees = [newAttendee, ...prev.attendees];
          return {
            ...prev,
            total: updatedAttendees.length,
            attendees: updatedAttendees
          };
        });
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection lost. Retrying...", err);
      // EventSource automatically retries by default
    };

    return () => {
      eventSource.close(); // Clean up on unmount
    };
  }, []);

  // 2. SEARCH & TAB FILTERING (Same as your working version)
  const filteredData = (stats.attendees || [])
    .filter(a => activeTab === 'org' ? (a.isGroup || a["Name of Org/Inst:"]) : (!a.isGroup && !a["Name of Org/Inst:"]))
    .filter(a => {
      const name = (a["Name:"] || a["Name of Org/Inst:"] || `${a.firstname || ''} ${a.lastname || ''}`).toLowerCase();
      const phone = (a["Phone:"] || a.phone || a.contact_person_phone || "").toLowerCase();
      return name.includes(filter.toLowerCase()) || phone.includes(filter.toLowerCase());
    });

  // 3. SAFE EXPORT LOGIC
  const exportToCSV = () => {
    if (!stats.attendees || stats.attendees.length === 0) {
      alert("No data available to export.");
      return;
    }

    const dataToExport = stats.attendees.map(a => ({
      Name: a["Name:"] || a["Name of Org/Inst:"] || `${a.firstname || ''} ${a.lastname || ''}`,
      Phone: a["Phone:"] || a.phone || a.contact_person_phone || "N/A",
      Email: a.email || a.Email || a.contact_person_email || "N/A",
      Type: (a.isGroup || a["Name of Org/Inst:"]) ? 'Organization' : 'Individual',
      Status: a.hasCheckedIn ? 'Verified' : 'Pending',
      Location: a["Location:"] || a.Location || "N/A"
    }));

    const headers = Object.keys(dataToExport[0]).join(",");
    const rows = dataToExport.map(row => 
      Object.values(row).map(value => `"${value}"`).join(",")
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IYES_2026_Live_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCheckIn = async (id) => {
    const success = await DataService.checkIn(id);
    if (success) {
        // Manually update local state for immediate feedback
        setStats(prev => ({
            ...prev,
            checkedIn: prev.checkedIn + 1,
            attendees: prev.attendees.map(a => a.id === id ? {...a, hasCheckedIn: true} : a)
        }));
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[#0a0510] font-sans selection:bg-purple-500/30">
      
      {/* HEADER SECTION */}
      <header className="shrink-0 p-8 lg:px-12 border-b border-white/5 bg-[#0d0714]">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-purple-400 text-[9px] font-black uppercase tracking-[0.3em]">Live SSE Stream Active</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">IYES <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#f89c1d]">2026</span></h1>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={exportToCSV}
              disabled={loading || stats.attendees.length === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border ${
                loading || stats.attendees.length === 0 
                ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              <FiDownload size={14} /> Export CSV
            </button>
            <div className="relative flex-grow md:flex-grow-0">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                placeholder="Search records..." 
                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm font-bold text-white outline-none focus:border-purple-500 w-full md:w-80 transition-all placeholder:text-white/20" 
                value={filter} 
                onChange={e => setFilter(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Registrations" value={stats.total} color="purple" icon={<FiActivity/>} />
          <StatCard title="Verified Entry" value={stats.checkedIn} color="emerald" icon={<FiCheckCircle/>} />
          <StatCard title="Individual" value={(stats.attendees || []).filter(a => !a.isGroup && !a["Name of Org/Inst:"]).length} color="blue" icon={<FiUsers/>} />
          <StatCard title="Organizations" value={(stats.attendees || []).filter(a => a.isGroup || a["Name of Org/Inst:"]).length} color="amber" icon={<FiUsers/>} />
        </div>
      </header>

      {/* DATA TABLE AREA */}
      <div className="flex-grow flex flex-col bg-[#0d0714] relative overflow-hidden">
        <div className="flex p-4 bg-white/5 border-b border-white/5 gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('individual')} 
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'individual' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:text-white/60'}`}>
            Individuals
          </button>
          <button 
            onClick={() => setActiveTab('org')} 
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'org' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-white/40 hover:text-white/60'}`}>
            Organizations
          </button>
        </div>

        <div className="flex-grow overflow-y-auto scrollbar-hide">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 bg-[#0d0714]/95 backdrop-blur-xl z-20">
              <tr className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                <th className="p-6 pl-12 border-b border-white/5 text-center w-20">#</th>
                <th className="p-6 border-b border-white/5">Attendee Identity</th>
                <th className="p-6 border-b border-white/5">Contact Info</th>
                <th className="p-6 border-b border-white/5 text-right pr-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((a, i) => (
                <tr key={a.id || i} className="group hover:bg-white/[0.02] transition-colors animate-in fade-in slide-in-from-left-2 duration-500">
                  <td className="p-6 pl-12 text-center text-white/20 font-mono text-xs">{i + 1}</td>
                  <td className="p-6">
                    <p className="font-black text-white text-sm uppercase tracking-tight">
                        {a["Name:"] || a["Name of Org/Inst:"] || `${a.firstname || ''} ${a.lastname || ''}`}
                    </p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">
                        {a.email || a.Email || a.contact_person_email || 'No Email'}
                    </p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-white/60 tracking-widest italic">{a["Phone:"] || a.phone || a.contact_person_phone}</p>
                    <p className="text-[10px] text-white/20 uppercase mt-1">{a["Location:"] || a.Location || 'Accra, GH'}</p>
                  </td>
                  <td className="p-6 text-right pr-12">
                    <button 
                      onClick={() => handleCheckIn(a.id)} 
                      className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                        a.hasCheckedIn 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-[#f89c1d] text-white border-transparent shadow-lg shadow-orange-500/10 active:scale-95'
                      }`}
                    >
                      {a.hasCheckedIn ? 'Verified ✓' : 'Verify Entry'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
              <FiUsers size={48} className="mb-4" />
              <p className="font-black uppercase text-[10px] tracking-[0.5em]">Waiting for registrations...</p>
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
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
  };
  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} backdrop-blur-md flex justify-between items-start`}>
      <div>
        <p className="text-[8px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">{title}</p>
        <p className="text-3xl font-black tracking-tighter text-white">{value}</p>
      </div>
      <div className="opacity-20 mt-1">{icon}</div>
    </div>
  );
};

export default AdminDashboard;