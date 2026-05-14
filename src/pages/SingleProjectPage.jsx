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
          axios.get(`http://localhost:5001/api/projects`), // We have to filter from all projects for now since we don't have a GET /api/projects/:id explicitly set up for members without testing, but wait, the prompt says GET /api/projects/:id exists. We'll try it.
          axios.get('http://localhost:5001/api/tasks'),
          user?.role === 'admin' ? axios.get('http://localhost:5001/api/auth/users') : Promise.resolve({ data: [] })
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

  if (loading) return <div>Loading Project...</div>;
  if (!project) return null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textMain m-0">{project.projectName}</h1>
          <p className="text-textMuted m-0 mt-2">{project.description}</p>
        </div>
        <div className="flex gap-4 items-center">
          <span className="badge bg-gray-100 text-textMuted border border-borderC">{project.members.length} Members</span>
          <span className="badge bg-primary/10 text-primary border border-primary/20">{tasks.length} Tasks</span>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Project Tasks</h3>
        {tasks.length === 0 ? <p className="text-textMuted">No tasks in this project.</p> : (
          <div className="flex flex-col gap-3">
            {tasks.map(t => {
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
                    {user?.role === 'admin' && <><span className="text-textMain font-medium">Owner:</span> {allUsers.find(u => u._id === t.assignedTo)?.name || 'Unknown'} <br/></>}
                    {t.dueDate && <>Due: <span className={isOverdue ? 'text-danger font-bold' : 'text-textMain font-medium'}>{new Date(t.dueDate).toLocaleDateString()}</span></>}
                  </p>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProjectPage;
