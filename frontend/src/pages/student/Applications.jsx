import { useState, useEffect } from 'react';
import { studentApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.profileId) {
        setLoading(false);
        return;
      }
      try {
        const data = await studentApi.getApplications(user.profileId);
        setApplications(data);
      } catch (err) {
        console.error("Applications fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-500/10 border-blue-500/20 text-blue-600';
      case 'UNDER_REVIEW': return 'bg-purple-500/10 border-purple-500/20 text-purple-600';
      case 'INTERVIEW_SCHEDULED': return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600';
      case 'REJECTED': return 'bg-red-500/10 border-red-500/20 text-red-600';
      case 'SELECTED': return 'bg-green-500/10 border-green-500/20 text-green-600';
      default: return 'bg-amber-500/10 border-amber-500/20 text-amber-600';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose">Synchronizing Pipeline...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold font-display tracking-tight gradient-text">Application Pipeline</h1>
          <p className="text-gray-500 font-medium">Monitoring your professional trajectory</p>
        </div>
        <div className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {applications.length} Active Pursuits
        </div>
      </header>

      {applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app, index) => (
            <div key={app.id} className="glass-panel group p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-500 border-l-4 border-l-transparent hover:border-l-primary-600 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-6xl font-black">#0{index + 1}</span>
               </div>
               
               <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-inner shadow-black/5 group-hover:rotate-3 transition-transform">
                    {index % 2 === 0 ? '🎯' : '🚀'}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{app.job.title}</h3>
                    <p className="text-sm font-bold text-gray-400 flex items-center gap-2">
                       <span>🏢 {app.job.company.name}</span>
                       <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                       <span>📍 {app.job.location}</span>
                    </p>
                  </div>
               </div>

               <div className="flex flex-col md:items-end gap-3 w-full md:w-auto relative z-10">
                  <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-4">
                     <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Applied Date</span>
                        <span className="text-xs font-bold text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</span>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass-panel rounded-[3rem] animate-fadeIn">
          <div className="w-24 h-24 bg-primary-600/5 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 floating">📥</div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2">Workspace Quiet</h2>
          <p className="text-gray-400 font-medium mb-10 max-w-sm mx-auto">Your application pipeline is currently clear. Higher matched opportunities are waiting in the jobs portal.</p>
          <Link to="/student/jobs" className="px-10 py-5 bg-gradient-to-r from-primary-600 to-accent-purple text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-600/30 hover:scale-105 transition-all">
            Explore Open Roles
          </Link>
        </div>
      )}
    </div>
  );
}
