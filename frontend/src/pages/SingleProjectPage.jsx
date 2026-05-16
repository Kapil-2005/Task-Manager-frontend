import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SingleProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, tasksRes, usersRes] = await Promise.all([
          axios.get(`https://task-manager-backend-production-d7b3.up.railway.app/api/projects`),
          axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/tasks'),
          user?.role === 'admin' ? axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/auth/users') : Promise.resolve({ data: [] })
        ]);

        // Find project
        const p = projRes.data.find(p => p._id === id);
        if (!p) {
          navigate('/projects');
          return;
        }
        setProject(p);

        // Filter tasks
        const pTasks = tasksRes.data.filter(t => t.project === id);
        setTasks(pTasks);

        if (usersRes.data.length > 0) setAllUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, user]);

  if (loading) return <div className="text-textMuted font-medium flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!project) return null;

  return (
    <div className="animate-fade-in relative z-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <button onClick={() => navigate('/projects')} className="mb-6 flex items-center gap-2 text-textMuted hover:text-white transition-colors group">
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Projects
      </button>

      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight m-0">{project.projectName}</h1>
          </div>
          <p className="text-textMuted text-lg m-0 mt-3 max-w-3xl leading-relaxed">{project.description}</p>
        </div>
        <div className="flex gap-4 items-center sm:self-end">
          <div className="glass-effect px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
            <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <span className="text-white font-bold">{project.members.length}</span>
            <span className="text-textMuted text-sm">Members</span>
          </div>
          <div className="glass-effect px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            <span className="text-white font-bold">{tasks.length}</span>
            <span className="text-textMuted text-sm">Tasks</span>
          </div>
        </div>
      </div>

      <div className="card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <h3 className="section-title text-xl flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          Project Tasks
        </h3>
        
        {tasks.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <svg className="w-8 h-8 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Tasks Yet</h3>
            <p className="text-textMuted">This project doesn't have any tasks assigned to it.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 mt-6">
            {tasks.map(t => {
              const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed';
              const assignedUser = allUsers.find(u => u._id === t.assignedTo);
              const assigneeName = assignedUser?.name || 'Unknown';

              return (
                <div key={t._id} className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover-lift shadow-soft flex flex-col h-full overflow-hidden">
                  {/* Dynamic decorative line based on status */}
                  <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-300 ${isOverdue ? 'bg-danger' : t.status === 'Completed' || t.status === 'completed' ? 'bg-success' : t.status === 'In Progress' || t.status === 'in-progress' ? 'bg-warning' : 'bg-primary/50 group-hover:bg-primary'}`}></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border tracking-wide uppercase ${t.status === 'Completed' || t.status === 'completed' ? 'bg-success/10 text-success border-success/20' : t.status === 'In Progress' || t.status === 'in-progress' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Completed' || t.status === 'completed' ? 'bg-success' : t.status === 'In Progress' || t.status === 'in-progress' ? 'bg-warning' : 'bg-primary'}`}></span>
                      {t.status === 'In Progress' ? 'Working' : t.status}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded border ${t.priority === 'High' ? 'text-danger border-danger/30 bg-danger/10' : t.priority === 'Medium' ? 'text-primary border-primary/30 bg-primary/10' : 'text-textMuted bg-white/5 border-white/10'}`}>
                      {t.priority}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{t.title}</h3>
                  
                  <div className="flex-1"></div> {/* Spacer */}

                  <div className="space-y-3 mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      {user?.role === 'admin' ? (
                        <div className="flex items-center gap-2" title={`Assigned to ${assigneeName}`}>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/20 flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-md">
                             {assignedUser?.profilePicture ? (
                               <img src={`https://task-manager-backend-production-d7b3.up.railway.app${assignedUser.profilePicture}`} className="w-full h-full object-cover" alt={assigneeName} />
                             ) : (
                               assigneeName.charAt(0).toUpperCase()
                             )}
                          </div>
                          <span className="text-xs font-medium text-white/80 truncate max-w-[100px]">{assigneeName}</span>
                        </div>
                      ) : <div></div>}
                      
                      {t.dueDate && (
                        <div className={`flex items-center gap-1.5 font-medium text-xs ${isOverdue ? 'text-danger animate-pulse' : 'text-textMuted'}`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProjectPage;
