import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsRes, tasksRes, usersRes] = await Promise.all([
          axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/projects'),
          axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/tasks'),
          user?.role === 'admin' ? axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/auth/users') : Promise.resolve({ data: [] })
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
        if (usersRes.data.length > 0) setAllUsers(usersRes.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="text-textMuted font-medium flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (error) return <div className="text-danger bg-danger/10 p-6 rounded-2xl border border-danger/20">⚠️ {error}</div>;

  const totalTasks = tasks.length || 1; 
  const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'completed');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress' || t.status === 'in-progress');
  const todoTasks = tasks.filter(t => t.status === 'Todo' || t.status === 'todo');

  const getPercentage = (count) => Math.round((count / (tasks.length || 1)) * 100);
  
  const completedPct = getPercentage(completedTasks.length);
  const inProgressPct = getPercentage(inProgressTasks.length);
  const notStartedPct = getPercentage(todoTasks.length);

  const activeTasks = [...todoTasks, ...inProgressTasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentCompleted = [...completedTasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3);

  const CircularProgress = ({ percentage, color, label }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
            <circle cx="48" cy="48" r={radius} stroke={color} strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" />
          </svg>
          <span className="absolute text-lg font-bold text-white">{percentage}%</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
          <span className="text-xs font-bold text-textMuted tracking-wide uppercase">{label}</span>
        </div>
      </div>
    );
  };

  const TaskCard = ({ task, isCompleted }) => {
    let statusColor = '#ef4444'; // Red (Not Started / Todo)
    if (task.status === 'Completed' || task.status === 'completed') statusColor = '#10b981'; // Green
    if (task.status === 'In Progress' || task.status === 'in-progress') statusColor = '#3b82f6'; // Blue

    return (
      <div className="group bg-bgCard border border-borderC rounded-2xl p-5 hover-lift gradient-border-hover relative overflow-hidden flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 relative z-10">
          <div className="flex items-start gap-3">
            <div className="mt-1 w-4 h-4 rounded-full border-2 bg-transparent flex-shrink-0" style={{ borderColor: statusColor }}>
              {isCompleted && <div className="w-full h-full rounded-full bg-success opacity-50 scale-50"></div>}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1 tracking-tight group-hover:text-primary transition-colors">{task.title}</h4>
              <p className="text-sm text-textMuted mb-4 line-clamp-2">Task assigned in project. Ensure timely delivery according to specifications.</p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold">
                <span className="text-textMuted flex items-center gap-1">
                  Priority: <span style={{ color: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#3b82f6' : '#6b7280' }}>{task.priority || 'Normal'}</span>
                </span>
                <span className="text-textMuted flex items-center gap-1">
                  Status: <span style={{ color: statusColor }}>{task.status}</span>
                </span>
                <span className="text-textMuted flex items-center gap-1">
                  Created: <span className="text-white">{new Date(task.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:block w-32 h-24 rounded-xl flex-shrink-0 overflow-hidden bg-white/5 border border-borderC relative">
           <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${isCompleted ? 'from-success to-transparent' : 'from-primary to-secondary'}`}></div>
           <div className="absolute inset-0 flex items-center justify-center opacity-30 text-gray-400">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
           </div>
        </div>

        <div className="absolute top-4 right-4 text-gray-300 opacity-50 group-hover:opacity-100 group-hover:text-gray-500 cursor-pointer transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in relative w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-2">
            Welcome back, {user?.name.split(' ')[0]} <span className="animate-bounce">👋</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {user?.role === 'admin' && allUsers.length > 0 && (
            <div className="hidden sm:flex items-center -space-x-3">
              {allUsers.slice(0, 4).map((u, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold overflow-hidden shadow-soft">
                  {u.profilePicture ? <img src={`https://task-manager-backend-production-d7b3.up.railway.app${u.profilePicture}`} alt={u.name} className="w-full h-full object-cover" /> : u.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {allUsers.length > 4 && (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold shadow-soft">
                  +{allUsers.length - 4}
                </div>
              )}
            </div>
          )}
          
          {user?.role === 'admin' && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-primary font-semibold border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              Invite
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        <div className="xl:col-span-7 flex flex-col gap-6">
          <div className="bg-bgCard rounded-3xl p-6 border border-borderC gradient-border-hover hover-lift flex-1">
            <div className="flex items-center justify-between mb-6 border-b border-borderC pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                To-Do
              </h3>
              <Link to="/tasks" className="text-sm font-semibold text-textMuted hover:text-primary flex items-center gap-1 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add task
              </Link>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-bold text-textMuted mb-6">
              <span className="text-white">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>Today</span>
            </div>

            <div className="space-y-4">
              {activeTasks.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-2xl border border-borderC">
                  <p className="text-textMuted font-medium">You're all caught up! No pending tasks.</p>
                </div>
              ) : (
                activeTasks.map((t, i) => <div key={t._id} className="stagger-item" style={{ animationDelay: `${i * 0.08}s` }}><TaskCard task={t} /></div>)
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 flex flex-col gap-6 md:gap-8">
          <div className="bg-bgCard rounded-3xl p-6 border border-borderC gradient-border-hover hover-lift">
            <h3 className="text-xl font-bold flex items-center gap-2 text-primary mb-8 border-b border-borderC pb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Task Status
            </h3>

            <div className="flex justify-around items-center">
              <CircularProgress percentage={completedPct} color="#10b981" label="Completed" />
              <CircularProgress percentage={inProgressPct} color="#3b82f6" label="In Progress" />
              <CircularProgress percentage={notStartedPct} color="#ef4444" label="Not Started" />
            </div>
          </div>

          <div className="bg-bgCard rounded-3xl p-6 border border-borderC gradient-border-hover hover-lift flex-1">
            <h3 className="text-xl font-bold flex items-center gap-2 text-primary mb-6 border-b border-borderC pb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Completed Task
            </h3>

            <div className="space-y-4">
              {recentCompleted.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-2xl border border-borderC">
                  <p className="text-textMuted font-medium">No completed tasks yet.</p>
                </div>
              ) : (
                recentCompleted.map((t, i) => <div key={t._id} className="stagger-item" style={{ animationDelay: `${i * 0.08}s` }}><TaskCard task={t} isCompleted={true} /></div>)
              )}
              
              {recentCompleted.length > 0 && (
                <div className="pt-2">
                  <Link to="/tasks" className="text-sm font-bold text-textMuted hover:text-primary transition-colors w-full text-center block">
                    View all completed tasks
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
