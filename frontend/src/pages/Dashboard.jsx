import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../index.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
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
      setError('Failed to securely fetch dashboard data. Please check connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-bgBody">
        <div className="w-10 h-10 border-4 border-borderC border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-textMuted font-medium">Loading Workspace...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-bgBody min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-textMain">Ethara Workspace</h1>
        <button className="btn btn-outline w-full sm:w-auto" onClick={handleLogout}>Log out</button>
      </div>

      {error && <div className="bg-danger/10 border border-danger text-danger font-medium p-4 rounded-lg mb-8">⚠️ {error}</div>}

      {user && (
        <div className="card flex flex-col sm:flex-row items-center gap-6 bg-white border border-borderC">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex flex-shrink-0 items-center justify-center text-3xl font-bold text-primary shadow-sm overflow-hidden">
            {user.profilePicture ? (
              <img src={`https://task-manager-backend-production-d7b3.up.railway.app${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-1 text-textMain">Welcome, {user.name}</h2>
            <div className="text-textMuted flex flex-col sm:flex-row items-center sm:gap-4 gap-2 font-medium">
              <span>{user.email}</span>
              <span className={`badge ${user.role === 'admin' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
                {user.role ? user.role : 'MEMBER'}
              </span>
            </div>
          </div>
        </div>
      )}

      <DashboardCards projects={projects} tasks={tasks} />

      {user?.role === 'admin' ? (
        <AdminView projects={projects} tasks={tasks} allUsers={allUsers} refreshData={fetchData} />
      ) : (
        <MemberView projects={projects} tasks={tasks} refreshData={fetchData} />
      )}
    </div>
  );
};

const DashboardCards = ({ projects, tasks }) => {
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed';
  }).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      <div className="card !mb-0 border-t-4 border-t-primary p-5 flex flex-col items-center sm:items-start text-center sm:text-left">
        <h4 className="text-textMuted text-xs font-bold uppercase tracking-wide m-0">Projects</h4>
        <h2 className="text-3xl font-bold mt-2 mb-0 text-textMain">{totalProjects}</h2>
      </div>
      <div className="card !mb-0 border-t-4 border-t-textMuted p-5 flex flex-col items-center sm:items-start text-center sm:text-left">
        <h4 className="text-textMuted text-xs font-bold uppercase tracking-wide m-0">Total Tasks</h4>
        <h2 className="text-3xl font-bold mt-2 mb-0 text-textMain">{totalTasks}</h2>
      </div>
      <div className="card !mb-0 border-t-4 border-t-success p-5 flex flex-col items-center sm:items-start text-center sm:text-left">
        <h4 className="text-textMuted text-xs font-bold uppercase tracking-wide m-0">Completed</h4>
        <h2 className="text-3xl font-bold mt-2 mb-0 text-textMain">{completedTasks}</h2>
      </div>
      <div className="card !mb-0 border-t-4 border-t-warning p-5 flex flex-col items-center sm:items-start text-center sm:text-left">
        <h4 className="text-textMuted text-xs font-bold uppercase tracking-wide m-0">Pending</h4>
        <h2 className="text-3xl font-bold mt-2 mb-0 text-textMain">{pendingTasks}</h2>
      </div>
      <div className="card !mb-0 border-t-4 border-t-danger p-5 col-span-2 md:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
        <h4 className="text-danger text-xs font-bold uppercase tracking-wide m-0">Overdue</h4>
        <h2 className={`text-3xl font-bold mt-2 mb-0 ${overdueTasks > 0 ? 'text-danger' : 'text-textMain'}`}>{overdueTasks}</h2>
      </div>
    </div>
  );
};

