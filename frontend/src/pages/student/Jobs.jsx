import { useState, useEffect } from 'react';
import { studentApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL'); // Changed from filterType
  const [message, setMessage] = useState('');
  const [applying, setApplying] = useState(null);

  const [studentSkills, setStudentSkills] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const allJobs = await studentApi.getJobs();
        setJobs(allJobs || []);
        
        if (user?.profileId) {
          const [recommended, profileData] = await Promise.all([
             studentApi.getRecommendedJobs(user.profileId),
             studentApi.getProfile(user.profileId)
          ]);
          setRecommendedJobs(recommended || []);
          if (profileData?.skills) {
             setStudentSkills(profileData.skills.split(',').map(s => s.trim().toLowerCase()));
          }
        }
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [user]);

  const getMatch = (job) => {
    if (studentSkills.length === 0) return 0;
    const jobSkills = (job.requiredSkills || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (jobSkills.length === 0) return 0;
    const matched = jobSkills.filter(s => studentSkills.includes(s)).length;
    return Math.round((matched / jobSkills.length) * 100);
  };

  const handleApply = async (jobId) => {
    if (!user?.profileId) {
      setMessage("Please create your profile first before applying.");
      return;
    }
    setApplying(jobId);
    try {
      await studentApi.applyForJob(user.profileId, jobId);
      setMessage("Successfully applied for the job!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply.");
    } finally {
      setApplying(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const displayedJobs = filter === 'RECOMMENDED' 
    ? (recommendedJobs || []).map(r => ({ ...r.job, matchPercentage: r.matchPercentage }))
    : (jobs || []).filter(j => 
        j.status === 'OPEN' && 
        (j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (j.requiredSkills && j.requiredSkills.toLowerCase().includes(searchTerm.toLowerCase())))
      ).map(j => ({ ...j, matchPercentage: getMatch(j) }));

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Discover <span className="text-primary-600">Opportunities</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Find and apply for your dream role</p>
        </div>
        
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Marketplace
          </button>
          <button 
            onClick={() => setFilter('RECOMMENDED')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filter === 'RECOMMENDED' ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-xl shadow-primary-600/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span>✨</span><span>Smart Matches</span>
          </button>
        </div>
      </header>

      {filter === 'ALL' && (
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <span className="text-xl">🔍</span>
          </div>
          <input 
            type="text" 
            placeholder="Search by role, company, or skills..." 
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] glass-panel border-white/20 dark:border-white/5 focus:ring-4 focus:ring-primary-600/10 outline-none transition-all placeholder:text-slate-400 text-lg font-medium shadow-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {message && (
        <div className="p-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] text-center animate-bounce shadow-xl shadow-primary-600/20">
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
           <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin mb-4"></div>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">Syncing Opportunities...</p>
        </div>
      ) : displayedJobs.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800">
          <span className="text-6xl mb-6 block">🛸</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Zero Signals Found</h3>
          <p className="text-slate-500 font-medium mt-2">No matching job nodes were detected in the network.</p>
          <button onClick={() => {setFilter('ALL'); setSearchTerm('');}} className="mt-8 px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Reset Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedJobs.map(job => (
            <div key={job.id} className="glass-panel rounded-[2.5rem] p-8 flex flex-col hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-white/5 relative group overflow-hidden hover:-translate-y-2">
              <div className="mesh-bg opacity-0 group-hover:opacity-5 transition-opacity"></div>
              
              {job.matchPercentage && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-emerald-600 text-white text-[10px] font-black px-5 py-2 rounded-bl-2xl shadow-lg uppercase tracking-widest">
                  {job.matchPercentage}% Match
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                    {job.company?.name?.charAt(0) || '🏢'}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">{job.title}</h3>
                    <p className="text-xs font-bold text-primary-500 uppercase tracking-widest">{job.company?.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400 mb-8 flex-1 font-medium">
                <div className="flex items-center gap-3"><span className="text-lg">📍</span><span>{job.location}</span></div>
                <div className="flex items-center gap-3"><span className="text-lg">⏲️</span><span className="capitalize">{job.type?.toLowerCase().replace('_', ' ')}</span></div>
                <div className="flex items-center gap-3"><span className="text-lg">💰</span><span className="text-slate-900 dark:text-white font-bold">₹{job.salary?.toLocaleString()}</span></div>
                
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Core Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.split(',').slice(0, 3).map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700">{s.trim()}</span>
                    ))}
                    {job.requiredSkills?.split(',').length > 3 && <span className="text-[10px] font-bold text-slate-400 ml-1">+{job.requiredSkills.split(',').length - 3} more</span>}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleApply(job.id)}
                disabled={applying === job.id}
                className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-600 dark:hover:bg-primary-600 transition-all duration-300 disabled:opacity-50 group/btn shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                   {applying === job.id ? 'Establishing Link...' : 'Execute Application'}
                   <span className="text-lg group-hover/btn:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
