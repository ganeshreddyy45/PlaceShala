import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../api/services';

export default function Profile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [tempSkills, setTempSkills] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    branch: '',
    college: '',
    cgpa: '',
    passoutYear: '',
    skills: '',
    bio: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.profileId) {
        setLoading(false);
        return;
      }
      try {
        const [profData, aiData] = await Promise.all([
          studentApi.getProfile(user.profileId),
          studentApi.getResumeAnalysis(user.profileId)
        ]);
        setProfile(profData);
        setAnalysis(aiData);
        setFormData({
          name: profData.name || '',
          phone: profData.phone || '',
          branch: profData.branch || '',
          college: profData.college || '',
          cgpa: profData.cgpa || '',
          passoutYear: profData.passoutYear || '',
          skills: profData.skills || '',
          bio: profData.bio || ''
        });
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      let saved;
      if (profile?.id) {
        saved = await studentApi.updateProfile(profile.id, formData);
        setMessage({ type: 'success', text: 'Professional profile synchronized successfully!' });
      } else {
        saved = await studentApi.createProfile({ ...formData, userId: user.id, email: user.email });
        login({ ...user, profileId: saved.id });
        setMessage({ type: 'success', text: 'Identity created! Welcome to the talent pool.' });
      }
      setProfile(saved);
      // Refresh AI analysis on save
      const aiData = await studentApi.getResumeAnalysis(saved.id);
      setAnalysis(aiData);
    } catch (err) {
      setMessage({ type: 'error', text: 'Sync failed. Please check your connection.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user.profileId) return;
    
    setMessage({ type: 'info', text: 'AI is analyzing your resume metrics...' });
    try {
      const saved = await studentApi.uploadResume(user.profileId, file);
      setProfile(saved);
      const aiData = await studentApi.getResumeAnalysis(user.profileId);
      setAnalysis(aiData);
      setMessage({ type: 'success', text: 'Resume optimized and analyzed!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Upload failed. Only PDF/DOCX allowed.' });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose">Loading Talent Data...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fadeIn">
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-extrabold font-display tracking-tight gradient-text mb-2">Talent Profile</h1>
        <p className="text-gray-500 font-medium">Elevating your professional presence with AI</p>
      </header>

      {message.text && (
        <div className={`p-5 rounded-[1.5rem] mb-10 flex items-center gap-4 animate-slideIn border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 
          message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600' : 
          'bg-primary-600/10 border-primary-600/20 text-primary-600'
        }`}>
          <span className="text-2xl">{message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'}</span>
          <p className="font-bold text-sm tracking-wide uppercase">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: AI & Assets */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AI Score Card */}
          {analysis && (
            <div className="bg-primary-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl group">
               <div className="mesh-bg opacity-30 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm shadow-inner">✨</span>
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary-200">AI Resume Insights</h3>
                  </div>
                  <div className="text-center mb-6">
                    <div className="text-7xl font-black mb-2 leading-none group-hover:scale-110 transition-transform duration-500">{analysis.score}</div>
                    <div className="text-[10px] font-bold text-primary-200 uppercase tracking-widest">Global Readiness Benchmark</div>
                  </div>
                  <div className="space-y-4 mb-6">
                     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-cyan transition-all duration-1000 ease-out" style={{ width: `${analysis.score}%` }}></div>
                     </div>
                     <p className="text-xs text-primary-100 font-medium italic">"{analysis.suggestions?.[0] || 'Keep optimizing to hit 90+'}"</p>
                  </div>
                  
                  {analysis.missingSkills?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-200 mb-3 block">Skill Recommendations</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingSkills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-red-400/20 border border-red-400/30 rounded-lg text-[9px] font-bold text-white uppercase">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.extractedSkills?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-200 mb-3 block">Verified Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.extractedSkills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-400/20 border border-green-400/30 rounded-lg text-[9px] font-bold text-white uppercase">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Resume Upload Card */}
          <div className="glass-panel p-8 rounded-[2.5rem] text-center">
            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Document Hub</h3>
            {profile?.resumeFileName ? (
              <div className="mb-6 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800 animate-fadeIn">
                <div className="w-14 h-14 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">📄</div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate px-2">{profile.resumeFileName}</p>
                <a href={`/api/students/downloadResume/${profile.id}`} target="_blank" rel="noreferrer" className="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest mt-2 block">Download Copy</a>
              </div>
            ) : (
              <div className="mb-6 py-12 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center">
                <span className="text-4xl opacity-20 mb-2">📤</span>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Empty Workspace</p>
              </div>
            )}
            
            <label className="block w-full py-4 bg-gray-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-lg active:scale-95">
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
              {profile?.resumeFileName ? 'Replace Document' : 'Upload Resume PDf'}
            </label>
            <p className="text-[10px] text-gray-400 mt-4">AI analysis updates instantly on upload</p>
          </div>
        </div>

        {/* Right Column: Information Forms */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section: Core Information */}
          <div className="glass-panel p-8 md:p-12 rounded-[3rem]">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-600 text-xl font-bold">👤</div>
               <div>
                  <h3 className="text-2xl font-black font-display tracking-tight text-gray-900 dark:text-white">Personal Blueprint</h3>
                  <p className="text-sm text-gray-500">Your core contact and identification data</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/30 font-bold focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alexander Pierce"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Contact</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/30 font-bold focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional Bio</label>
                <textarea
                  className="w-full px-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/30 font-medium text-sm leading-relaxed focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all min-h-[120px]"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Elevate your profile with a powerful summary of your skills and ambitions..."
                />
              </div>
            </div>
          </div>

          {/* Section: Academic & Skills */}
          <div className="glass-panel p-8 md:p-12 rounded-[3rem]">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-accent-cyan/10 rounded-2xl flex items-center justify-center text-accent-cyan text-xl font-bold">🎓</div>
               <div>
                  <h3 className="text-2xl font-black font-display tracking-tight text-gray-900 dark:text-white">Academic Ledger</h3>
                  <p className="text-sm text-gray-500">Qualification and technical skill metrics</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Institute Name</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/30 font-bold focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. MIT"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Academic Branch</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/30 font-bold focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/30 font-bold focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                />
              </div>
               <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Passout Year</label>
                <input
                  type="number"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-800/30 font-bold focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all"
                  value={formData.passoutYear}
                  onChange={(e) => setFormData({ ...formData, passoutYear: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Technical Stack (Comma Separated)</label>
              <input
                type="text"
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-primary-600/5 dark:bg-slate-800/30 font-bold text-primary-600 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all"
                placeholder="React, AWS, Node.js, Python..."
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
              <p className="text-[10px] text-gray-400 ml-1">AI uses these tags to calculate your <span className="font-bold text-gray-500">Perfect Match</span> score for jobs.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-6 bg-gradient-to-r from-primary-600 to-accent-purple text-white font-black uppercase tracking-widest rounded-[2.5rem] shadow-2xl shadow-primary-600/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 group overflow-hidden relative"
          >
             <div className="shimmer opacity-30"></div>
             <span className="relative z-10 flex items-center justify-center gap-3">
               {saving ? 'Syncing Profile Nexus...' : (profile ? 'Commit Changes & Modernize' : 'Initialize Talent Profile')}
               <span className="text-2xl">→</span>
             </span>
          </button>
        </div>
      </form>
    </div>
  );
}
