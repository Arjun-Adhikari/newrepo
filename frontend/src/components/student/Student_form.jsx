import { useState, useEffect } from 'react';
import api from '../../api/api.js';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    class: '',
    school_id: '',
    subject_ids: [],
  });

  const [schools, setSchools] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('schools/all')
      .then((res) => setSchools(res.data.data || []))
      .catch(() => setError('Failed to load schools.'));

    api.get('subjects/all')
      .then((res) => setSubjects(res.data.data || []))
      .catch(() => setError('Failed to load subjects.'));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubjectToggle = (subjectId) => {
    setFormData(prev => {
      const already = prev.subject_ids.includes(subjectId);
      return {
        ...prev,
        subject_ids: already
          ? prev.subject_ids.filter(id => id !== subjectId)
          : [...prev.subject_ids, subjectId],
      };
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.subject_ids.length === 0) {
      setError('Please select at least one subject.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('students/add', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        address: formData.address,
        class: formData.class,
        school_id: parseInt(formData.school_id),
        subject_ids: formData.subject_ids,
      });

      setSuccess(response.data.message || 'Student added successfully!');
      setFormData({
        first_name: '',
        last_name: '',
        address: '',
        class: '',
        school_id: '',
        subject_ids: [],
      });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || 'Error adding student.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h3 className="text-2xl font-semibold text-slate-800 mb-2">Register New Student</h3>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
          ✓ {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          ✕ {error}
        </div>
      )}

      {/* First Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="e.g. Ram"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="e.g. Sharma"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g. Birendranagar, Surkhet"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Class */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Class</label>
        <input
          type="text"
          name="class"
          value={formData.class}
          onChange={handleChange}
          placeholder="e.g. Grade 5"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* School — dropdown fetched from API */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">School</label>
        <select
          name="school_id"
          value={formData.school_id}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="">-- Select a School --</option>
          {schools.map(school => (
            <option key={school.school_id} value={school.school_id}>
              {school.school_name}
            </option>
          ))}
        </select>
      </div>

      {/* Subjects — multi-select checkboxes fetched from API */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Subjects <span className="text-gray-400 font-normal">(select one or more)</span>
        </label>
        {subjects.length === 0 ? (
          <p className="text-sm text-gray-400">Loading subjects...</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {subjects.map(subject => {
              const checked = formData.subject_ids.includes(subject.subject_id);
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
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-md transition-colors"
      >
        {loading ? 'Saving...' : 'Save Student'}
      </button>
    </form>
  );
};

export default StudentForm;