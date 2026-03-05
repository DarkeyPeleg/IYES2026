import React, { useState } from 'react';
import { DataService } from '../services/DataService';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false); // Set to false so "Create Account" shows first
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', phone: '', residence: '', password: ''
  });
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleAction = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', text: 'Processing...' });

    if (!isLogin) {
      // Create Account flow using De Graft's endpoint
      const result = await DataService.createAccount(formData);
      if (result.success) {
        setStatus({ type: 'success', text: 'Account Created! Redirecting...' });
        setTimeout(() => navigate('/organizer/create-event'), 2000);
      } else {
        // This will likely catch the CORS error 
        setStatus({ type: 'error', text: result.message || 'Check connection/CORS' });
      }
    } else {
      // Login logic would go here
      navigate('/organizer/dashboard');
    }
  };

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm";

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        
        <div className="hidden md:flex flex-col justify-center p-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight">
              Manage your event <br /> with precision.
            </h2>
            <p className="text-slate-400 font-medium text-sm">
              The all-in-one platform for registration, check-in, and real-time analytics.
            </p>
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">
              {isLogin ? "Enter your credentials to access the console" : "Join IYES 2026 to start managing events"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleAction}>
            {!isLogin && (
              <>
                <input required type="text" placeholder="Full Name" className={inputCls} 
                  onChange={e => setFormData({...formData, name: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="Username" className={inputCls} 
                    onChange={e => setFormData({...formData, username: e.target.value})} />
                  {/* NEW FIELD: Residence */}
                  <input required type="text" placeholder="Residence" className={inputCls} 
                    onChange={e => setFormData({...formData, residence: e.target.value})} />
                </div>

                <input required type="tel" placeholder="Phone Number" className={inputCls} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} />
              </>
            )}
            
            <input required type="email" placeholder="Email Address" className={inputCls} 
              onChange={e => setFormData({...formData, email: e.target.value})} />
            
            <div className="relative">
              <input required
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className={inputCls} 
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400 text-xs font-bold hover:text-blue-600 transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] mt-2">
              {isLogin ? "Sign In" : "Get Started"}
            </button>
          </form>

          {status && (
            <div className={`mt-4 p-3 rounded-xl text-center text-xs font-bold ${
              status.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {status.text}
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-600 font-black hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;