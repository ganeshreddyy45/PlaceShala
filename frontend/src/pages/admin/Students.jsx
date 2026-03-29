import { useState, useEffect } from 'react';
import { adminApi } from '../../api/services';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Registered Students</h1>
          <p className="text-gray-500">View and manage all student profiles</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl">
          <p className="text-gray-500">No students found matching your criteria</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Name</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Contact</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Academics</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Profile / Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 dark:text-white">{student.name}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {student.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{student.email}</div>
                      <div className="text-xs text-gray-500 mt-1">{student.phone || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium">{student.branch || 'N/A'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        CGPA: {student.cgpa || 'N/A'} | Batch: {student.passoutYear || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex items-center space-x-1" title="Profile Completeness">
                          <span className={`w-2 h-2 rounded-full ${student.profileCompleteness >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                          <span>{student.profileCompleteness || 0}%</span>
                        </div>
                        {student.resumeData && (
                          <a 
                            href={`/api/admin/student/${student.id}/resume`}
                            target="_blank" rel="noreferrer"
                            className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-medium hover:bg-indigo-100 transition"
                          >
                            DL Resume
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
