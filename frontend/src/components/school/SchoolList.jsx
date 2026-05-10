import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const SchoolList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit modal state
  const [editingSchool, setEditingSchool] = useState(null);
  const [editForm, setEditForm] = useState({ school_name: '', school_address: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const fetchSchools = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/schools/all');
      setSchools(res.data.data || []);
    } catch {
      setError('Failed to load schools.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchools(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this school?')) return;
    try {
      await api.delete(`/schools/${id}`);
      fetchSchools();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting school.');
    }
  };

  const openEdit = (school) => {
    setEditingSchool(school);
    setEditForm({ school_name: school.school_name, school_address: school.school_address });
    setEditError('');
    setEditSuccess('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    try {
      await api.put(`/schools/${editingSchool.school_id}`, editForm);
      setEditSuccess('School updated successfully!');
      fetchSchools();
      setTimeout(() => setEditingSchool(null), 1000);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Error updating school.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-slate-800 mb-4">All Schools</h3>

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && schools.length === 0 && (
        <p className="text-gray-400 text-sm">No schools found.</p>
      )}

      <div className="flex flex-col gap-3">
        {schools.map(school => (
          <div key={school.school_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <p className="font-semibold text-slate-800">{school.school_name}</p>
              <p className="text-sm text-gray-500">{school.school_address}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(school)}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(school.school_id)}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSchool && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Edit School</h4>

            {editSuccess && <p className="mb-3 text-sm text-green-600 font-medium">✓ {editSuccess}</p>}
            {editError && <p className="mb-3 text-sm text-red-600 font-medium">✕ {editError}</p>}

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">School Name</label>
                <input
                  type="text"
                  value={editForm.school_name}
                  onChange={e => setEditForm({ ...editForm, school_name: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.school_address}
                  onChange={e => setEditForm({ ...editForm, school_address: e.target.value })}
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
                  onClick={() => setEditingSchool(null)}
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

export default SchoolList;