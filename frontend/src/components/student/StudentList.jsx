import { useCallback, useEffect, useState } from 'react';
import api from '../../api/api';
import StudentContactQR from '../../StudentContactQR/StudentContactQR';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrStudent, setQrStudent] = useState(null);

  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: '', last_name: '', address: '', class: '', school_id: '', subject_ids: [],
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [stRes, sRes, subRes] = await Promise.all([
        api.get('students/all'),
        api.get('schools/all'),
        api.get('subjects/all'),
      ]);
      setStudents(stRes.data.data || []);
      setSchools(sRes.data.data || []);
      setSubjects(subRes.data.data || []);
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => void fetchAll());
  }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.delete(`students/${id}`);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting student.');
    }
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      first_name: student.first_name,
      last_name: student.last_name,
      address: student.address,
      class: student.class,
      school_id: student.school_id,
      subject_ids: (student.enrolledSubjects || []).map(s => s.subject_id),
    });
    setEditError('');
    setEditSuccess('');
  };

  const handleSubjectToggle = (subjectId) => {
    setEditForm(prev => {
      const already = prev.subject_ids.includes(subjectId);
      return {
        ...prev,
        subject_ids: already
          ? prev.subject_ids.filter(id => id !== subjectId)
          : [...prev.subject_ids, subjectId],
      };
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editForm.subject_ids.length === 0) {
      setEditError('Please select at least one subject.');
      return;
    }
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    try {
      await api.put(`students/${editingStudent.student_id}`, {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        address: editForm.address,
        class: editForm.class,
        school_id: parseInt(editForm.school_id),
        subject_ids: editForm.subject_ids,
      });
      setEditSuccess('Student updated successfully!');
      fetchAll();
      setTimeout(() => setEditingStudent(null), 1000);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Error updating student.');
    } finally {
      setEditLoading(false);
    }
  };

  const getSchoolName = (id) => schools.find(s => s.school_id === id)?.school_name || '—';

  return (
    <div>
      <h3 className="text-2xl font-semibold text-slate-800 mb-4">All Students</h3>

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && students.length === 0 && (
        <p className="text-gray-400 text-sm">No students found.</p>
      )}

      <div className="flex flex-col gap-3">
        {students.map(student => (
          <div key={student.student_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div>
              <p className="font-semibold text-slate-800">{student.first_name} {student.last_name}</p>
              <p className="text-sm text-gray-500">
                Class {student.class} · {getSchoolName(student.school_id)}
              </p>
              {student.enrolledSubjects?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {student.enrolledSubjects.map(s => (
                    <span key={s.subject_id} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {s.subject_name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 ml-4 shrink-0">

              <button
                onClick={() => setQrStudent(student)}
                className="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-medium transition-colors"
              >
                QR
              </button>


              <button
                onClick={() => openEdit(student)}
                className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(student.student_id)}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Edit Student</h4>

            {editSuccess && <p className="mb-3 text-sm text-green-600 font-medium">✓ {editSuccess}</p>}
            {editError && <p className="mb-3 text-sm text-red-600 font-medium">✕ {editError}</p>}

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={e => setEditForm({ ...editForm, first_name: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={e => setEditForm({ ...editForm, last_name: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Class</label>
                <input
                  type="text"
                  value={editForm.class}
                  onChange={e => setEditForm({ ...editForm, class: e.target.value })}
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subjects <span className="text-gray-400 font-normal">(select one or more)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map(subject => {
                    const checked = editForm.subject_ids.includes(subject.subject_id);
                    return (
                      <label
                        key={subject.subject_id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm
                          ${checked
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                            : 'border-gray-300 text-slate-600 hover:border-blue-300'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleSubjectToggle(subject.subject_id)}
                          className="accent-blue-600"
                        />
                        {subject.subject_name}
                      </label>
                    );
                  })}
                </div>
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
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qrStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setQrStudent(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold"
            >
              ✕
            </button>

            {/* Render the QR Component, passing the selected student */}
            <StudentContactQR student={qrStudent} />

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setQrStudent(null)}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;