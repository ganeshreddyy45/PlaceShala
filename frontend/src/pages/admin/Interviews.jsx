import { useState, useEffect } from 'react';
import { adminApi } from '../../api/services';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ 
    applicationId: '', scheduledAt: '', meetingLink: '', 
    venue: '', interviewType: 'TECHNICAL_ROUND', notes: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [interviewsData, appsData] = await Promise.all([
        adminApi.getInterviews(),
        adminApi.getApplications()
      ]);
      setInterviews(interviewsData.sort((a,b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)));
      
      // Only show shortlisted/pending applications for scheduling
      const eligibleApps = appsData.filter(a => a.status !== 'REJECTED');
      setApplications(eligibleApps);
      
      if (eligibleApps.length > 0) {
        setFormData(prev => ({ ...prev, applicationId: eligibleApps[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedApp = applications.find(a => a.id === parseInt(formData.applicationId));
      if (!selectedApp) { alert("Invalid application selected"); return; }

      await adminApi.scheduleInterview({
        studentId: selectedApp.student.id,
        jobId: selectedApp.job.id,
        scheduledAt: formData.scheduledAt.length === 16 ? formData.scheduledAt + ':00' : formData.scheduledAt,
        meetingLink: formData.meetingLink,
        venue: formData.venue,
        interviewType: formData.interviewType,
        notes: formData.notes
      });
      setIsModalOpen(false);
      setFormData({ 
        applicationId: applications.length > 0 ? applications[0].id : '', 
        scheduledAt: '', meetingLink: '', venue: '', 
        interviewType: 'TECHNICAL_ROUND', notes: '' 
      });
      fetchData();
    } catch (err) {
      alert("Failed to schedule interview");
    }
  };

  const formatDateForInput = (dateObj) => {
    if (!dateObj) return '';
    const d = new Date(dateObj);
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Interviews</h1>
          <p className="text-gray-500">Schedule and track candidate interviews</p>
        </div>
        <button 
          onClick={() => {
            if (applications.length === 0) {
              alert("No eligible applications found. Please shortlist candidates first.");
              return;
            }
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-md font-medium hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <span>🗓️</span> Schedule
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading schedules...</div>
      ) : interviews.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl">
          <span className="text-4xl mb-4 block">🗓️</span>
          <p className="text-gray-500">No interviews scheduled yet</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                  <th className="p-4 font-semibold text-sm">Date & Time</th>
                  <th className="p-4 font-semibold text-sm">Candidate & Role</th>
                  <th className="p-4 font-semibold text-sm">Round</th>
                  <th className="p-4 font-semibold text-sm">Platform / Venue</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                {interviews.map((schedule) => (
                  <tr key={schedule?.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {schedule.scheduledAt ? new Date(schedule.scheduledAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-sm text-indigo-600 font-medium">
                        {schedule.scheduledAt ? new Date(schedule.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) : ''}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{schedule.student?.name || 'Unknown Candidate'}</div>
                      <div className="text-sm text-gray-500 mt-1">{schedule.job?.title || 'Unknown Role'} at {schedule.job?.company?.name || 'Unknown Company'}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-xs font-medium uppercase">
                        {schedule.interviewType?.replace('_', ' ') || 'INTERVIEW'}
                      </span>
                    </td>
                    <td className="p-4 text-sm max-w-xs truncate">
                      {schedule.meetingLink ? (
                        <a href={schedule.meetingLink} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">Video Link</a>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">{schedule.venue || 'TBD'}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${schedule.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {schedule.status || 'SCHEDULED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Schedule Interview</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Candidate Application *</label>
                <select required value={formData.applicationId} onChange={e => setFormData({...formData, applicationId: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500">
                  {applications.map(app => (
                    <option key={app?.id} value={app?.id}>
                      {app.student?.name || 'Unknown Specialist'} - {app.job?.title || 'Role'} ({app.matchPercentage || 0}% Match)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date & Time *</label>
                  <input type="datetime-local" required value={formData.scheduledAt} onChange={e => setFormData({...formData, scheduledAt: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Interview Type</label>
                  <select value={formData.interviewType} onChange={e => setFormData({...formData, interviewType: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500">
                    <option value="HR_ROUND">HR Round</option>
                    <option value="TECHNICAL_ROUND">Technical Round</option>
                    <option value="MANAGERIAL_ROUND">Managerial</option>
                    <option value="FINAL_ROUND">Final Round</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Virtual Meeting Link</label>
                <input type="url" value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} placeholder="https://meet.google.com/..." className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Or Physical Venue</label>
                <input type="text" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} placeholder="Room 101, Main Office..." className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instructions / Notes (visible to student)</label>
                <textarea rows="2" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t dark:border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
