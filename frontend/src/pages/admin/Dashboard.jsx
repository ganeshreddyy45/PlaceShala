import { useState, useEffect } from 'react';
import { adminApi } from '../../api/services';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Admin stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Opening Command Center...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slideIn">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Operations <span className="text-primary-600">Board</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time platform oversight and talent orchestration</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-[9px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Cloud Sync Active
          </div>
        </div>
      </header>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/students" className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-all border-l-4 border-l-transparent hover:border-l-indigo-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-6xl font-black">👥</span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Talent Pool</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalStudents || 0}</h3>
          <p className="text-[10px] text-green-600 font-bold mt-4">+12% vs LY</p>
        </Link>

        <Link to="/admin/companies" className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-all border-l-4 border-l-transparent hover:border-l-purple-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-6xl font-black">🏢</span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Corporate Partners</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalCompanies || 0}</h3>
          <p className="text-[10px] text-primary-600 font-bold mt-4">Verified Nodes</p>
        </Link>

        <Link to="/admin/jobs" className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-all border-l-4 border-l-transparent hover:border-l-cyan-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-6xl font-black">💼</span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Open Roles</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalJobs || 0}</h3>
          <p className="text-[10px] text-accent-cyan font-bold mt-4">Active Sourcing</p>
        </Link>

        <Link to="/admin/applications" className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-all border-l-4 border-l-transparent hover:border-l-pink-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-6xl font-black">📈</span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Network Flow</p>
          <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-none">{stats?.totalApplications || 0}</h3>
          <p className="text-[10px] text-accent-purple font-bold mt-4">Applications Sent</p>
        </Link>
      </div>

      {/* Insight Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-10 rounded-[3.5rem] relative overflow-hidden border-white/20 dark:border-white/5 shadow-2xl">
          <div className="mesh-bg opacity-10 dark:opacity-20 scale-150"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
             <div>
                <h3 className="text-2xl font-black font-display tracking-tight text-gray-900 dark:text-white">Usage Velocity</h3>
                <p className="text-sm text-gray-500 font-medium">Platform engagement over rolling 30 days</p>
             </div>
             <div className="flex gap-2">
                <span className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">Monthly</span>
                <span className="px-4 py-2 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-primary-600/20">Weekly</span>
             </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 px-4">
             {[60, 80, 45, 90, 70, 100, 85].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                   <div 
                    className="w-full bg-gradient-to-t from-primary-600/10 to-primary-600 rounded-t-2xl group-hover:scale-x-110 group-hover:brightness-110 transition-all duration-500 origin-bottom" 
                    style={{ height: `${val}%` }}
                   ></div>
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">W-0{7-i}</span>
                </div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group">
              <div className="mesh-bg opacity-10 scale-150 rotate-45"></div>
              <div className="relative z-10">
                 <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Rapid Response</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 p-5 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-amber-500/30 transition-colors cursor-pointer group/item">
                       <span className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform">⚠️</span>
                       <div>
                          <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Identity Audit</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">12 Flagged</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-indigo-500/30 transition-colors cursor-pointer group/item">
                       <span className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform">📧</span>
                       <div>
                          <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">Job Alerts</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Batch: 4k Send</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="bg-gray-900 dark:bg-slate-800 p-8 rounded-[2.5rem] text-white overflow-hidden relative group cursor-help">
              <div className="mesh-bg opacity-30 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-2">Core Pulse</h4>
                 <h3 className="text-3xl font-black mb-6 tracking-tighter">99.99% UP</h3>
                 <div className="flex -space-x-4">
                    {[1, 2, 3, 4, 5].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-4 border-gray-900 bg-gray-700 flex items-center justify-center text-[10px] font-black group-hover:-translate-y-1 transition-transform" style={{ transitionDelay: `${i*100}ms` }}>
                          O
                       </div>
                    ))}
                 </div>
                 <p className="text-[9px] font-black text-gray-500 mt-4 uppercase tracking-[0.2em]">Microservices Health: Normal</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
