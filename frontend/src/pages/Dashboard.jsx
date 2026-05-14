import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        axios.get('http://localhost:5001/api/projects'),
        axios.get('http://localhost:5001/api/tasks')
      ]);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>
      
      {user && (
        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#333', color: '#fff', borderRadius: '8px' }}>
          <h3>Welcome, {user.name}!</h3>
          <p>Your Role: <strong style={{ color: user.role === 'admin' ? '#f39c12' : '#3498db' }}>{user.role.toUpperCase()}</strong></p>
          <p>Email: {user.email}</p>
        </div>
      )}

      {user?.role === 'admin' ? (
        <AdminView projects={projects} tasks={tasks} refreshData={fetchData} />
      ) : (
        <MemberView projects={projects} tasks={tasks} refreshData={fetchData} />
      )}
    </div>
  );
};

const AdminView = ({ projects, tasks, refreshData }) => {
  const [newProjectName, setNewProjectName] = useState('');

  const createProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    try {
      await axios.post('http://localhost:5001/api/projects', { projectName: newProjectName, description: 'Admin created project' });
      setNewProjectName('');
      refreshData();
    } catch (err) {
      alert('Error creating project: ' + err.response?.data?.message);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/projects/${id}`);
      refreshData();
    } catch (err) {
      alert('Error deleting project');
    }
  };

  return (
    <div>
      <h3 style={{ color: '#f39c12', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Admin Panel</h3>
      
      <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #444', borderRadius: '8px' }}>
        <h4>Create Project</h4>
        <form onSubmit={createProject} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Project Name" 
            value={newProjectName} 
            onChange={e => setNewProjectName(e.target.value)} 
            style={{ padding: '0.5rem', flex: 1, border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create</button>
        </form>
      </div>

      <h4>All Projects ({projects.length})</h4>
      {projects.length === 0 ? <p style={{ color: '#888' }}>No projects exist yet.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {projects.map(p => (
            <li key={p._id} style={{ padding: '1rem', border: '1px solid #444', marginBottom: '0.5rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1.2rem' }}>{p.projectName}</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#aaa' }}>Members: {p.members?.length || 0}</p>
              </div>
              <button onClick={() => deleteProject(p._id)} style={{ padding: '0.5rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <h4 style={{ marginTop: '2rem' }}>All Tasks ({tasks.length})</h4>
      {tasks.length === 0 ? <p style={{ color: '#888' }}>No tasks exist yet.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(t => (
            <li key={t._id} style={{ padding: '1rem', border: '1px solid #444', marginBottom: '0.5rem', borderRadius: '4px' }}>
              <strong>{t.title}</strong> - <span style={{ color: '#aaa' }}>Status: {t.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MemberView = ({ projects, tasks, refreshData }) => {
  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/api/tasks/${taskId}/status`, { status: newStatus });
      refreshData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div>
      <h3 style={{ color: '#3498db', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Member Panel</h3>
      
      <h4>My Assigned Projects ({projects.length})</h4>
      {projects.length === 0 ? <p style={{ color: '#888' }}>You have not been added to any projects.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {projects.map(p => (
            <li key={p._id} style={{ padding: '1rem', border: '1px solid #444', marginBottom: '0.5rem', borderRadius: '4px' }}>
              <strong style={{ fontSize: '1.2rem' }}>{p.projectName}</strong>
            </li>
          ))}
        </ul>
      )}

      <h4 style={{ marginTop: '2rem' }}>My Assigned Tasks ({tasks.length})</h4>
      {tasks.length === 0 ? <p style={{ color: '#888' }}>You have no assigned tasks.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(t => (
            <li key={t._id} style={{ padding: '1rem', border: '1px solid #444', marginBottom: '0.5rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1.2rem' }}>{t.title}</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#aaa' }}>Status: <span style={{ color: '#fff' }}>{t.status}</span></p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => updateStatus(t._id, 'in-progress')} disabled={t.status === 'in-progress'} style={{ padding: '0.5rem', cursor: t.status === 'in-progress' ? 'not-allowed' : 'pointer', background: t.status === 'in-progress' ? '#555' : '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px' }}>In Progress</button>
                <button onClick={() => updateStatus(t._id, 'completed')} disabled={t.status === 'completed'} style={{ padding: '0.5rem', cursor: t.status === 'completed' ? 'not-allowed' : 'pointer', background: t.status === 'completed' ? '#555' : '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>Completed</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
