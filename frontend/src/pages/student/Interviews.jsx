import { useState, useEffect } from 'react';
import { studentApi, aiApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Interviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQA, setLoadingQA] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?.profileId) {
        setLoading(false);
        return;
      }
      try {
        const data = await studentApi.getInterviews(user.profileId);
        setInterviews(data);
      } catch (err) {
        console.error("Interviews fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [user]);

  const generatePrepQuestions = async (jobId) => {
    if (selectedJob === jobId) {
      setSelectedJob(null);
      return;
    }
    setLoadingQA(true);
    setSelectedJob(jobId);
    try {
      const data = await aiApi.getInterviewQuestions(jobId);
      setQuestions(data);
    } catch (err) {
      console.error("AI QA error:", err);
    } finally {
      setLoadingQA(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-primary-600 text-white shadow-lg shadow-primary-600/20';
      case 'COMPLETED': return 'bg-green-500/10 border-green-500/20 text-green-600';
      case 'CANCELLED': return 'bg-red-500/10 border-red-500/20 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose">Opening the Stage...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold font-display tracking-tight gradient-text">Interview Hub</h1>
          <p className="text-gray-500 font-medium">Precision preparation for your career milestones</p>
        </div>
      </header>

      {interviews.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {interviews.map((interview) => (
            <div key={interview.id} className="flex flex-col">
              <div className="glass-panel group p-8 rounded-[3rem] hover:scale-[1.02] transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full">
                <div className="mesh-bg opacity-0 group-hover:opacity-10 transition-opacity"></div>
                
                <div className="relative z-10 flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-accent-purple rounded-3xl flex flex-col items-center justify-center text-white shadow-xl group-hover:rotate-3 transition-transform">
                          <span className="text-[10px] font-black uppercase tracking-tighter">{new Date(interview.interviewDate).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-2xl font-black">{new Date(interview.interviewDate).getDate()}</span>
                      </div>
                      <div>
                          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{interview.application.job.title}</h3>
                          <p className="text-sm font-bold text-gray-400">{interview.application.job.company.name}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(interview.status)}`}>
                      {interview.status}
                    </span>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Timezone / Slot</p>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {new Date(interview.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Interaction</p>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">{interview.interviewType.toLowerCase()}</p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-3">
                  <button 
                    onClick={() => generatePrepQuestions(interview.application.job.id)}
                    className="flex-1 py-4 bg-gradient-to-r from-gray-900 to-slate-800 dark:from-slate-700 dark:to-slate-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group-hover:from-primary-600 group-hover:to-primary-700"
                  >
                    <span>✨</span> AI Prep Partner
                  </button>
                  {interview.meetingLink && (
                    <a 
                      href={interview.meetingLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-6 py-4 bg-white dark:bg-slate-800 text-primary-600 border border-primary-600/20 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-600/5 transition-all text-center"
                    >
                      Join
                    </a>
                  )}
                </div>
              </div>

              {/* AI Question Section */}
              {selectedJob === interview.application.job.id && (
                <div className="mt-4 glass-panel p-8 rounded-[2.5rem] animate-slideIn relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-primary-600"></div>
                   <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                     <span className="w-8 h-8 bg-primary-600/10 rounded-lg flex items-center justify-center text-primary-600 text-xs">🧠</span>
                     Custom Preparation Deck
                   </h4>
                   
                   {loadingQA ? (
                     <div className="py-10 flex flex-col items-center">
                        <div className="w-6 h-6 border-2 border-primary-600/20 border-t-primary-600 rounded-full animate-spin mb-3"></div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generating questions...</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {questions.length > 0 ? questions.map((q, i) => (
                         <div key={i} className="p-5 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-primary-600/20 transition-all">
                            <div className="flex justify-between items-start mb-2">
                               <span className="text-[10px] font-black text-primary-600 uppercase">Expert Prompt 0{i+1}</span>
                               <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  q.difficulty === 'Easy' ? 'bg-green-100 text-green-600' : 
                                  q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                               }`}>{q.difficulty}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed mb-2">{q.question}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Focus: <span className="text-gray-600 dark:text-gray-300">{q.category}</span></p>
                         </div>
                       )) : <p className="text-center text-gray-400 italic text-sm py-4">AI model is warming up. Please try again.</p>}
                     </div>
                   )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass-panel rounded-[3rem]">
          <div className="w-24 h-24 bg-accent-cyan/5 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 floating">🎤</div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2">Stage Clear</h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">No interview rounds scheduled yet. Your dashboard will alert you as soon as a company shortlists your profile.</p>
        </div>
      )}
    </div>
  );
}
