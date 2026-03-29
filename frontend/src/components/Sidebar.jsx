import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  
  const studentLinks = [
    { to: '/student/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/student/profile', icon: '👤', label: 'My Profile' },
    { to: '/student/jobs', icon: '💼', label: 'Browse Jobs' },
    { to: '/student/applications', icon: '📝', label: 'My Applications' },
    { to: '/student/interviews', icon: '🗓️', label: 'Interviews' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: '📊', label: 'Admin Panel' },
    { to: '/admin/students', icon: '🎓', label: 'Students' },
    { to: '/admin/companies', icon: '🏢', label: 'Companies' },
    { to: '/admin/jobs', icon: '💼', label: 'Manager Jobs' },
    { to: '/admin/applications', icon: '📋', label: 'Applications' },
    { to: '/admin/interviews', icon: '🗓️', label: 'Interviews' },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <aside className="w-72 hidden md:flex flex-col h-[calc(100vh-2.5rem)] my-5 ml-5 glass-panel rounded-3xl sticky top-5 z-40 transition-all duration-500 hover:shadow-2xl border-white/20 dark:border-white/5">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white shadow-lg rotate-3">
            <span className="text-xl font-bold">P</span>
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">Placeshala <span className="text-primary-600 text-[10px] uppercase align-top font-black">AI</span></span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-3">Navigation Menu</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-primary-600/10 to-transparent text-primary-600 shadow-sm border-l-4 border-primary-600' 
                  : 'text-gray-500 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{link.icon}</span>
                <span className={`font-medium text-sm ${isActive ? 'font-bold' : ''}`}>{link.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-600/5 to-accent-cyan/5 border border-primary-600/10 hidden lg:block">
          <p className="text-xs font-bold text-primary-800 dark:text-primary-200 mb-1">AI Match Active</p>
          <p className="text-[10px] text-gray-400">Your profile is being analyzed for new jobs.</p>
        </div>
      </div>
    </aside>
  );
}
