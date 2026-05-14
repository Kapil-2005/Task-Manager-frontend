import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TasksPage = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  
  const [taskSearch, setTaskSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  const [newTask, setNewTask] = useState({ title: '', project: '', assignedTo: '', priority: 'Medium', dueDate: '' });
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTasks = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5001/api/tasks'),
        axios.get('http://localhost:5001/api/projects'),
        user?.role === 'admin' ? axios.get('http://localhost:5001/api/auth/users') : Promise.resolve({ data: [] })
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
      await axios.put(`http://localhost:5001/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally { setIsUpdating(false); }
  };

  const deleteTask = async (taskId) => {
    if(!window.confirm('Delete this task?')) return;
    setIsUpdating(true);
    try {
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally { setIsUpdating(false); }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.project || !newTask.assignedTo) return alert('Please fill all required task fields');
    setIsUpdating(true);
    try {
      await axios.post('http://localhost:5001/api/tasks', newTask);
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

  if (loading) return <div>Loading Tasks...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-textMain mb-8">{user?.role === 'admin' ? 'All Workspace Tasks' : 'My Tasks'}</h1>

      {user?.role === 'admin' && (
        <div className="card mb-8">
          <h3 className="section-title">Create New Task</h3>
          <form onSubmit={createTask} className="flex flex-col gap-4">
            <input className="input !mb-0" type="text" placeholder="What needs to be done?" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} disabled={isUpdating} />
            <div className="flex flex-col sm:flex-row gap-4">
              <select className="input !mb-0 flex-1" value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})} disabled={isUpdating}>
                <option value="" disabled>1. Select Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
              </select>
              <select className="input !mb-0 flex-1" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} disabled={isUpdating}>
                <option value="" disabled>2. Assign Owner</option>
                {allUsers.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select className="input !mb-0 flex-1" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} disabled={isUpdating}>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <input className="input !mb-0 flex-1" type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} disabled={isUpdating} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isUpdating}>Add Task</button>
          </form>
        </div>
      )}

      <div className="card mb-8 bg-bgBody border-borderC">
        <h3 className="section-title">Filter Tasks</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input className="input !mb-0 flex-1 shadow-sm" type="text" placeholder={user?.role === 'admin' ? "Search by title or owner..." : "Search tasks..."} value={taskSearch} onChange={e => setTaskSearch(e.target.value)} />
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

      <div className="flex flex-col gap-4">
        {filteredTasks.length === 0 ? <p className="text-textMuted">No tasks match your filters.</p> : filteredTasks.map(t => {
          const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed';
          return (
            <div key={t._id} className={`list-item flex flex-col md:flex-row justify-between md:items-center gap-4 ${isOverdue ? 'border-l-4 border-l-danger bg-danger/5' : 'border-l-4 border-l-primary/50'}`}>
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <strong className="text-lg text-textMain">{t.title}</strong>
                  <span className={`badge text-white ${t.status === 'Completed' || t.status === 'completed' ? 'bg-success' : t.status === 'In Progress' || t.status === 'in-progress' ? 'bg-warning text-black' : 'bg-primary'}`}>{t.status === 'In Progress' ? 'Working on it' : t.status === 'Completed' ? 'Done' : 'Todo'}</span>
                  {isOverdue && <span className="badge bg-danger text-white">OVERDUE</span>}
                  <span className={`badge bg-transparent border border-borderC ${t.priority === 'High' ? 'text-danger border-danger/30 bg-danger/10' : t.priority === 'Medium' ? 'text-primary border-primary/30 bg-primary/10' : 'text-textMuted bg-gray-50'}`}>{t.priority}</span>
                </div>
                <p className="m-0 text-sm text-textMuted">
                  {user?.role === 'admin' && <><span className="font-medium text-textMain">Owner:</span> {allUsers.find(u => u._id === t.assignedTo)?.name || 'Unknown'} &bull; </>}
                  <span className="font-medium text-textMain">Project:</span> {projects.find(p => p._id === t.project)?.projectName || 'Unknown'}
                  {t.dueDate && <><br/><span className={isOverdue ? 'text-danger font-bold' : 'font-medium text-textMain'}>Due: {new Date(t.dueDate).toLocaleDateString()}</span></>}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:w-auto w-full">
                {user?.role === 'member' && (
                  <>
                    <button className={`btn btn-outline ${t.status === 'In Progress' || t.status === 'in-progress' ? 'opacity-50 cursor-not-allowed' : 'border-warning text-warning hover:bg-warning/10'}`} onClick={() => updateStatus(t._id, 'In Progress')} disabled={isUpdating || t.status === 'In Progress' || t.status === 'in-progress'}>Working on it</button>
                    <button className={`btn btn-success ${t.status === 'Completed' || t.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => updateStatus(t._id, 'Completed')} disabled={isUpdating || t.status === 'Completed' || t.status === 'completed'}>Mark as Done</button>
                  </>
                )}
                {user?.role === 'admin' && (
                  <button className="btn btn-outline border-danger text-danger hover:bg-danger/10" onClick={() => deleteTask(t._id)} disabled={isUpdating}>Delete</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default TasksPage;
