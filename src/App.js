import React from 'react';
// SWITCHED BrowserRouter TO HashRouter
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { DataService } from './services/DataService'; 
import Registration from "./pages/Registration";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from './pages/Auth';
import Settings from './pages/Settings'; 

const Navigation = () => {
  const location = useLocation();
  const admin = DataService.getUserProfile();

  // In HashRouter, the root is still "/"
  if (location.pathname === "/") return null;

  return (
    <nav className="sticky top-0 z-50 bg-[#1a0b2e] border-b border-white/5 shadow-2xl px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
            <div className="w-5 h-5 bg-[#f89c1d] rounded-md"></div>
          </div>
          <span className="text-white font-black tracking-tighter text-2xl uppercase italic">
            IYES<span className="text-purple-400"> 2026</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-purple-900/40 p-1.5 rounded-2xl border border-white/10">
            <Link to="/" className="px-5 py-2 rounded-xl text-[10px] font-black uppercase text-purple-100 hover:text-white">Portal</Link>
            <Link to="/dashboard" className="px-5 py-2 rounded-xl text-[10px] font-black uppercase bg-white text-purple-700 shadow-lg">Dashboard</Link>
          </div>
          
          <Link to="/settings" className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-[#f89c1d] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#1a0b2e] flex items-center justify-center text-white text-xs font-black">
               {admin.name?.charAt(0) || 'P'}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0510] flex flex-col">
        <Navigation />
        
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Registration />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <FooterController />
      </div>
    </Router>
  );
}

const FooterController = () => {
  const location = useLocation();
  if (location.pathname === "/") return null;
  return (
    <footer className="py-6 text-center bg-white border-t border-slate-100">
      <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">IYES Ghana 2026 • Admin Terminal</p>
    </footer>
  );
}

export default App;