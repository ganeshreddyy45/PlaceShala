import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/services';

export default function Register() {
  const [isStudent, setIsStudent] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  import axios from "axios";

  const handleRegister = async (formData) => {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isStudent) {
        await authApi.registerStudent(formData);
      } else {
        await authApi.registerAdmin(formData);
      }
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Join Network</h2>
        <p className="text-slate-500 font-medium">Create your credentials to begin</p>
      </div>

      {/* Role Toggle: Modern & Minimal */}
      <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl mb-8 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsStudent(true)}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${isStudent ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-xl' : 'text-slate-400'
            }`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setIsStudent(false)}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${!isStudent ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-xl' : 'text-slate-400'
            }`}
        >
          Administrator
        </button>
      </div>

      {error && <div className="bg-red-500/10 text-red-600 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl mb-6 border border-red-500/20 animate-shake">{error}</div>}
      {success && <div className="bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl mb-6 border border-green-500/20 animate-pulse">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Identity Name</label>
          <input
            type="text"
            required
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Email Endpoint</label>
          <input
            type="email"
            required
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all placeholder:text-slate-300"
            placeholder="rahul@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Security Secret</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary-600/10 focus:border-primary-600 outline-none transition-all placeholder:text-slate-300"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-5 bg-slate-900 dark:bg-primary-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl hover:shadow-primary-600/40 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 mt-6 group btn-premium"
        >
          <span className="flex items-center justify-center gap-3 relative z-10">
            {loading ? 'Processing...' : 'Secure Access'}
            {!loading && <span className="text-xl transition-transform group-hover:translate-x-2">→</span>}
          </span>
        </button>
      </form>

      <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
        Active account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-500 transition-colors border-b border-primary-600/0 hover:border-primary-600 pb-0.5">
          Sign In
        </Link>
      </p>
    </div>
  );
}
