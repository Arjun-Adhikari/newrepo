import { useCallback, useEffect, useState } from 'react';
import api from '../../api/api';

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingSubject, setEditingSubject] = useState(null);
  const [editForm, setEditForm] = useState({ subject_name: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('subjects/all');
      setSubjects(res.data.data || []);
    } catch {
      setError('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => void fetchSubjects());
  }, [fetchSubjects]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await api.delete(`subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting subject.');
    }
  };

  const openEdit = (subject) => {
    setEditingSubject(subject);
    setEditForm({ subject_name: subject.subject_name });
    setEditError('');
    setEditSuccess('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    try {
      await api.put(`subjects/${editingSubject.subject_id}`, editForm);
      setEditSuccess('Subject updated successfully!');
      fetchSubjects();
      setTimeout(() => setEditingSubject(null), 1000);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Error updating subject.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-slate-800 mb-4">All Subjects</h3>

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && subjects.length === 0 && (
        <p className="text-gray-400 text-sm">No subjects found.</p>
      )}

      <div className="flex flex-col gap-3">
        {subjects.map(subject => (
          <div key={subject.subject_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="font-semibold text-slate-800">{subject.subject_name}</p>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(subject)}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(subject.subject_id)}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingSubject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Edit Subject</h4>

            {editSuccess && <p className="mb-3 text-sm text-green-600 font-medium">✓ {editSuccess}</p>}
            {editError && <p className="mb-3 text-sm text-red-600 font-medium">✕ {editError}</p>}

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={editForm.subject_name}
                  onChange={e => setEditForm({ subject_name: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
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
                  onClick={() => setEditingSubject(null)}
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

export default SubjectList;