import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  registerStudent: (data) => api.post('/users/register', data).then(r => r.data),
  loginStudent: (data) => api.post('/users/login', data).then(r => r.data),
  registerAdmin: (data) => api.post('/admin/register', data).then(r => r.data),
  loginAdmin: (data) => api.post('/admin/login', data).then(r => r.data),
};

export const studentApi = {
  createProfile: (data) => api.post('/students/profile', data).then(r => r.data),
  getProfile: (id) => api.get(`/students/${id}`).then(r => r.data),
  getProfileByUserId: (userId) => api.get(`/students/user/${userId}`).then(r => r.data),
  updateProfile: (id, data) => api.put(`/students/update/${id}`, data).then(r => r.data),
  uploadResume: (studentId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/students/uploadResume?studentId=${studentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
  },
  getInterviews: (studentId) => api.get(`/students/interviews/${studentId}`).then(r => r.data),
  getResumeAnalysis: (studentId) => api.get(`/students/resume-analysis/${studentId}`).then(r => r.data),
  getRecommendedJobs: (studentId) => api.get(`/students/recommended-jobs/${studentId}`).then(r => r.data),
  getPlacementReadiness: (studentId) => api.get(`/students/placement-readiness/${studentId}`).then(r => r.data),
  getSkillGap: (studentId) => api.get(`/students/skill-gap/${studentId}`).then(r => r.data),
  getJobs: () => api.get('/jobs/all').then(r => r.data),
  searchJobsByTitle: (title) => api.get(`/jobs/search/title?title=${title}`).then(r => r.data),
  searchJobsBySkill: (skill) => api.get(`/jobs/search/skill?skill=${skill}`).then(r => r.data),
  applyForJob: (studentId, jobId) => api.post(`/applications/apply?studentId=${studentId}&jobId=${jobId}`).then(r => r.data),
  getApplications: (studentId) => api.get(`/applications/student/${studentId}`).then(r => r.data),
};

export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard').then(r => r.data),
  getStudents: () => api.get('/admin/students').then(r => r.data),
  getCompanies: () => api.get('/admin/companies').then(r => r.data),
  createCompany: (data) => api.post('/admin/company', data).then(r => r.data),
  getJobs: () => api.get('/admin/jobs').then(r => r.data),
  createJob: (data) => api.post('/admin/job', data).then(r => r.data),
  closeJob: (id) => api.put(`/admin/job/${id}/close`).then(r => r.data),
  getApplications: () => api.get('/admin/applications').then(r => r.data),
  updateApplicationStatus: (id, status) => api.put(`/admin/application/status?applicationId=${id}&status=${status}`).then(r => r.data),
  getTopCandidates: (jobId) => api.get(`/admin/job/${jobId}/top-candidates`).then(r => r.data),
  getInterviews: () => api.get('/admin/interviews').then(r => r.data),
  scheduleInterview: (data) => api.post('/admin/interview/schedule', data).then(r => r.data),
};

export const aiApi = {
  getInterviewQuestions: (jobId) => api.get(`/students/interview-questions/${jobId}`).then(r => r.data),
};
