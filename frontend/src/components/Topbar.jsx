import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 glass-panel sticky top-0 z-30 flex items-center justify-between px-6 border-b border-white/20 dark:border-white/5 backdrop-blur-xl">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold gradient-text hidden md:block">
          Placeshala <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Portal</span>
        </h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        <div className="flex items-center space-x-3 border-l pl-6 dark:border-slate-700 border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md cursor-pointer">
            {user?.name?.charAt(0)}
          </div>
          <button 
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-600 font-medium ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
