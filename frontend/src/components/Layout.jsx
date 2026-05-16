import React, { useContext, useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showNotif, setShowNotif] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const notifRef = useRef(null);
  const calRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch tasks for notifications & calendar
  useEffect(() => {
    axios.get('https://task-manager-backend-production-d7b3.up.railway.app/api/tasks')
      .then(r => setTasks(r.data)).catch(() => {});
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (calRef.current && !calRef.current.contains(e.target)) setShowCal(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Notification data
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed' && t.status !== 'completed');
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const notifCount = overdueTasks.length;

  // Calendar helpers
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const monthName = new Date(calYear, calMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();
  const taskDueDates = tasks.filter(t => t.dueDate).map(t => new Date(t.dueDate).toDateString());

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
    { name: 'Projects', path: '/projects', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> },
    { name: 'My Tasks', path: '/tasks', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> },
    { name: 'Vital Tasks', path: '/tasks?filter=vital', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>, vital: true },
    { name: 'Settings', path: '/profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> },
    { name: 'Help', path: '/help', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
  ];
  if (user?.role === 'admin') {
    navItems.push({ name: 'Team / Members', path: '/employees', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> });
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg> });
  }

  return (
    <div className="flex h-screen bg-bgBody text-textMain overflow-hidden font-sans relative">
      {isMobile && isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed md:relative w-72 bg-sidebarBg/95 backdrop-blur-xl border-r border-borderC text-white flex flex-col z-50 overflow-hidden transition-all duration-300 h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-24 lg:w-72'}`}>
        <div className="p-6 md:p-8 relative z-10 flex items-center justify-between mt-4">
          <div className={`flex flex-col items-center mx-auto overflow-hidden ${!isSidebarOpen && !isMobile && 'md:justify-center'}`}>
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0 mb-3 border-2 border-white shadow-lg shadow-white/10 overflow-hidden scale-hover cursor-pointer">
              {user?.profilePicture ? <img src={`https://task-manager-backend-production-d7b3.up.railway.app${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-sidebarBg font-black text-2xl">{user?.name?.charAt(0).toUpperCase()}</span>}
            </div>
            <div className={`text-center transition-opacity duration-300 ${!isSidebarOpen && !isMobile ? 'md:hidden' : 'opacity-100'}`}>
              <h1 className="text-lg font-bold text-white tracking-tight whitespace-nowrap">{user?.name || 'User'}</h1>
              <p className="text-xs text-textMuted">{user?.email}</p>
            </div>
          </div>
          {isMobile && <button onClick={() => setIsSidebarOpen(false)} className="text-textMuted hover:text-white absolute top-6 right-6"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>}
        </div>
        <nav className="flex-1 p-4 md:p-6 flex flex-col gap-1.5 overflow-y-auto relative z-10 custom-scrollbar mt-4">
          {navItems.map(item => {
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path.split('?')[0]) && (item.path.includes('?') ? location.search.includes(item.path.split('?')[1]) : !location.search);
            return (
              <Link key={item.path} to={item.path} className={`sidebar-item group ${isActive ? 'active' : 'text-textMuted hover:text-white'}`} title={item.name}>
                <div className={`sidebar-icon flex-shrink-0 scale-hover ${item.vital ? 'text-danger' : ''}`}>{item.icon}</div>
                <span className={`whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && !isMobile ? 'md:hidden' : 'opacity-100'}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 relative z-10 border-t border-borderC">
          <button onClick={handleLogout} className="sidebar-item text-textMuted hover:text-white w-full">
            <svg className="w-5 h-5 flex-shrink-0 scale-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span className={`whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && !isMobile ? 'md:hidden' : 'opacity-100'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        <header className="h-20 bg-bgBody/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30 pt-4 pb-2 border-b border-borderC">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 rounded-xl bg-white/5 border border-borderC text-textMain hover:bg-white/10 md:hidden scale-hover"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
            <h1 className="text-2xl font-bold tracking-tight hidden md:flex items-center"><span className="text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]">Dash</span><span className="text-white">board</span></h1>
            <div className="hidden md:flex items-center bg-white/5 border border-borderC rounded-xl px-4 py-2.5 ml-8 w-80 focus-within:border-primary/50 transition-all">
              <svg className="w-4 h-4 text-textMuted mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Search your task here..." className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder-textMuted" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* NOTIFICATION BELL */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setShowNotif(!showNotif); setShowCal(false); }} className="relative w-11 h-11 rounded-xl bg-white/5 border-2 border-secondary flex items-center justify-center hover:bg-white/10 transition-all scale-hover shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {notifCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-bgBody">{notifCount}</span>}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-14 w-96 bg-bgCard border border-borderC rounded-2xl shadow-2xl animate-fade-in overflow-hidden z-50">
                  <div className="p-4 border-b border-borderC flex justify-between items-center">
                    <h3 className="font-bold text-white text-lg">Notifications</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">{notifCount} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {overdueTasks.length > 0 && overdueTasks.map(t => (
                      <div key={t._id} className="p-4 border-b border-borderC hover:bg-white/5 cursor-pointer transition-colors" onClick={() => { navigate('/tasks'); setShowNotif(false); }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-danger/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01"></path></svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{t.title}</p>
                            <p className="text-xs text-danger font-medium">Overdue — was due {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentTasks.filter(t => !overdueTasks.find(o => o._id === t._id)).map(t => (
                      <div key={t._id} className="p-4 border-b border-borderC hover:bg-white/5 cursor-pointer transition-colors" onClick={() => { navigate('/tasks'); setShowNotif(false); }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"></path></svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{t.title}</p>
                            <p className="text-xs text-textMuted">Created {new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {tasks.length === 0 && <div className="p-8 text-center text-textMuted text-sm">No notifications yet</div>}
                  </div>
                  <div className="p-3 border-t border-borderC">
                    <button onClick={() => { navigate('/tasks'); setShowNotif(false); }} className="w-full text-center text-sm font-semibold text-primary hover:text-white transition-colors py-2 rounded-xl hover:bg-white/5">View All Tasks →</button>
                  </div>
                </div>
              )}
            </div>

            {/* CALENDAR */}
            <div className="relative" ref={calRef}>
              <button onClick={() => { setShowCal(!showCal); setShowNotif(false); }} className="relative w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all scale-hover">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </button>
              {showCal && (
                <div className="absolute right-0 top-14 w-80 bg-bgCard border border-borderC rounded-2xl shadow-2xl animate-fade-in overflow-hidden z-50">
                  <div className="p-4 border-b border-borderC flex justify-between items-center">
                    <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h3 className="font-bold text-white text-sm">{monthName}</h3>
                    <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-center text-xs font-bold text-textMuted py-1">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = new Date(calYear, calMonth, day).toDateString();
                        const isToday = today.getDate() === day && today.getMonth() === calMonth && today.getFullYear() === calYear;
                        const hasTask = taskDueDates.includes(dateStr);
                        return (
                          <div key={day} className={`relative text-center text-xs py-2 rounded-lg cursor-pointer transition-all ${isToday ? 'bg-primary text-white font-bold shadow-lg shadow-primary/30' : hasTask ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/20' : 'text-textMuted hover:bg-white/5'}`}>
                            {day}
                            {hasTask && !isToday && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="p-3 border-t border-borderC">
                    <div className="text-xs text-textMuted flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span> Tasks due on highlighted dates
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex flex-col text-right ml-2 border-l border-borderC pl-6">
              <span className="text-sm font-bold text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
              <span className="text-xs font-bold text-primary tracking-wide">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-bgBody">
          <div className="p-4 md:p-8 lg:p-10 max-w-[1400px] mx-auto w-full page-enter" key={location.pathname + location.search}>
            <Outlet />
          </div>
        </main>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar{width:6px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:10px}.custom-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.2)}`}} />
    </div>
  );
};

export default Layout;
