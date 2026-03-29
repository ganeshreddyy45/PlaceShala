import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../api/services';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [readiness, setReadiness] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [skillGap, setSkillGap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.profileId) {
        setLoading(false);
        return;
      }
      try {
        const [readinessData, jobsData, gapData] = await Promise.all([
          studentApi.getPlacementReadiness(user.profileId),
          studentApi.getRecommendedJobs(user.profileId),
          studentApi.getSkillGap(user.profileId)
        ]);
        setReadiness(readinessData);
        setRecommendedJobs(jobsData);
        setSkillGap(gapData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (!user?.profileId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fadeIn">
        <div className="w-32 h-32 bg-primary-600/10 rounded-full flex items-center justify-center text-6xl floating">👋</div>
        <div className="text-center">
          <h2 className="text-4xl font-extrabold font-display tracking-tight mb-2">Welcome, {user?.name}!</h2>
          <p className="text-gray-500 max-w-sm mx-auto">Your career journey starts with a complete profile. Let's get you ready for the best opportunities.</p>
        </div>
        <Link to="/student/profile" className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-purple text-white font-bold rounded-2xl shadow-xl shadow-primary-600/20 hover:scale-105 transition-all">
          Build Your Profile Now
        </Link>
      </div>
    );
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Generating AI Insights...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slideIn">
        <div>
          <h1 className="text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Dashboard <span className="text-primary-600">Overview</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Precision tracking for your placement success</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 text-xs font-bold text-gray-500">
            Last analyzed: Today, 2:15 PM
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto">
        
        {/* Readiness Core Card */}
        <div className="md:col-span-4 bg-slate-900 dark:bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group border border-white/10">
          <div className="mesh-bg opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary-200 mb-6">Placement Readiness</h3>
              <div className="flex items-center justify-center my-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="stroke-white/20" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="stroke-white transition-all duration-1000" strokeDasharray={`${readiness?.overallScore || 0}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black">{readiness?.overallScore || 0}%</span>
                    <span className="text-[10px] font-bold text-primary-200 uppercase">{readiness?.level}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-primary-100 mt-4 leading-relaxed">
               You're in the top <span className="text-white font-bold">15%</span> of applicants in your department.
            </p>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="md:col-span-8 glass-panel rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent-cyan/10 rounded-xl flex items-center justify-center text-2xl">💡</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Career Assistant</h3>
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Real-time Optimization Tips</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {readiness?.tips?.length > 0 ? readiness.tips.slice(0, 4).map((tip, i) => (
              <div key={i} className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 group hover:border-primary-600/30 transition-all duration-300">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mt-1.5 shrink-0 shadow-sm shadow-primary-600/50"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tip}</p>
                </div>
              </div>
            )) : <div className="col-span-2 py-10 text-center text-gray-400 font-medium italic">Scanning your latest activity for new highlights...</div>}
          </div>
        </div>

        {/* Job Matches Card */}
        <div className="md:col-span-7 glass-panel rounded-[2rem] p-8">
           <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Premium Matches</h3>
                <p className="text-xs text-gray-500 font-medium">Curated jobs for your skill set</p>
              </div>
              <Link to="/student/jobs" className="px-4 py-2 bg-gray-100/50 hover:bg-gray-100 text-primary-600 text-xs font-bold rounded-xl transition-all">Explore All</Link>
           </div>
           
           <div className="space-y-4">
             {recommendedJobs.length > 0 ? recommendedJobs.slice(0, 3).map((rec, i) => (
               <Link to="/student/jobs" key={i} className="flex justify-between items-center p-5 rounded-[1.5rem] bg-white/40 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group block">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:shadow-none transition-shadow">
                        🏢
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{rec.job?.title || "Unknown Position"}</h4>
                        <p className="text-sm text-gray-500">{rec.job?.company?.name || "Unknown Company"}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="px-4 py-1.5 bg-green-500/10 text-green-600 text-xs font-black rounded-full border border-green-500/20 tracking-tighter">
                        {rec.matchPercentage}% PERFECT MATCH
                     </span>
                  </div>
               </Link>
             )) : <p className="text-center py-10 text-gray-400 font-medium">Keep updating your profile to see tailored recommendations.</p>}
           </div>
        </div>

        {/* Skill Gap Heatmap styled box */}
        <div className="md:col-span-5 glass-panel rounded-[2rem] p-8 flex flex-col">
           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Competitive Gaps</h3>
           <div className="flex-1 space-y-4">
              {skillGap.length > 0 ? skillGap.slice(0, 3).map((gap, i) => (
                <div key={i} className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 border border-gray-100 dark:border-slate-800 overflow-hidden">
                   <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 -mr-10 -mt-10 rounded-full blur-2xl ${
                      gap.importance === 'High' ? 'bg-red-500' : 'bg-primary-600'
                   }`}></div>
                   <div className="relative z-10 flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white capitalize">{gap.skill}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{gap.importance} Priority Fix</p>
                      </div>
                      <span className="text-xs font-black text-primary-600 bg-primary-600/10 px-2 py-1 rounded-lg">PRO TIP</span>
                   </div>
                   <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-1">✨ {gap.suggestion}</p>
                   <p className="text-[11px] text-gray-400 leading-tight">{gap.demand}</p>
                </div>
              )) : <p className="text-center my-auto text-gray-400 font-medium">Your skill profile is exceptionally strong.</p>}
           </div>
        </div>

      </div>
    </div>
  );
}
