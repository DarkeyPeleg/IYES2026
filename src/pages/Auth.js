import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const inputCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Left Side: Branding/Visual */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4 tracking-tight leading-tight">
              Manage your event <br /> with precision.
            </h2>
            <p className="text-slate-400 font-medium">
              The all-in-one platform for registration, check-in, and real-time analytics.
            </p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: The Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              {isLogin ? "Enter your credentials to access the console" : "Join EventPro to start managing events"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <input type="text" placeholder="Full Name" className={inputCls} />
            )}
            
            <input type="email" placeholder="Email Address" className={inputCls} />
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className={inputCls} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-2">
              {isLogin ? "Sign In" : "Get Started"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-600 font-black hover:underline underline-offset-4"
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