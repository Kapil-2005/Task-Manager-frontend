import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const TasksPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isVital = searchParams.get('filter') === 'vital';

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [taskSearch, setTaskSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState(isVital ? 'High' : '');
  const [filterDate, setFilterDate] = useState('');

  const [newTask, setNewTask] = useState({ title: '', project: '', assignedTo: '', priority: 'Medium', dueDate: '' });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // If the user navigates from sidebar and URL changes, update the filter
  useEffect(() => {
    if (searchParams.get('filter') === 'vital') {
      setFilterPriority('High');
    } else if (!searchParams.get('filter') && filterPriority === 'High' && isVital) {
        setFilterPriority('');
    }
  }, [location.search]);


  const fetchTasks = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/tasks'),
        axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/projects'),
        user?.role === 'admin' ? axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/auth/users') : Promise.resolve({ data: [] })
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      if (usersRes.data.length > 0) setAllUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const updateStatus = async (taskId, newStatus) => {
    setIsUpdating(true);
    try {
      await axios.put(`https://task-manager-backend-production-d7b3.up.railway.app/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally { setIsUpdating(false); }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsUpdating(true);
    try {
      await axios.delete(`https://task-manager-backend-production-d7b3.up.railway.app/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally { setIsUpdating(false); }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.project || !newTask.assignedTo) return alert('Please fill all required fields');
    setIsUpdating(true);
    try {
      await axios.post('https://task-manager-backend-production-d7b3.up.railway.app/api/tasks', newTask);
      setNewTask({ title: '', project: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally { setIsUpdating(false); }
  };

  const filteredTasks = tasks.filter(t => {
    const query = taskSearch.toLowerCase();
    const assignee = user?.role === 'admin' ? (allUsers.find(u => u._id === t.assignedTo)?.name.toLowerCase() || '') : '';
    const matchSearch = t.title.toLowerCase().includes(query) || assignee.includes(query);
    const matchStatus = filterStatus ? t.status.toLowerCase() === filterStatus.toLowerCase() : true;
    const matchPriority = filterPriority ? t.priority === filterPriority : true;
    const matchDate = filterDate ? t.dueDate && t.dueDate.startsWith(filterDate) : true;
    return matchSearch && matchStatus && matchPriority && matchDate;
  });

  if (loading) return <div className="text-textMuted font-medium flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="animate-fade-in relative z-10 w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            {isVital ? 'Vital Tasks' : user?.role === 'admin' ? 'Workspace Tasks' : 'My Tasks'}
          </h1>
          <p className="text-textMuted text-base md:text-lg">Manage and track your project tasks seamlessly.</p>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="card mb-10 relative overflow-hidden group">
          <h3 className="section-title text-xl flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Create New Task
          </h3>
          <form onSubmit={createTask} className="flex flex-col gap-5 relative z-10">
            <input className="input !mb-0 text-lg py-4" type="text" placeholder="What needs to be done?" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} disabled={isUpdating} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <select className="input !mb-0 w-full appearance-none" value={newTask.project} onChange={e => setNewTask({ ...newTask, project: e.target.value })} disabled={isUpdating}>
                  <option value="" disabled className="text-textMuted">Select Project</option>
                  {projects.map(p => <option key={p._id} value={p._id} className="text-gray-900">{p.projectName}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-textMuted">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
              <div className="relative">
                <select className="input !mb-0 w-full appearance-none" value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })} disabled={isUpdating}>
                  <option value="" disabled className="text-textMuted">Assign Owner</option>
                  {allUsers.map(u => <option key={u._id} value={u._id} className="text-gray-900">{u.name} ({u.role})</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-textMuted">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <select className="input !mb-0 w-full appearance-none" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} disabled={isUpdating}>
                  <option value="Low" className="text-gray-900">Low Priority</option>
                  <option value="Medium" className="text-gray-900">Medium Priority</option>
                  <option value="High" className="text-gray-900">High Priority</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-textMuted">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
              <div className="relative">
                <input className="input !mb-0 w-full text-white" type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} disabled={isUpdating} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-2 py-4" disabled={isUpdating}>Add New Task</button>
          </form>
        </div>
      )}

      <div className="bg-bgCard rounded-2xl p-4 md:p-6 mb-8 border border-borderC shadow-soft">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          Filter Tasks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input className="input !mb-0" type="text" placeholder={user?.role === 'admin' ? "Search title or owner..." : "Search tasks..."} value={taskSearch} onChange={e => setTaskSearch(e.target.value)} />
          <div className="relative">
            <select className="input !mb-0 w-full appearance-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="" className="text-gray-900">Status: All</option>
              <option value="Todo" className="text-gray-900">Todo</option>
              <option value="In Progress" className="text-gray-900">Working on it</option>
              <option value="Completed" className="text-gray-900">Done</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-textMuted">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
          <div className="relative">
            <select className="input !mb-0 w-full appearance-none" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="" className="text-gray-900">Priority: All</option>
              <option value="Low" className="text-gray-900">Low</option>
              <option value="Medium" className="text-gray-900">Medium</option>
              <option value="High" className="text-gray-900">High</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-textMuted">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
          <input className="input !mb-0 text-white" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-16 px-6 bg-bgCard rounded-2xl border-borderC border shadow-soft">
            <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner border border-gray-100">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Tasks Found</h3>
            <p className="text-textMuted max-w-sm mx-auto">Try adjusting your filters or create a new task to get started.</p>
          </div>
        ) : filteredTasks.map((t, index) => {
          const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed';
          const assignedUser = allUsers.find(u => u._id === t.assignedTo);
          const assigneeName = assignedUser?.name || 'Unknown';
          const projectDetails = projects.find(p => p._id === t.project);
          
          return (
            <div key={t._id} className="stagger-item" style={{ animationDelay: `${index * 0.06}s` }}>
            <div className="group relative bg-bgCard border border-borderC rounded-2xl p-5 hover-lift gradient-border-hover flex flex-col h-full overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-300 ${isOverdue ? 'bg-danger' : t.status === 'Completed' || t.status === 'completed' ? 'bg-success' : t.status === 'In Progress' || t.status === 'in-progress' ? 'bg-warning' : 'bg-primary/30 group-hover:bg-primary'}`}></div>
              
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
              
              <div className="flex-1"></div>

              <div className="space-y-3 mt-4 pt-4 border-t border-borderC">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-textMuted group-hover:text-white transition-colors">
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                    <span className="truncate max-w-[120px]">{projectDetails?.projectName || 'Project'}</span>
                  </div>
                  {t.dueDate && (
                    <div className={`flex items-center gap-1.5 font-medium ${isOverdue ? 'text-danger animate-pulse' : 'text-textMuted'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2" title={`Assigned to ${assigneeName}`}>
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-borderC flex items-center justify-center text-textMuted font-bold overflow-hidden shadow-soft">
                       {assignedUser?.profilePicture ? (
                         <img src={`https://task-manager-backend-production-d7b3.up.railway.app${assignedUser.profilePicture}`} className="w-full h-full object-cover" alt={assigneeName} />
                       ) : (
                         assigneeName.charAt(0).toUpperCase()
                       )}
                    </div>
                    <span className="text-sm font-bold text-white">{assigneeName}</span>
                  </div>

                  <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                    {user?.role === 'member' && (
                      <>
                        <button className={`p-2 rounded-lg transition-colors border ${t.status === 'In Progress' || t.status === 'in-progress' ? 'bg-white/5 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-bgCard text-warning border-warning/30 hover:bg-warning/10'}`} onClick={() => updateStatus(t._id, 'In Progress')} disabled={isUpdating || t.status === 'In Progress' || t.status === 'in-progress'} title="Start Working">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                        <button className={`p-2 rounded-lg transition-colors border ${t.status === 'Completed' || t.status === 'completed' ? 'bg-white/5 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-bgCard text-success border-success/30 hover:bg-success/10'}`} onClick={() => updateStatus(t._id, 'Completed')} disabled={isUpdating || t.status === 'Completed' || t.status === 'completed'} title="Complete Task">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </button>
                      </>
                    )}
                    {user?.role === 'admin' && (
                      <button className="p-2 bg-bgCard border border-danger/30 text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50" onClick={() => deleteTask(t._id)} disabled={isUpdating} title="Delete Task">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default TasksPage;
