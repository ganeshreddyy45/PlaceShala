import { useState, useEffect } from 'react';
import { adminApi } from '../../api/services';
import { Link } from 'react-router-dom';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ 
    title: '', description: '', location: '', salary: '', 
    requiredSkills: '', type: 'FULL_TIME', companyId: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsData, companiesData] = await Promise.all([
        adminApi.getJobs(),
        adminApi.getCompanies()
      ]);
      setJobs(jobsData);
      setCompanies(companiesData);
      if (companiesData.length > 0) {
        setFormData(prev => ({ ...prev, companyId: companiesData[0].id }));
      }
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createJob(formData);
      setIsModalOpen(false);
      setFormData({ 
        title: '', description: '', location: '', salary: '', 
        requiredSkills: '', type: 'FULL_TIME', companyId: companies.length > 0 ? companies[0].id : '' 
      });
      fetchData();
    } catch (err) {
      alert("Failed to post job");
    }
  };

  const handleCloseJob = async (id) => {
    if (window.confirm("Are you sure you want to close this job listing?")) {
      try {
        await adminApi.closeJob(id);
        fetchData();
      } catch (err) {
        alert("Failed to close job");
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Scanning Positions...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold font-display tracking-tight gradient-text">Inventory Control</h1>
          <p className="text-gray-500 font-medium">Managing active roles and corporate fulfillment</p>
        </div>
        <button 
          onClick={() => {
            if (companies.length === 0) {
              alert("Please add a company first.");
              return;
            }
            setIsModalOpen(true);
          }}
          className="px-8 py-4 bg-gray-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-primary-600 dark:hover:bg-primary-600 transition-all hover:scale-105 active:scale-95"
        >
          Deploy New Position
        </button>
      </header>

      {jobs.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-[3rem]">
          <div className="w-24 h-24 bg-primary-600/5 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 grayscale opacity-30">💼</div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2">Inventory Empty</h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">Start by deploying your first job listing to the platform.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job.id} className={`glass-panel p-8 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl relative overflow-hidden flex flex-col justify-between group ${job.status !== 'OPEN' ? 'opacity-60 grayscale' : ''}`}>
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:rotate-3 transition-transform">
                      {job.company?.logo || '🏢'}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${job.status === 'OPEN' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-red-500/10 border-red-500/20 text-red-600'}`}>
                        {job.status}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                        {job.type?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">{job.title}</h3>
                  <p className="text-sm font-bold text-gray-400 mb-6">{job.company?.name || 'Unknown Company'}</p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="px-3 py-1 bg-gray-50 dark:bg-slate-800/50 text-gray-500 rounded-lg text-[10px] font-bold border border-gray-100 dark:border-slate-800">📍 {job.location || 'N/A'}</span>
                    <span className="px-3 py-1 bg-green-500/5 text-green-600 rounded-lg text-[10px] font-bold border border-green-500/10">💰 ₹{job.salary?.toLocaleString() || 0}</span>
                  </div>
               </div>

               <div className="relative z-10 pt-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <Link 
                    to={`/admin/applications?jobId=${job.id}`}
                    className="flex-1 py-3 bg-white dark:bg-slate-800 text-primary-600 border border-primary-600/10 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600/5 transition-all text-center"
                  >
                    Applications
                  </Link>
                  {job.status === 'OPEN' && (
                    <button 
                      onClick={() => handleCloseJob(job.id)}
                      className="px-4 py-3 bg-red-500/10 text-red-600 border border-red-500/10 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      Close
                    </button>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="glass-panel w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh] relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors text-2xl">✕</button>
            
            <header className="mb-10">
               <h2 className="text-3xl font-black font-display tracking-tight text-gray-900 dark:text-white">Position Deployment</h2>
               <p className="text-gray-500 font-medium">Define parameters for a new platform opportunity</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entity / Partner</label>
                  <select required value={formData.companyId} onChange={e => setFormData({...formData, companyId: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm">
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Job Designation</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Lead Engineer..." className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Node Location</label>
                  <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Remote / Bengaluru..." className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contract Vector</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm">
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Remuneration (Annual INR)</label>
                <input type="number" required value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stack Prerequisites</label>
                <input type="text" required value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})} placeholder="React, Node.js, AWS..." className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Used for AI semantic matching and profile indexing.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Brief</label>
                <textarea rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm resize-none"></textarea>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Abort</button>
                <button type="submit" className="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-gray-900 text-white shadow-xl shadow-gray-900/20 hover:bg-primary-600 transition-all active:scale-95">Commit Deployment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
