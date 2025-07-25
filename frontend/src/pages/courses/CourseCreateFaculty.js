import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  title: "",
  code: "",
  description: "",
  category: "",
  credits: "",
  startDate: "",
  endDate: "",
  image: null,
};

function CourseCreateFaculty() {
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => navigate("/faculty/courses"), 1500);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
            <input
              type="number"
              name="credits"
              value={form.credits}
              onChange={handleChange}
              min={1}
              max={10}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 h-32 rounded shadow" />
          )}
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Course created successfully! Redirecting...</div>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}

export default CourseCreateFaculty; 