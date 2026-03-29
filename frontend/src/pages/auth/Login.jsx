import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/services';

export default function Login() {
  const [isStudent, setIsStudent] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let data;
      if (isStudent) {
        data = await authApi.loginStudent(formData);
        login(data);
        navigate('/student/dashboard');
      } else {
        data = await authApi.loginAdmin(formData);
        login(data);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Access Portal</h2>
        <p className="text-slate-500 font-medium">Continue your career acceleration</p>
      </div>
      
      {/* Role Toggle: Modern & Minimal */}
      <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl mb-8 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsStudent(true)}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
            isStudent ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-xl' : 'text-slate-400'
          }`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setIsStudent(false)}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
            !isStudent ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-xl' : 'text-slate-400'
          }`}
        >
          Administrator
        </button>
      </div>

      {error && <div className="bg-red-500/10 text-red-600 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl mb-6 border border-red-500/20 animate-shake">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Email Identifier</label>
          <input
            type="email"
            required
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. rahul@placeshala.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Secret Key</label>
            <a href="#" className="text-[10px] font-black text-primary-600 hover:tracking-widest transition-all">RECOVER</a>
          </div>
          <input
            type="password"
            required
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all placeholder:text-slate-300"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-slate-900 dark:bg-primary-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl hover:shadow-primary-600/40 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 mt-6 group btn-premium"
        >
          <span className="flex items-center justify-center gap-3 relative z-10">
            {loading ? 'Validating...' : 'Initialize Session'}
            {!loading && <span className="text-xl transition-transform group-hover:translate-x-2">→</span>}
          </span>
        </button>
      </form>

      <p className="mt-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
        First time here?{' '}
        <Link to="/register" className="text-primary-600 hover:text-primary-500 transition-colors border-b border-primary-600/0 hover:border-primary-600 pb-0.5">
          Establish Account
        </Link>
      </p>
    </div>
  );
}
