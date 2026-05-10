import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const TeacherForm = () => {
  const [formData, setFormData] = useState({
    teacher_name: '',
    subject_id: '',
    school_id: '',
  });

  const [schools, setSchools] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/schools/all`)
      .then(res => setSchools(res.data.data || []))
      .catch(() => setError('Failed to load schools.'));

    axios.get(`${API_BASE}/subjects/all`)
      .then(res => setSubjects(res.data.data || []))
      .catch(() => setError('Failed to load subjects.'));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE}/teachers/add`, {
        teacher_name: formData.teacher_name,
        subject_id: parseInt(formData.subject_id),
        school_id: parseInt(formData.school_id),
      });

      setSuccess(response.data.message || 'Teacher added successfully!');
      setFormData({ teacher_name: '', subject_id: '', school_id: '' });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || 'Error adding teacher.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h3 className="text-2xl font-semibold text-slate-800 mb-2">Register New Teacher</h3>

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

      {/* Teacher Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Teacher Name</label>
        <input
          type="text"
          name="teacher_name"
          value={formData.teacher_name}
          onChange={handleChange}
          placeholder="e.g. Sita Thapa"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* School dropdown */}
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

      {/* Subject dropdown */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
        <select
          name="subject_id"
          value={formData.subject_id}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="">-- Select a Subject --</option>
          {subjects.map(subject => (
            <option key={subject.subject_id} value={subject.subject_id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-md transition-colors"
      >
        {loading ? 'Saving...' : 'Save Teacher'}
      </button>
    </form>
  );
};

export default TeacherForm;