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
      const res = await axios.get('http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/auth/users');
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
      await axios.put(`http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/auth/users/${userId}`, editFormData);
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
      await axios.delete(`http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/auth/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    } finally {
      setIsUpdating(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="text-danger p-8">Unauthorized access. Admins only.</div>;
  }

  if (loading) return <div>Loading System Users...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-textMain mb-8">Admin Panel</h1>

      <div className="card">
        <h3 className="section-title">User Management ({users.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-borderC">
                <th className="p-3 text-textMuted text-xs font-bold uppercase tracking-wide">Name</th>
                <th className="p-3 text-textMuted text-xs font-bold uppercase tracking-wide">Emp ID</th>
                <th className="p-3 text-textMuted text-xs font-bold uppercase tracking-wide">Email</th>
                <th className="p-3 text-textMuted text-xs font-bold uppercase tracking-wide">Role</th>
                <th className="p-3 text-textMuted text-xs font-bold uppercase tracking-wide">Joined</th>
                <th className="p-3 text-textMuted text-xs font-bold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isEditing = editingId === u._id;
                return (
                  <tr key={u._id} className="border-b border-borderC hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium text-textMain flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden flex-shrink-0">
                        {u.profilePicture ? <img src={`http://https://task-manager-backend-production-d7b3.up.railway.app:5001${u.profilePicture}`} className="w-full h-full object-cover" /> : u.name.charAt(0).toUpperCase()}
                      </div>
                      {isEditing ? <input type="text" name="name" value={editFormData.name} onChange={handleChange} className="input !p-1.5 !mb-0 text-sm w-full" disabled={isUpdating} /> : u.name}
                    </td>
                    <td className="p-3 text-textMuted font-mono text-sm">
                      {isEditing ? <input type="text" name="employeeId" value={editFormData.employeeId} onChange={handleChange} className="input !p-1.5 !mb-0 text-sm w-full" disabled={isUpdating} /> : (u.employeeId || u._id)}
                    </td>
                    <td className="p-3 text-textMuted">
                      {isEditing ? <input type="email" name="email" value={editFormData.email} onChange={handleChange} className="input !p-1.5 !mb-0 text-sm w-full" disabled={isUpdating} /> : u.email}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <select name="role" value={editFormData.role} onChange={handleChange} className="input !p-1.5 !mb-0 text-sm w-full" disabled={isUpdating}>
                          <option value="member">member</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        <span className={`badge ${u.role === 'admin' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-textMuted">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="p-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button className="text-success text-sm font-bold hover:underline" onClick={() => handleSave(u._id)} disabled={isUpdating}>Save</button>
                          <button className="text-textMuted text-sm font-bold hover:underline" onClick={handleCancel} disabled={isUpdating}>Cancel</button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button className="text-primary text-sm font-bold hover:underline" onClick={() => handleEditClick(u)} disabled={isUpdating}>Edit</button>
                          <button className="text-danger text-sm font-bold hover:underline" onClick={() => handleDelete(u._id)} disabled={isUpdating}>Remove</button>
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
