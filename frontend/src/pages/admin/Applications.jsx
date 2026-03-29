import { useState, useEffect } from 'react';
import { adminApi } from '../../api/services';
import { useSearchParams } from 'react-router-dom';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const filterJobId = searchParams.get('jobId');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getApplications();
      // Filter by jobId if present in query string
      const filtered = filterJobId ? (data || []).filter(a => a.job?.id == filterJobId) : (data || []);
      // Sort: highest AI match score first
      const sorted = filtered.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
      setApplications(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminApi.updateApplicationStatus(id, status);
      // Update local state without refetching all
      setApplications(apps => apps.map(app => 
        app.id === id ? { ...app, status } : app
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    SHORTLISTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Applications Review</h1>
        <p className="text-gray-500">Review student applications and AI match scores</p>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl">
          <span className="text-4xl mb-4 block">📋</span>
          <p className="text-gray-500">No applications found</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <th className="p-4 font-semibold text-sm">Student</th>
                <th className="p-4 font-semibold text-sm">Job Role</th>
                <th className="p-4 font-semibold text-sm text-center">AI Match Score</th>
                <th className="p-4 font-semibold text-sm">Status</th>
                <th className="p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
              {applications.map((app) => (
                <tr key={app?.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-4">
                    <div className="font-bold text-gray-900 dark:text-white">{app.student?.name || 'Unknown Student'}</div>
                    <div className="flex space-x-2 mt-1">
                      <a href={`mailto:${app.student?.email}`} className="text-xs text-indigo-500 hover:underline">Email</a>
                      {app.student?.resumeData && (
                        <a href={`/api/admin/student/${app.student?.id}/resume`} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">Resume</a>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{app.job?.title || 'Unknown Job'}</div>
                    <div className="text-xs text-gray-500 mt-1">{app.job?.company?.name || 'Unknown Company'}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full relative flex items-center justify-center border-4" 
                           style={{ borderColor: (app.matchPercentage || 0) >= 80 ? '#10b981' : (app.matchPercentage || 0) >= 50 ? '#f59e0b' : '#ef4444' }}>
                        <span className="font-bold text-sm">{app.matchPercentage || 0}%</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">Intelligent Match</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColors[app.status] || 'bg-gray-100'}`}>
                      {app.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={app.status || 'PENDING'}
                      onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                      className="p-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-sm focus:ring-indigo-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHORTLISTED">Shortlist</option>
                      <option value="ACCEPTED">Select</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
