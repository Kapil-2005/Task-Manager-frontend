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

  if (!user) return <div>Loading Profile...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-textMain mb-8">My Profile</h1>

      <div className="card text-center sm:text-left flex flex-col sm:flex-row items-center gap-8">
        <div className="relative group w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-5xl font-bold text-primary shadow-sm border-4 border-white overflow-hidden">
          {user.profilePicture ? (
            <img src={`https://task-manager-backend-production-d7b3.up.railway.app${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}

          <div
            className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
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
        <div>
          <h2 className="text-2xl font-bold text-textMain mb-2">{user.name}</h2>
          <p className="text-textMuted mb-4">{user.email}</p>
          <span className={`badge ${user.role === 'admin' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
            Role: {user.role ? user.role.toUpperCase() : 'MEMBER'}
          </span>
        </div>
      </div>

      <div className="card mt-8">
        <h3 className="section-title">Account Details</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between border-b border-borderC pb-2">
            <span className="text-textMuted font-medium">Full Name</span>
            <span className="text-textMain font-bold">{user.name}</span>
          </div>
          <div className="flex justify-between border-b border-borderC pb-2">
            <span className="text-textMuted font-medium">Email Address</span>
            <span className="text-textMain font-bold">{user.email}</span>
          </div>
          <div className="flex justify-between border-b border-borderC pb-2">
            <span className="text-textMuted font-medium">Employee ID</span>
            <span className="text-textMain font-mono text-sm">{user.employeeId || user._id}</span>
          </div>
        </div>

        <div className="mt-8 border-t border-borderC pt-6 flex justify-end">
          <button
            onClick={handleLogout}
            className="btn btn-outline border-danger text-danger hover:bg-danger hover:text-white transition-colors"
          >
            Log out of account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
