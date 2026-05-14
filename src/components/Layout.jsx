import React, { useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Workspace Projects', path: '/projects' },
    { name: 'Tasks Overview', path: '/tasks' },
    { name: 'My Profile', path: '/profile' }
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Employee List', path: '/employees' });
    navItems.push({ name: 'Admin Panel', path: '/admin' });
  }

  return (
    <div className="flex h-screen bg-bgBody">
      <aside className="w-64 bg-white border-r border-borderC flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-borderC">
          <h1 className="text-2xl font-bold text-primary tracking-tight">Ethara</h1>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <div className="text-xs font-bold text-textMuted uppercase tracking-wider mb-2 ml-2">Menu</div>
          {navItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-textMain hover:bg-gray-100'}`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-borderC bg-gray-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                {user.profilePicture ? (
                  <img src={`http://https://task-manager-backend-production-d7b3.up.railway.app:5001${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-textMain truncate m-0">{user.name}</p>
                <p className="text-xs text-textMuted truncate m-0">{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-xs font-bold text-danger hover:underline whitespace-nowrap bg-danger/10 px-2 py-1 rounded">Log out</button>
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
