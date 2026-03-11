import React, { useState } from 'react';
import { DataService } from '../services/DataService';

const AttendeeForm = () => {
  // We keep the keys exactly as the server wants them: lowercase 'n'
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    residence: '',
    firstTime: false
  });

  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // Send the formData directly as you did when it was working
      const result = await DataService.register(formData);

      if (result.success) {
        setStatus({ type: 'success', msg: 'Registration Successful!' });
        // Reset form
        setFormData({ firstname: '', lastname: '', email: '', phone: '', residence: '', firstTime: false });
        setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
      } else {
        setStatus({ type: 'error', msg: result.message || 'Registration failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });  // ← already the server's message
      console.error("Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none transition-all duration-300 text-sm font-semibold text-white placeholder:text-white/20 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status.msg && (
        <div className={`mt-4 p-3 border rounded-xl text-center font-black text-[10px] uppercase tracking-widest ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
          {status.msg}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input
          placeholder="First Name"
          className={inputCls}
          value={formData.firstname}
          onChange={e => setFormData({ ...formData, firstname: e.target.value })}
          required
          disabled={loading}
        />
        <input
          placeholder="Last Name"
          className={inputCls}
          value={formData.lastname}
          onChange={e => setFormData({ ...formData, lastname: e.target.value })}
          required
          disabled={loading}
        />
        <input
          placeholder="Email"
          type="email"
          className={inputCls}
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
        />
        <input
          placeholder="Phone"
          className={inputCls}
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          required
          disabled={loading}
        />

        <div className="md:col-span-2">
          <input
            placeholder="Residence (e.g. Legon, Accra)"
            className={inputCls}
            value={formData.residence}
            onChange={e => setFormData({ ...formData, residence: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
          <input
            type="checkbox"
            id="ft"
            checked={formData.firstTime}
            onChange={e => setFormData({ ...formData, firstTime: e.target.checked })}
            className="w-5 h-5 accent-purple-600 rounded border-white/20 bg-transparent"
            disabled={loading}
          />
          <label htmlFor="ft" className="text-[10px] font-black uppercase tracking-widest text-white/60">First time at IYES?</label>
        </div>
      </div>

      <div className="pt-4 relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-[#f89c1d] to-purple-600 rounded-2xl blur-md transition duration-1000 ${loading ? 'opacity-10' : 'opacity-25 group-hover:opacity-100'}`}></div>

        <button
          disabled={loading}
          className="relative w-full bg-[#f89c1d] hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black py-5 rounded-2xl transition-all duration-500 text-[10px] uppercase tracking-[0.3em] active:scale-[0.98] shadow-2xl overflow-hidden"
        >
          {loading ? 'Transmitting...' : 'Confirm Registration'}
        </button>
      </div>


    </form>
  );
};

export default AttendeeForm;