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
    
    try {
      await register({ name, email, password, role });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full flex justify-start p-6">
        <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 text-textMain">
          <div className="flex gap-1 items-end h-5">
            <div className="w-2.5 h-3.5 bg-[#e2445c] rounded-sm rounded-bl-full"></div>
            <div className="w-2.5 h-5 bg-[#fdab3d] rounded-sm rounded-tl-full"></div>
            <div className="w-2.5 h-4 bg-[#00c875] rounded-sm rounded-tr-full"></div>
          </div>
          Ethara
        </h1>
      </div>

      <div className="w-full max-w-[400px] mt-8 flex flex-col items-center px-4">
        <h2 className="text-[32px] text-textMain mb-8 font-normal tracking-tight text-center">Sign up for an account</h2>

        {error && <p className="text-danger bg-danger/10 w-full p-3 rounded border border-danger/20 text-sm font-medium mb-4 text-center">{error}</p>}
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col items-center">
            <label className="block text-[14px] text-textMain mb-2 font-medium">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={name} 
              onChange={onChange} 
              placeholder="Enter your full name"
              required 
              className="w-full p-2.5 rounded border border-[#c3c6d4] bg-white text-textMain focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-center"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <label className="block text-[14px] text-textMain mb-2 font-medium">Enter your work email address</label>
            <input 
              type="email" 
              name="email" 
              value={email} 
              onChange={onChange} 
              placeholder="Example@company.com"
              required 
              className="w-full p-2.5 rounded border border-[#c3c6d4] bg-white text-textMain focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-center"
            />
          </div>
          
          <div className="flex flex-col items-center w-full">
            <label className="block text-[14px] text-textMain mb-2 font-medium">Password</label>
            <input 
              type="password" 
              name="password" 
              value={password} 
              onChange={onChange} 
              placeholder="Create a password"
              required 
              minLength="6"
              className="w-full p-2.5 rounded border border-[#c3c6d4] bg-white text-textMain focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-center"
            />
          </div>

          <div className="flex flex-col items-center w-full">
            <label className="block text-[14px] text-textMain mb-2 font-medium">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={confirmPassword} 
              onChange={onChange} 
              placeholder="Confirm your password"
              required 
              minLength="6"
              className="w-full p-2.5 rounded border border-[#c3c6d4] bg-white text-textMain focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-center"
            />
          </div>

          <div className="flex flex-col items-center w-full">
            <label className="block text-[14px] text-textMain mb-2 font-medium">Account Role</label>
            <select
              name="role"
              value={role}
              onChange={onChange}
              className="w-full p-2.5 rounded border border-[#c3c6d4] bg-white text-textMain focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-center"
            >
              <option value="member">Team Member</option>
              <option value="admin">Workspace Admin</option>
            </select>
          </div>
          
          <button type="submit" className="bg-primary hover:bg-primaryHover text-white w-full mt-4 py-2.5 rounded text-[16px] transition-colors flex justify-center items-center gap-2">
            Continue <span className="font-sans">→</span>
          </button>
        </form>

        <div className="w-full flex items-center justify-between mt-8 mb-6">
          <div className="h-px bg-[#c3c6d4] flex-1"></div>
          <span className="text-[#676879] text-sm px-4">Or Sign up with</span>
          <div className="h-px bg-[#c3c6d4] flex-1"></div>
        </div>

        <div className="flex gap-4 w-full justify-center mb-8">
          <button type="button" className="flex items-center gap-2 px-4 py-2 border border-[#c3c6d4] rounded bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-textMain">
            <span style={{color: '#4285F4'}}>G</span> Google
          </button>
          <button type="button" className="flex items-center gap-2 px-4 py-2 border border-[#c3c6d4] rounded bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-textMain">
            <span style={{color: '#00a4ef'}}>❖</span> Microsoft
          </button>
        </div>
        
        <div className="text-center text-sm text-[#676879] flex flex-col gap-1 mb-8">
          <p className="m-0">Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
