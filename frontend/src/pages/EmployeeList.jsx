import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EmployeeList = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/auth/users');
        // Filter only users with role 'member' (employees)
        const memberUsers = res.data.filter(u => u.role === 'member');
        setEmployees(memberUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchEmployees();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-danger/10 border border-danger/20 text-danger p-8 rounded-2xl flex flex-col items-center max-w-md text-center">
          <svg className="w-12 h-12 mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h2 className="text-xl font-bold mb-2">Unauthorized Access</h2>
          <p className="text-danger/70">This area is restricted to workspace administrators only.</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-textMuted font-medium flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="animate-fade-in relative z-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Team Directory</h1>
          <p className="text-textMuted text-lg">View and manage all members in your workspace.</p>
        </div>
        <div className="glass-effect px-5 py-3 rounded-xl flex items-center gap-3 border border-white/10 self-start md:self-auto">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-white leading-none">{employees.length}</div>
            <div className="text-textMuted text-xs uppercase tracking-wider mt-1">Total Members</div>
          </div>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden relative group border border-white/10">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Active Employees
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider pl-8">Employee Details</th>
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider">Emp ID</th>
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider">Email Address</th>
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider">Joined Date</th>
                <th className="p-4 text-textMuted text-xs font-bold uppercase tracking-wider pr-8 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees.map((emp, i) => (
                <tr key={emp._id} className="hover:bg-white/[0.03] transition-colors group/row">
                  <td className="p-4 pl-8 font-medium text-white flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/10 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0 relative group/photo shadow-lg shadow-black/20">
                      {emp.profilePicture ? (
                        <img src={`https://task-manager-backend-production-d7b3.up.railway.app${emp.profilePicture}`} className="w-full h-full object-cover" alt={emp.name} />
                      ) : (
                        emp.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="font-bold tracking-wide group-hover/row:text-primary transition-colors">{emp.name}</div>
                      <div className="text-xs text-textMuted">Team Member</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs px-2 py-1 bg-white/5 rounded border border-white/10 text-textMuted">{emp.employeeId || emp._id.substring(0, 8)}</span>
                  </td>
                  <td className="p-4 text-textMuted">{emp.email}</td>
                  <td className="p-4 text-sm text-textMuted">
                    {new Date(emp.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-4 pr-8 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-textMuted">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                      </div>
                      <h4 className="text-lg font-medium text-white mb-1">No employees found</h4>
                      <p className="text-sm">There are no team members in the system yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
