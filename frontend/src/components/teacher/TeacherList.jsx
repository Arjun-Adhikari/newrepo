import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editForm, setEditForm] = useState({ teacher_name: '', school_id: '', subject_id: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [tRes, sRes, subRes] = await Promise.all([
        api.get('/teachers/all'),
        api.get('/schools/all'),
        api.get('/subjects/all'),
      ]);
      setTeachers(tRes.data.data || []);
      setSchools(sRes.data.data || []);
      setSubjects(subRes.data.data || []);
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    try {
      await api.delete(`/teachers/${id}`);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting teacher.');
    }
  };

  const openEdit = (teacher) => {
    setEditingTeacher(teacher);
    setEditForm({
      teacher_name: teacher.teacher_name,
      school_id: teacher.school_id,
      subject_id: teacher.subject_id,
    });
    setEditError('');
    setEditSuccess('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    try {
      await api.put(`/teachers/${editingTeacher.teacher_id}`, {
        teacher_name: editForm.teacher_name,
        school_id: parseInt(editForm.school_id),
        subject_id: parseInt(editForm.subject_id),
      });
      setEditSuccess('Teacher updated successfully!');
      fetchAll();
      setTimeout(() => setEditingTeacher(null), 1000);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Error updating teacher.');
    } finally {
      setEditLoading(false);
    }
  };

  const getSchoolName = (id) => schools.find(s => s.school_id === id)?.school_name || '—';
  const getSubjectName = (id) => subjects.find(s => s.subject_id === id)?.subject_name || '—';

  return (
    <div>
      <h3 className="text-2xl font-semibold text-slate-800 mb-4">All Teachers</h3>

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && teachers.length === 0 && (
        <p className="text-gray-400 text-sm">No teachers found.</p>
      )}

      <div className="flex flex-col gap-3">
        {teachers.map(teacher => (
          <div key={teacher.teacher_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <p className="font-semibold text-slate-800">{teacher.teacher_name}</p>
              <p className="text-sm text-gray-500">
                {getSchoolName(teacher.school_id)} · {getSubjectName(teacher.subject_id)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(teacher)}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(teacher.teacher_id)}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTeacher && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Edit Teacher</h4>

            {editSuccess && <p className="mb-3 text-sm text-green-600 font-medium">✓ {editSuccess}</p>}
            {editError && <p className="mb-3 text-sm text-red-600 font-medium">✕ {editError}</p>}

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Teacher Name</label>
                <input
                  type="text"
                  value={editForm.teacher_name}
                  onChange={e => setEditForm({ ...editForm, teacher_name: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">School</label>
                <select
                  value={editForm.school_id}
                  onChange={e => setEditForm({ ...editForm, school_id: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">-- Select School --</option>
                  {schools.map(s => (
                    <option key={s.school_id} value={s.school_id}>{s.school_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={editForm.subject_id}
                  onChange={e => setEditForm({ ...editForm, subject_id: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => (
                    <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition-colors"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherList;