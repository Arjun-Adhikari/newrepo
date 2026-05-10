import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const SchoolForm = () => {
  const [formData, setFormData] = useState({
    school_name: '',
    school_address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      const response = await axios.post(`${API_BASE}/schools/add`, formData);
      setSuccess(response.data.message || 'School added successfully!');
      setFormData({ school_name: '', school_address: '' });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || 'Error adding school.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h3 className="text-2xl font-semibold text-slate-800 mb-2">Register New School</h3>

      {/* Success message */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
          ✓ {success}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          ✕ {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">School Name</label>
        <input
          type="text"
          name="school_name"
          value={formData.school_name}
          onChange={handleChange}
          placeholder="e.g. Usha Bal Vatika"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
        <input
          type="text"
          name="school_address"
          value={formData.school_address}
          onChange={handleChange}
          placeholder="e.g. Birendranagar, Surkhet"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-md transition-colors"
      >
        {loading ? 'Saving...' : 'Save School'}
      </button>
    </form>
  );
};

export default SchoolForm;