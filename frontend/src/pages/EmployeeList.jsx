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
        const res = await axios.get('http://localhost:5001/api/auth/users');
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
    return <div className="text-danger p-8">Unauthorized access. Admins only.</div>;
  }

  if (loading) return <div>Loading Employee List...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-textMain mb-8">Employee List</h1>
      
      <div className="card">
        <h3 className="section-title">All Employees ({employees.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-borderC">
                <th className="p-3 text-textMuted text-xs font-bold uppercase tracking-wide">Employee Name</th>
                <th className="p-3 text-textMuted text-xs font-bold uppercase tracking-wide">Emp ID</th>
                <th className="p-3 text-textMuted text-xs font-bold uppercase tracking-wide">Email</th>
                <th className="p-3 text-textMuted text-xs font-bold uppercase tracking-wide">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id} className="border-b border-borderC hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-textMain flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden flex-shrink-0">
                      {emp.profilePicture ? (
                        <img src={`http://localhost:5001${emp.profilePicture}`} className="w-full h-full object-cover"/>
                      ) : (
                        emp.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {emp.name}
                  </td>
                  <td className="p-3 text-textMuted font-mono text-sm">{emp.employeeId || emp._id}</td>
                  <td className="p-3 text-textMuted">{emp.email}</td>
                  <td className="p-3 text-sm text-textMuted">{new Date(emp.createdAt || Date.now()).toLocaleDateString()}</td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-textMuted">No employees found.</td>
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
