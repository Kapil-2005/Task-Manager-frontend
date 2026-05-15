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
        axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/projects'),
        user?.role === 'admin' ? axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/auth/users') : Promise.resolve({ data: [] })
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
      await axios.post('https://task-manager-backend-production-d7b3.up.railway.app/api/projects', { projectName: newProjectName, description: 'Created by Admin' });
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
      await axios.put(`https://task-manager-backend-production-d7b3.up.railway.app/api/projects/${projectId}`, { members: [...project.members, userId] });
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally { setIsSubmitting(false); }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setIsSubmitting(true);
    try {
      await axios.delete(`https://task-manager-backend-production-d7b3.up.railway.app/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="text-textMuted font-medium flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="animate-fade-in relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Workspace Projects</h1>
          <p className="text-textMuted text-lg">Manage all your team's projects in one place.</p>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="card mb-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <h3 className="section-title text-xl">Create New Project</h3>
          <form onSubmit={createProject} className="flex flex-col sm:flex-row gap-4 relative z-10">
            <input className="input !mb-0 flex-1 text-lg py-4 bg-white/5 border-white/10" type="text" placeholder="Enter project name..." value={newProjectName} onChange={e => setNewProjectName(e.target.value)} disabled={isSubmitting} />
            <button type="submit" className="btn btn-primary px-8 shadow-[0_0_15px_rgba(139,92,246,0.5)]" disabled={isSubmitting || !newProjectName}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Project
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-16 px-6 glass-effect rounded-2xl border-white/5">
            <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-textMuted">Get started by creating your first project.</p>
          </div>
        ) : projects.map((p, i) => (
          <div key={p._id} className="card !mb-0 hover-lift gradient-border-hover flex flex-col justify-between group relative overflow-hidden bg-white/5">
            <div className={`absolute top-0 left-0 w-1 h-full ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-success'} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className="pl-4 relative z-10">
              <Link to={`/projects/${p._id}`} className="text-2xl font-bold text-white hover:text-primary transition-colors flex items-center justify-between">
                {p.projectName}
                <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
              <p className="text-sm text-textMuted mt-3 leading-relaxed">{p.description}</p>
            </div>

            <div className="pl-4 mt-6 flex flex-col gap-4 relative z-10">
              {user?.role === 'admin' && (
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                  </div>
                  <div className="relative flex-1">
                    <select className="w-full bg-transparent text-sm text-white focus:outline-none appearance-none cursor-pointer" onChange={(e) => handleAddMember(p._id, e.target.value)} defaultValue="" disabled={isSubmitting}>
                      <option value="" disabled className="text-gray-900">Invite Member</option>
                      {allUsers.map(u => <option key={u._id} value={u._id} disabled={p.members.includes(u._id)} className="text-gray-900">{u.name}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-white/50">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {Array.from({length: Math.min(p.members.length, 3)}).map((_, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full border-2 border-[rgba(30,41,59,1)] bg-white/20 flex items-center justify-center text-xs font-bold text-white shadow-sm backdrop-blur-md">
                        {idx === 0 ? 'M' : idx === 1 ? 'A' : 'T'}
                      </div>
                    ))}
                    {p.members.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-[rgba(30,41,59,1)] bg-white/10 flex items-center justify-center text-xs font-bold text-white shadow-sm backdrop-blur-md">
                        +{p.members.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-textMuted ml-1">{p.members.length} {p.members.length === 1 ? 'Member' : 'Members'}</span>
                </div>
                {user?.role === 'admin' && (
                  <button className="text-danger/70 hover:text-danger text-sm font-bold transition-colors flex items-center gap-1" onClick={() => deleteProject(p._id)} disabled={isSubmitting}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
