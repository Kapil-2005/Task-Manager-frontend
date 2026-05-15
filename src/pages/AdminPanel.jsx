import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '', employeeId: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleEditClick = (u) => {
    setEditingId(u._id);
    setEditFormData({ name: u.name, email: u.email, role: u.role, employeeId: u.employeeId || u._id });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSave = async (userId) => {
    setIsUpdating(true);
    try {
      await axios.put(`https://task-manager-backend-production-d7b3.up.railway.app/api/auth/users/${userId}`, editFormData);
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently remove this user?')) return;
    setIsUpdating(true);
    try {
      await axios.delete(`https://task-manager-backend-production-d7b3.up.railway.app/api/auth/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    } finally {
      setIsUpdating(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-danger/10 border border-danger/20 text-danger p-8 rounded-2xl flex flex-col items-center max-w-md text-center">
          <svg className="w-12 h-12 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h2 className="text-xl font-bold mb-2">Unauthorized Access</h2>
          <p className="text-danger/70">This area is restricted to workspace administrators only.</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-textMuted font-medium flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const adminCount = users.filter(u => u.role === 'admin').length;
  const memberCount = users.filter(u => u.role !== 'admin').length;

  const StatCard = ({ title, value, colorClass, bgLight, icon }) => (
    <div className="bg-bgCard border border-borderC shadow-soft rounded-2xl p-6 relative overflow-hidden group hover-lift">
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${colorClass}`}>{title}</h4>
          <h2 className="text-4xl sm:text-5xl font-black text-white">{value}</h2>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgLight} ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in relative z-10 font-sans">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">Workspace Admin</h1>
          <p className="text-textMuted text-base md:text-lg">Manage users, roles, and administrative privileges.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primaryHover transition-colors shadow-soft">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Invite User
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <StatCard 
          title="Total Users" 
          value={users.length} 
          colorClass="text-primary" 
          bgLight="bg-primary/10"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
        />
        <StatCard 
          title="Admins" 
          value={adminCount} 
          colorClass="text-warning" 
          bgLight="bg-warning/10"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
        />
        <StatCard 
          title="Members" 
          value={memberCount} 
          colorClass="text-secondary" 
          bgLight="bg-secondary/10"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
        />
      </div>

      <div className="bg-bgCard rounded-3xl p-6 border border-borderC shadow-soft flex-1">
        <div className="flex items-center justify-between mb-6 border-b border-borderC pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            User Directory
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white/5 rounded-lg">
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider rounded-l-xl">Name</th>
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider">Emp ID</th>
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider">Email</th>
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider">Role</th>
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider">Joined</th>
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => {
                const isEditing = editingId === u._id;
                return (
                  <tr key={u._id} className={`transition-colors group/row ${isEditing ? 'bg-primary/5' : 'hover:bg-white/5'}`}>
                    <td className="p-4 font-medium text-white flex items-center gap-4 min-w-[200px]">
                      <div className="w-10 h-10 rounded-full bg-gray-200 border border-white flex items-center justify-center text-gray-600 font-bold overflow-hidden flex-shrink-0 shadow-soft">
                        {u.profilePicture ? <img src={`https://task-manager-backend-production-d7b3.up.railway.app${u.profilePicture}`} className="w-full h-full object-cover" alt={u.name} /> : u.name.charAt(0).toUpperCase()}
                      </div>
                      {isEditing ? (
                        <input type="text" name="name" value={editFormData.name} onChange={handleChange} className="w-full bg-bgCard border border-borderC text-white rounded-md px-3 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-soft" disabled={isUpdating} />
                      ) : (
                        <div className="font-bold tracking-wide group-hover/row:text-primary transition-colors">{u.name}</div>
                      )}
                    </td>
                    <td className="p-4 text-textMuted font-mono text-sm">
                      {isEditing ? (
                        <input type="text" name="employeeId" value={editFormData.employeeId} onChange={handleChange} className="w-full bg-bgCard border border-borderC text-white rounded-md px-3 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono shadow-soft" disabled={isUpdating} />
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200 text-gray-700">{u.employeeId || u._id.substring(0, 8)}</span>
                      )}
                    </td>
                    <td className="p-4 text-textMuted">
                      {isEditing ? (
                        <input type="email" name="email" value={editFormData.email} onChange={handleChange} className="w-full bg-bgCard border border-borderC text-white rounded-md px-3 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-soft" disabled={isUpdating} />
                      ) : (
                        u.email
                      )}
                    </td>
                    <td className="p-4">
                      {isEditing ? (
                        <select name="role" value={editFormData.role} onChange={handleChange} className="w-full bg-bgCard border border-borderC text-white rounded-md px-3 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-soft" disabled={isUpdating}>
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wider ${u.role === 'admin' ? 'bg-warning/10 text-warning border border-warning/30' : 'bg-primary/10 text-primary border border-primary/30'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-textMuted">
                      {new Date(u.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 bg-success/10 text-success hover:bg-success hover:text-white border border-success/30 rounded-md transition-colors text-xs font-bold disabled:opacity-50" onClick={() => handleSave(u._id)} disabled={isUpdating}>
                            {isUpdating ? 'Saving...' : 'Save'}
                          </button>
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 rounded-md transition-colors text-xs font-bold disabled:opacity-50" onClick={handleCancel} disabled={isUpdating}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover/row:opacity-100 transition-opacity">
                          <button className="p-1.5 text-primary hover:bg-primary/10 hover:text-primary rounded-md transition-colors" title="Edit User" onClick={() => handleEditClick(u)} disabled={isUpdating}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button className="p-1.5 text-danger hover:bg-danger/10 hover:text-danger rounded-md transition-colors" title="Remove User" onClick={() => handleDelete(u._id)} disabled={isUpdating}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