const TaskChartsAndActivity = ({ tasks, allUsers }) => {
  const completed = tasks.filter(t => t.status === 'Completed' || t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress' || t.status === 'in-progress').length;
  const todo = tasks.filter(t => t.status === 'Todo' || t.status === 'todo').length;

  const pieData = [
    { name: 'Completed', value: completed, color: '#00c875' },
    { name: 'In Progress', value: inProgress, color: '#fdab3d' },
    { name: 'Todo', value: todo, color: '#0073ea' },
  ];

  const sortedTasks = [...tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="card !mb-0">
        <h3 className="section-title">Task Status Overview</h3>
        <div className="h-64">
          {tasks.length === 0 ? <p className="text-textMuted">No data available.</p> : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e6e9ef', borderRadius: '8px', color: '#323338' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card !mb-0">
        <h3 className="section-title">Recent Activity</h3>
        {sortedTasks.length === 0 ? <p className="text-textMuted">No recent activity.</p> : (
          <ul className="list-none p-0 m-0">
            {sortedTasks.map(t => {
              const assignee = allUsers.find(u => u._id === t.assignedTo)?.name || 'Someone';
              const time = new Date(t.updatedAt).toLocaleString();
              let message = <><strong className="text-textMain">{assignee}</strong> was assigned task "{t.title}"</>;
              if (t.status === 'Completed' || t.status === 'completed') message = <><strong className="text-textMain">{assignee}</strong> completed task "{t.title}"</>;
              if (t.status === 'In Progress' || t.status === 'in-progress') message = <><strong className="text-textMain">{assignee}</strong> started working on "{t.title}"</>;

              return (
                <li key={t._id} className="py-3 border-b border-borderC text-sm last:border-0 text-textMuted">
                  <span className="text-textMuted block text-xs mb-1 font-medium">{time}</span>
                  {message}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

const AdminView = ({ projects, tasks, allUsers, refreshData }) => {
  const [users, setUsers] = useState(allUsers);
  const [search, setSearch] = useState('');

  const [newProjectName, setNewProjectName] = useState('');
  const [newTask, setNewTask] = useState({ title: '', project: '', assignedTo: '', priority: 'Medium', dueDate: '' });

  const [taskSearch, setTaskSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredTasks = tasks.filter(t => {
    const query = taskSearch.toLowerCase();
    const assignee = allUsers.find(u => u._id === t.assignedTo)?.name.toLowerCase() || '';
    const matchSearch = t.title.toLowerCase().includes(query) || assignee.includes(query);
    const matchStatus = filterStatus ? t.status.toLowerCase() === filterStatus.toLowerCase() : true;
    const matchPriority = filterPriority ? t.priority === filterPriority : true;
    const matchDate = filterDate ? t.dueDate && t.dueDate.startsWith(filterDate) : true;
    return matchSearch && matchStatus && matchPriority && matchDate;
  });

  const [actionError, setActionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (search.trim() === '') {
      setUsers(allUsers);
    } else {
      const query = search.toLowerCase();
      setUsers(allUsers.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)));
    }
  }, [search, allUsers]);

  const createProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    setIsSubmitting(true);
    setActionError('');
    try {
      await axios.post('https://task-manager-backend-production-d7b3.up.railway.app/api/projects', { projectName: newProjectName, description: 'Created by Admin' });
      setNewProjectName('');
      await refreshData();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error creating project');
    } finally { setIsSubmitting(false); }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.project || !newTask.assignedTo) return setActionError('Please fill all required task fields');
    setIsSubmitting(true);
    setActionError('');
    try {
      await axios.post('https://task-manager-backend-production-d7b3.up.railway.app/api/tasks', newTask);
      setNewTask({ title: '', project: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      await refreshData();
    } catch (err) {
      setActionError('Error creating task');
    } finally { setIsSubmitting(false); }
  };

  const handleAddMember = async (projectId, userId) => {
    if (!userId) return;
    setIsSubmitting(true);
    try {
      const project = projects.find(p => p._id === projectId);
      await axios.put(`https://task-manager-backend-production-d7b3.up.railway.app/api/projects/${projectId}`, { members: [...project.members, userId] });
      await refreshData();
    } catch (err) {
      setActionError('Error assigning member');
    } finally { setIsSubmitting(false); }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
    setIsSubmitting(true);
    try {
      await axios.delete(`https://task-manager-backend-production-d7b3.up.railway.app/api/${type}/${id}`);
      await refreshData();
    } catch (err) {
      setActionError(`Error deleting ${type}`);
    } finally { setIsSubmitting(false); }
  };

  return (
    <div>
      <TaskChartsAndActivity tasks={tasks} projects={projects} allUsers={allUsers} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {actionError && <div className="col-span-full bg-danger/10 text-danger p-4 rounded-lg border border-danger font-medium">⚠️ {actionError}</div>}

        {/* Column 1: Projects & Tasks Create */}
        <div className="flex flex-col gap-8">
          <div className="card !mb-0">
            <h3 className="section-title">Workspace Projects</h3>
            <form onSubmit={createProject} className="flex flex-col sm:flex-row gap-3 mb-6">
              <input className="input !mb-0 flex-1" type="text" placeholder="Enter New Project Name..." value={newProjectName} onChange={e => setNewProjectName(e.target.value)} disabled={isSubmitting} />
              <button type="submit" className="btn btn-primary whitespace-nowrap" disabled={isSubmitting || !newProjectName}>+ New Project</button>
            </form>

            <div className="flex flex-col gap-3">
              {projects.length === 0 ? <p className="text-textMuted">No projects exist.</p> : projects.map(p => (
                <div key={p._id} className="list-item flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <strong className="text-lg text-textMain">{p.projectName}</strong>
                    <button className="text-textMuted hover:text-danger text-sm font-bold transition-colors" onClick={() => deleteItem('projects', p._id)} disabled={isSubmitting}>Delete</button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-bgBody p-2 rounded-lg border border-borderC">
                    <span className="text-xs font-bold text-textMuted whitespace-nowrap ml-2">TEAM ({p.members?.length || 0})</span>
                    <select className="input !mb-0 !p-1.5 text-sm bg-transparent border-none w-full" onChange={(e) => handleAddMember(p._id, e.target.value)} defaultValue="" disabled={isSubmitting}>
                      <option value="" disabled>+ Invite Member</option>
                      {allUsers.map(u => <option key={u._id} value={u._id} disabled={p.members.includes(u._id)}>{u.name}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card !mb-0">
            <h3 className="section-title">Create New Task</h3>
            <form onSubmit={createTask} className="flex flex-col gap-4">
              <input className="input !mb-0" type="text" placeholder="What needs to be done?" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} disabled={isSubmitting} />
              <div className="flex flex-col sm:flex-row gap-4">
                <select className="input !mb-0 flex-1" value={newTask.project} onChange={e => setNewTask({ ...newTask, project: e.target.value })} disabled={isSubmitting}>
                  <option value="" disabled>1. Select Project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                </select>
                <select className="input !mb-0 flex-1" value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })} disabled={isSubmitting}>
                  <option value="" disabled>2. Assign Owner</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <select className="input !mb-0 flex-1" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })} disabled={isSubmitting}>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                <input className="input !mb-0 flex-1" type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} disabled={isSubmitting} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Add Task</button>
            </form>
          </div>
        </div>

        {/* Column 2: Overview & Search */}
        <div className="flex flex-col gap-8">
          <div className="card !mb-0 flex flex-col h-full">
            <h3 className="section-title text-danger flex items-center gap-2 border-danger/30">⚠️ Critical Overdue</h3>
            <div className="max-h-[300px] overflow-y-auto mb-8 pr-2">
              {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed').length === 0 ? (
                <p className="text-textMuted">No overdue tasks. You're completely caught up!</p>
              ) : tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed').map(t => (
                <div key={t._id} className="list-item border-l-4 border-l-danger flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-danger/5">
                  <div>
                    <div className="mb-2">
                      <strong className="text-lg text-textMain">{t.title}</strong>
                      <span className="badge bg-danger text-white ml-2">OVERDUE</span>
                    </div>
                    <p className="m-0 text-sm text-textMuted leading-relaxed">
                      Owner: <span className="text-textMain font-medium">{allUsers.find(u => u._id === t.assignedTo)?.name || 'Unknown'}</span> <br />
                      Due: <span className="text-danger font-bold">{new Date(t.dueDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <button className="text-danger hover:underline text-sm font-bold" onClick={() => deleteItem('tasks', t._id)} disabled={isSubmitting}>Delete</button>
                </div>
              ))}
            </div>

            <h3 className="section-title">All Tasks ({filteredTasks.length})</h3>

            <div className="flex flex-col gap-3 mb-4 bg-bgBody p-4 rounded-xl border border-borderC">
              <input className="input !mb-0 shadow-sm" type="text" placeholder="Search by title or owner..." value={taskSearch} onChange={e => setTaskSearch(e.target.value)} />
              <div className="flex flex-col sm:flex-row gap-3">
                <select className="input !mb-0 flex-1 shadow-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="">Status: All</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">Working on it</option>
                  <option value="Completed">Done</option>
                </select>
                <select className="input !mb-0 flex-1 shadow-sm" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                  <option value="">Priority: All</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input className="input !mb-0 flex-1 shadow-sm" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] pr-2">
              {filteredTasks.length === 0 ? <p className="text-textMuted">No tasks match your filters.</p> : filteredTasks.map(t => {
                const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed';
                return (
                  <div key={t._id} className={`list-item flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${isOverdue ? 'border-l-4 border-l-danger bg-danger/5' : 'border-l-4 border-l-primary/50'}`}>
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <strong className="text-lg block w-full sm:w-auto text-textMain">{t.title}</strong>
                        <span className={`badge text-white ${t.status === 'Completed' || t.status === 'completed' ? 'bg-success' : t.status === 'In Progress' || t.status === 'in-progress' ? 'bg-warning text-black' : 'bg-primary'}`}>{t.status === 'In Progress' ? 'Working on it' : t.status === 'Completed' ? 'Done' : 'Todo'}</span>
                        {isOverdue && <span className="badge bg-danger text-white">OVERDUE</span>}
                        <span className={`badge bg-transparent border border-borderC ${t.priority === 'High' ? 'text-danger border-danger/30 bg-danger/10' : t.priority === 'Medium' ? 'text-primary border-primary/30 bg-primary/10' : 'text-textMuted bg-gray-50'}`}>{t.priority}</span>
                      </div>
                      <p className="m-0 text-sm text-textMuted leading-relaxed">
                        Owner: <span className="text-textMain font-medium">{allUsers.find(u => u._id === t.assignedTo)?.name || 'Unknown'}</span> <br />
                        Project: <span className="text-textMain font-medium">{projects.find(p => p._id === t.project)?.projectName || 'Unknown'}</span>
                        {t.dueDate && <><br />Due: <span className={isOverdue ? 'text-danger font-bold' : 'text-textMain font-medium'}>{new Date(t.dueDate).toLocaleDateString()}</span></>}
                      </p>
                    </div>
                    <button className="text-textMuted hover:text-danger text-sm font-bold transition-colors w-full sm:w-auto text-left sm:text-right" onClick={() => deleteItem('tasks', t._id)} disabled={isSubmitting}>Delete</button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemberView = ({ projects, tasks, refreshData }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const [taskSearch, setTaskSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredTasks = tasks ? tasks.filter(t => {
    const query = taskSearch.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(query);
    const matchStatus = filterStatus ? t.status.toLowerCase() === filterStatus.toLowerCase() : true;
    const matchPriority = filterPriority ? t.priority === filterPriority : true;
    const matchDate = filterDate ? t.dueDate && t.dueDate.startsWith(filterDate) : true;
    return matchSearch && matchStatus && matchPriority && matchDate;
  }) : [];

  const updateStatus = async (taskId, newStatus) => {
    setIsUpdating(true);
    try {
      await axios.put(`https://task-manager-backend-production-d7b3.up.railway.app/api/tasks/${taskId}`, { status: newStatus });
      await refreshData();
    } catch (err) {
      alert('Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card !mb-0">
        <h3 className="section-title text-primary">My Projects ({projects?.length || 0})</h3>
        {!projects || projects.length === 0 ? <p className="text-textMuted">You have no assigned projects.</p> : (
          <div className="flex flex-col gap-3">
            {projects.map(p => (
              <div key={p._id} className="list-item border-l-4 border-l-primary/50">
                <strong className="text-xl text-textMain">{p.projectName}</strong>
                <p className="m-0 mt-2 text-sm text-textMuted font-medium">Team members: {p.members.length}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card !mb-0 flex flex-col h-full">
        <h3 className="section-title text-danger border-danger/30">⚠️ Critical Overdue</h3>
        <div className="mb-8">
          {tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed').length === 0 ? (
            <p className="text-textMuted">You have no overdue tasks!</p>
          ) : tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed').map(t => (
            <div key={t._id} className="list-item border-l-4 border-l-danger bg-danger/5">
              <strong className="text-lg text-textMain">{t.title}</strong>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="badge bg-danger text-white">OVERDUE</span>
                <span className="text-sm text-danger font-bold">Due: {new Date(t.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button className={`btn btn-outline flex-1 ${t.status === 'In Progress' || t.status === 'in-progress' ? 'opacity-50 cursor-not-allowed' : 'border-warning text-warning hover:bg-warning/10'}`} onClick={() => updateStatus(t._id, 'In Progress')} disabled={isUpdating || t.status === 'In Progress' || t.status === 'in-progress'}>Working on it</button>
                <button className="btn btn-success flex-1" onClick={() => updateStatus(t._id, 'Completed')} disabled={isUpdating}>Mark as Done</button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="section-title">My Tasks ({filteredTasks.length})</h3>

        <div className="flex flex-col gap-3 mb-6 bg-bgBody p-4 rounded-xl border border-borderC">
          <input className="input !mb-0 shadow-sm" type="text" placeholder="Search my tasks..." value={taskSearch} onChange={e => setTaskSearch(e.target.value)} />
          <div className="flex flex-col sm:flex-row gap-3">
            <select className="input !mb-0 flex-1 shadow-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Status: All</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">Working on it</option>
              <option value="Completed">Done</option>
            </select>
            <select className="input !mb-0 flex-1 shadow-sm" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="">Priority: All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input className="input !mb-0 flex-1 shadow-sm" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[500px] pr-2">
          {filteredTasks.length === 0 ? <p className="text-textMuted">No tasks match your filters.</p> : (
            <div className="flex flex-col gap-3">
              {filteredTasks.map(t => {
                const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed';
                return (
                  <div key={t._id} className={`list-item flex flex-col gap-4 ${isOverdue ? 'border-l-4 border-l-danger bg-danger/5' : 'border-l-4 border-l-primary/50'}`}>
                    <div>
                      <strong className="text-lg text-textMain">{t.title}</strong>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className={`badge ${t.status === 'Completed' || t.status === 'completed' ? 'bg-success text-white' : t.status === 'In Progress' || t.status === 'in-progress' ? 'bg-warning text-black' : 'bg-bgBody border border-borderC text-textMain'}`}>
                          {t.status === 'In Progress' ? 'Working on it' : t.status === 'Completed' ? 'Done' : 'Todo'}
                        </span>
                        {isOverdue && <span className="badge bg-danger text-white">OVERDUE</span>}
                        <span className={`badge bg-transparent border border-borderC ${t.priority === 'High' ? 'text-danger border-danger/30 bg-danger/10' : t.priority === 'Medium' ? 'text-primary border-primary/30 bg-primary/10' : 'text-textMuted bg-gray-50'}`}>
                          {t.priority}
                        </span>
                      </div>
                      {t.dueDate && <div className={`text-sm mt-3 ${isOverdue ? 'text-danger font-bold' : 'text-textMuted font-medium'}`}>Due: {new Date(t.dueDate).toLocaleDateString()}</div>}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className={`btn btn-outline flex-1 ${t.status === 'In Progress' || t.status === 'in-progress' ? 'opacity-50 cursor-not-allowed' : 'border-warning text-warning hover:bg-warning/10'}`} onClick={() => updateStatus(t._id, 'In Progress')} disabled={isUpdating || t.status === 'In Progress' || t.status === 'in-progress'}>Working on it</button>
                      <button className={`btn btn-success flex-1 ${t.status === 'Completed' || t.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => updateStatus(t._id, 'Completed')} disabled={isUpdating || t.status === 'Completed' || t.status === 'completed'}>Mark as Done</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
