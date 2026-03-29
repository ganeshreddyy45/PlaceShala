import { useState, useEffect } from 'react';
import { adminApi } from '../../api/services';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', industry: '', location: '', website: '', description: '' });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCompanies();
      setCompanies(data);
    } catch (err) {
      console.error("Admin companies fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCompany(formData);
      setIsModalOpen(false);
      setFormData({ name: '', industry: '', location: '', website: '', description: '' });
      fetchCompanies();
    } catch (err) {
      alert("Failed to create company");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Partners...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold font-display tracking-tight gradient-text">Corporate Network</h1>
          <p className="text-gray-500 font-medium">Monitoring and scaling platform partnerships</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-gray-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-primary-600 dark:hover:bg-primary-600 transition-all hover:scale-105 active:scale-95"
        >
          Onboard New Partner
        </button>
      </header>

      {companies.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-[3rem]">
          <div className="w-24 h-24 bg-primary-600/5 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 grayscale opacity-30">🏢</div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2">Network Empty</h2>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">Start by onboarding your first corporate partner to the platform.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map(company => (
            <div key={company.id} className="glass-panel p-8 rounded-[3rem] hover:scale-[1.02] transition-all duration-500 relative overflow-hidden flex flex-col group">
               <div className="mesh-bg opacity-0 group-hover:opacity-10 transition-opacity"></div>
               
               <div className="relative z-10 flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl flex items-center justify-center text-3xl shadow-inner group-hover:rotate-6 transition-transform">
                    {company.logo || '🏢'}
                  </div>
                  <span className="px-4 py-1.5 bg-primary-600/10 text-primary-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-primary-600/10">
                    {company.industry || 'Tech'}
                  </span>
               </div>

               <div className="relative z-10 flex-1">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{company.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-bold mb-6">
                     <span>📍 {company.location}</span>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-500 leading-relaxed line-clamp-3 mb-8">
                    {company.description || 'Verified enterprise partner actively participating in the placement ecosystem.'}
                  </p>
               </div>

               <div className="relative z-10 pt-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  {company.website && (
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-6 py-3 bg-white dark:bg-slate-800 text-primary-600 border border-primary-600/10 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600/5 transition-all"
                    >
                      Visit Workspace
                    </a>
                  )}
                  <button className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    ⚙️
                  </button>
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
               <h2 className="text-3xl font-black font-display tracking-tight text-gray-900 dark:text-white uppercase">Partner Onboarding</h2>
               <p className="text-gray-500 font-medium">Establishing a new corporate node in the network</p>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entity Branding</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Company Name" className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Industry Vertical</label>
                  <input type="text" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} placeholder="Software / Finance..." className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">HQ Location</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City, Country" className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Digital Anchor (URL)</label>
                <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://..." className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Partner Vision</label>
                <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Mission and values..." className="w-full px-5 py-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 focus:ring-4 focus:ring-primary-600/5 focus:border-primary-600 outline-none transition-all font-bold text-sm resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" className="px-10 py-4 bg-gray-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-primary-600 transition-all">Confirm Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
