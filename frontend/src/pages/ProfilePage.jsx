import React, { useContext, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { user, setUser, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setUploading(true);
      const res = await axios.post('https://task-manager-backend-production-d7b3.up.railway.app/api/auth/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setUser((prev) => ({ ...prev, profilePicture: res.data.profilePicture }));
    } catch (error) {
      console.error('Error uploading photo:', error.response?.data || error.message);
      alert(`Failed to upload photo: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <div className="text-textMuted font-medium flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">My Profile</h1>
          <p className="text-textMuted text-lg">Manage your account settings and personal information.</p>
        </div>
      </div>

      <div className="card text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <div className="relative group/photo w-32 h-32 rounded-3xl bg-gradient-primary flex items-center justify-center text-5xl font-bold text-white shadow-xl shadow-primary/20 border-2 border-white/10 overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
          {user.profilePicture ? (
            <img src={`https://task-manager-backend-production-d7b3.up.railway.app${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}

          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span className="text-white text-xs font-medium">{uploading ? 'Uploading...' : 'Change Photo'}</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
        
        <div className="flex-1 relative z-10 pt-2">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">{user.name}</h2>
          <p className="text-textMuted text-lg mb-4">{user.email}</p>
          <div className="flex justify-center sm:justify-start">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border ${user.role === 'admin' ? 'bg-warning/10 text-warning border-warning/30' : 'bg-primary/10 text-primary border-primary/30'} backdrop-blur-sm`}>
              {user.role ? user.role.toUpperCase() : 'MEMBER'}
            </span>
          </div>
        </div>
      </div>

      <div className="card mt-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <h3 className="section-title text-xl flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
          Account Details
        </h3>
        
        <div className="flex flex-col gap-6 relative z-10 mt-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <span className="text-textMuted font-medium mb-1 sm:mb-0">Full Name</span>
            <span className="text-white font-bold text-lg">{user.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <span className="text-textMuted font-medium mb-1 sm:mb-0">Email Address</span>
            <span className="text-white font-bold">{user.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <span className="text-textMuted font-medium mb-1 sm:mb-0">Employee ID</span>
            <span className="text-primary font-mono text-sm px-3 py-1 bg-primary/10 rounded-md border border-primary/20">{user.employeeId || user._id}</span>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 flex justify-end relative z-10">
          <button
            onClick={handleLogout}
            className="btn btn-outline border-danger/50 text-danger hover:bg-danger hover:text-white transition-all duration-300 flex items-center gap-2 px-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out Securely
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
