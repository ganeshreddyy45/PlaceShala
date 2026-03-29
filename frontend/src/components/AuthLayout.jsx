import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300 noise overflow-hidden font-display">
      <div className="mesh-bg opacity-30 dark:opacity-60"></div>
      
      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-2xl glass-panel hover:bg-white dark:hover:bg-slate-800 z-50 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Left Branding Panel: Clean & Professional */}
      <div className="md:w-[45%] lg:w-[40%] bg-slate-900 text-white flex flex-col justify-between p-12 lg:p-20 relative overflow-hidden hidden md:flex border-r border-white/10 shadow-2xl">
        <div className="mesh-bg opacity-40 scale-150 rotate-12"></div>
        
        {/* Logo and Name */}
        <div className="relative z-10 flex items-center gap-4 animate-slideIn">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-2xl flex items-center justify-center text-3xl font-black rotate-3 hover:rotate-0 transition-transform duration-500">
            P
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Placeshala</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">Talent Ecosystem</p>
          </div>
        </div>

        {/* Value Prop */}
        <div className="relative z-10 max-w-sm">
          <h1 className="text-5xl lg:text-6xl font-black leading-none mb-8 tracking-tighter animate-fadeIn">
            Elevate Your <span className="text-primary-500">Future.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium italic">
            "The most advanced AI-powered placement platform designed for elite students and top-tier recruiters."
          </p>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-2xl block mb-2">⚡</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Resume</p>
                <p className="text-xs font-semibold">Instant Scoring</p>
             </div>
             <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-2xl block mb-2">🎯</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Smart Match</p>
                <p className="text-xs font-semibold">98% Accuracy</p>
             </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10">
          <div className="flex -space-x-3 mb-4">
             {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black shadow-lg">
                   {i}
                </div>
             ))}
             <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-primary-600 flex items-center justify-center text-[10px] font-black shadow-lg">
                +2k
             </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Talent Network</p>
        </div>
      </div>

      {/* Right Form Panel: Minimal & Fast */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 relative overflow-y-auto">
        <div className="w-full max-w-md animate-fadeIn">
          <div className="md:hidden flex flex-col items-center mb-12">
             <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white text-2xl font-black mb-4 shadow-lg">P</div>
             <h2 className="text-3xl font-black tracking-tight dark:text-white">Placeshala</h2>
          </div>
          <Outlet />
        </div>
        
        {/* Minimal Footer */}
        <footer className="mt-auto pt-12 text-center">
           <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">
              Precision Built © 2026 Placeshala AI
           </p>
        </footer>
      </div>
    </div>
  );
}
