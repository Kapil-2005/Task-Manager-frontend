import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
          axios.get('http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/projects'),
          axios.get('http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/tasks'),
          user?.role === 'admin' ? axios.get('http://https://task-manager-backend-production-d7b3.up.railway.app:5001/api/auth/users') : Promise.resolve({ data: [] })
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

  if (loading) return <div className="text-textMuted font-medium">Loading Dashboard...</div>;
  if (error) return <div className="text-danger bg-danger/10 p-4 rounded-lg border border-danger">⚠️ {error}</div>;

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed').length;

  const pieData = [
    { name: 'Done', value: completedTasks, color: '#00c875' },
    { name: 'Working', value: tasks.filter(t => t.status === 'In Progress' || t.status === 'in-progress').length, color: '#fdab3d' },
    { name: 'Todo', value: tasks.filter(t => t.status === 'Todo' || t.status === 'todo').length, color: '#0073ea' },
  ];

  const sortedTasks = [...tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-textMain mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="card !mb-0 border-t-4 border-t-primary p-5 text-center sm:text-left">
          <h4 className="text-textMuted text-xs font-bold uppercase tracking-wide m-0">Projects</h4>
          <h2 className="text-3xl font-bold mt-2 mb-0 text-textMain">{totalProjects}</h2>
        </div>
        <div className="card !mb-0 border-t-4 border-t-textMuted p-5 text-center sm:text-left">
          <h4 className="text-textMuted text-xs font-bold uppercase tracking-wide m-0">Total Tasks</h4>
          <h2 className="text-3xl font-bold mt-2 mb-0 text-textMain">{totalTasks}</h2>
        </div>
        <div className="card !mb-0 border-t-4 border-t-success p-5 text-center sm:text-left">
          <h4 className="text-textMuted text-xs font-bold uppercase tracking-wide m-0">Done</h4>
          <h2 className="text-3xl font-bold mt-2 mb-0 text-textMain">{completedTasks}</h2>
        </div>
        <div className="card !mb-0 border-t-4 border-t-warning p-5 text-center sm:text-left">
          <h4 className="text-textMuted text-xs font-bold uppercase tracking-wide m-0">Working</h4>
          <h2 className="text-3xl font-bold mt-2 mb-0 text-textMain">{pendingTasks}</h2>
        </div>
        <div className="card !mb-0 border-t-4 border-t-danger p-5 col-span-2 md:col-span-1 text-center sm:text-left">
          <h4 className="text-danger text-xs font-bold uppercase tracking-wide m-0">Overdue</h4>
          <h2 className={`text-3xl font-bold mt-2 mb-0 ${overdueTasks > 0 ? 'text-danger' : 'text-textMain'}`}>{overdueTasks}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card !mb-0">
          <h3 className="section-title">Status Breakdown</h3>
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
                const assignee = user?.role === 'admin' ? (allUsers.find(u => u._id === t.assignedTo)?.name || 'Someone') : 'You';
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
    </div>
  );
};

export default DashboardOverview;
