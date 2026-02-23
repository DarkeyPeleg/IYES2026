import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Registration from "./pages/Registration";
import CheckIn from "./pages/CheckIn";
import AdminDashboard from "./pages/AdminDashboard"; // Updated to match your filename
import EventCreation from "./pages/EventCreation";

// Modern NavLink with "Active" state highlights
const NavItem = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
        isActive 
          ? "bg-white text-indigo-600 shadow-lg scale-105" 
          : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        
        {/* Professional Header */}
        <nav className="sticky top-0 z-50 bg-indigo-600 border-b border-indigo-500 shadow-xl px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner">
                <div className="w-5 h-5 bg-indigo-600 rounded-md"></div>
              </div>
              <span className="text-white font-black tracking-tighter text-2xl">
                IYES<span className="text-indigo-200"> 2026</span>
              </span>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 bg-indigo-700/40 p-1.5 rounded-2xl border border-indigo-400/20">
              <NavItem to="/register">Register</NavItem>
              <NavItem to="/checkin">Check-In</NavItem>
              <div className="w-[1px] h-6 bg-indigo-400/40 mx-1 hidden md:block" />
              <NavItem to="/organizer/dashboard">Dashboard</NavItem>
              <NavItem to="/organizer/create-event">Setup</NavItem>
            </div>
          </div>
        </nav>

        {/* Dynamic Page Content */}
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Routes>
              <Route path="/register" element={<Registration />} />
              <Route path="/checkin" element={<CheckIn />} />
              {/* Note: I kept your path as /organizer/dashboard, but it now points to AdminDashboard */}
              <Route path="/organizer/dashboard" element={<AdminDashboard />} />
              <Route path="/organizer/create-event" element={<EventCreation />} />
              <Route path="*" element={<Registration />} />
            </Routes>
          </div>
        </main>

        <footer className="py-8 text-center border-t border-slate-200 bg-white">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            IYES 2026 v1.0
          </p>
        </footer>

      </div>
    </Router>
  );
}

export default App;