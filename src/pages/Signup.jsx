import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member'
  });
  const { name, email, password, confirmPassword, role } = formData;
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await register({ name, email, password, role });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] font-sans text-white selection:bg-primary/30">
      
      {/* Left Column - Image Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#050505] items-center justify-center border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/assets/login_bg_abstract.png" 
            alt="Abstract 3D Geometric Art" 
            className="w-full h-full object-cover opacity-80"
          />
          {/* Linear-style radial overlay to blend edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)]"></div>
          {/* Subtle glow behind the image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative overflow-hidden">
        {/* Subtle grid background for Linear aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#0a0a0a] to-transparent z-0"></div>
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#0a0a0a] to-transparent z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a] z-0"></div>

        {/* Top bar with Logo */}
        <div className="relative z-10 p-8 flex justify-end">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-xl font-bold tracking-tight text-white">Ethara</span>
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-[#0a0a0a] text-lg font-black leading-none">E</span>
            </div>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-20 xl:px-32 relative z-10">
          <div className="max-w-[440px] w-full mx-auto animate-fade-in">
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">Create an account</h1>
              <p className="text-[#888888] text-base">Join Ethara to start managing projects.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-medium mb-6 flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
              </div>
            )}
            
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-medium">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={name} 
                  onChange={onChange} 
                  placeholder="John Doe"
                  required 
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#111111] text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all placeholder-[#444444]"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#888888] mb-2 font-medium">Email address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={email} 
                  onChange={onChange} 
                  placeholder="name@company.com"
                  required 
                  className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#111111] text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all placeholder-[#444444]"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-medium">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={password} 
                    onChange={onChange} 
                    placeholder="••••••••"
                    required 
                    minLength="6"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#111111] text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all placeholder-[#444444]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#888888] mb-2 font-medium">Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={confirmPassword} 
                    onChange={onChange} 
                    placeholder="••••••••"
                    required 
                    minLength="6"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#111111] text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all placeholder-[#444444]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#888888] mb-2 font-medium">Account Role</label>
                <div className="relative">
                  <select
                    name="role"
                    value={role}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#111111] text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="member" className="text-gray-900 bg-white">Team Member</option>
                    <option value="admin" className="text-gray-900 bg-white">Workspace Admin</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 py-3 rounded-lg text-[#0a0a0a] font-medium bg-white hover:bg-gray-200 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(255,255,255,0.3),0_0_60px_rgba(255,255,255,0.1)]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin"></div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-8 text-center sm:text-left">
              <p className="text-[#888888] text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-white font-medium hover:underline transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
