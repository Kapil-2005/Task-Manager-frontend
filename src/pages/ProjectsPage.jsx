import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        axios.get('http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/projects'),
        user?.role === 'admin' ? axios.get('http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/auth/users') : Promise.resolve({ data: [] })
      ]);
      setProjects(projectsRes.data);
      if (usersRes.data.length > 0) setAllUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    setIsSubmitting(true);
    try {
      await axios.post('http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/projects', { projectName: newProjectName, description: 'Created by Admin' });
      setNewProjectName('');
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally { setIsSubmitting(false); }
  };

  const handleAddMember = async (projectId, userId) => {
    if (!userId) return;
    setIsSubmitting(true);
    try {
      const project = projects.find(p => p._id === projectId);
      await axios.put(`http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/projects/${projectId}`, { members: [...project.members, userId] });
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally { setIsSubmitting(false); }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    setIsSubmitting(true);
    try {
      await axios.delete(`http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally { setIsSubmitting(false); }
  };

  if (loading) return <div>Loading Projects...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-textMain mb-8">Workspace Projects</h1>

      {user?.role === 'admin' && (
        <div className="card mb-8">
          <h3 className="section-title">Create New Project</h3>
          <form onSubmit={createProject} className="flex flex-col sm:flex-row gap-3">
            <input className="input !mb-0 flex-1" type="text" placeholder="Enter project name..." value={newProjectName} onChange={e => setNewProjectName(e.target.value)} disabled={isSubmitting} />
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !newProjectName}>+ New Project</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? <p className="text-textMuted">No projects exist.</p> : projects.map(p => (
          <div key={p._id} className="card !mb-0 hover:border-primary transition-all flex flex-col justify-between">
            <div>
              <Link to={`/projects/${p._id}`} className="text-xl font-bold text-primary hover:underline">{p.projectName}</Link>
              <p className="text-sm text-textMuted mt-2">{p.description}</p>
            </div>

            {user?.role === 'admin' && (
              <div className="mt-4 flex items-center gap-2 bg-bgBody p-2 rounded-lg border border-borderC">
                <span className="text-xs font-bold text-textMuted whitespace-nowrap ml-1">TEAM</span>
                <select className="input !mb-0 !p-1.5 text-sm bg-transparent border-none w-full shadow-none" onChange={(e) => handleAddMember(p._id, e.target.value)} defaultValue="" disabled={isSubmitting}>
                  <option value="" disabled>+ Invite Member</option>
                  {allUsers.map(u => <option key={u._id} value={u._id} disabled={p.members.includes(u._id)}>{u.name}</option>)}
                </select>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center border-t border-borderC pt-4">
              <span className="badge bg-gray-100 text-textMuted">{p.members.length} Members</span>
              {user?.role === 'admin' && (
                <button className="text-danger text-sm font-bold hover:underline" onClick={() => deleteProject(p._id)} disabled={isSubmitting}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
