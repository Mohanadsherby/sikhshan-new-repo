import React, { useState } from "react";

const mockFiles = [
  {
    id: 1,
    name: "Course Syllabus.pdf",
    type: "PDF",
    uploadDate: "2024-01-15",
    url: "#",
  },
  {
    id: 2,
    name: "Week 1 Lecture Notes.pdf",
    type: "PDF",
    uploadDate: "2024-01-20",
    url: "#",
  },
  {
    id: 3,
    name: "Sample Diagram.png",
    type: "Image",
    uploadDate: "2024-01-22",
    url: "#",
  },
];

function CourseAttachmentsFaculty() {
  const [files, setFiles] = useState(mockFiles);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setTimeout(() => {
      setFiles((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: file.name,
          type: file.type.includes("pdf") ? "PDF" : file.type.includes("image") ? "Image" : "Other",
          uploadDate: new Date().toISOString().slice(0, 10),
          url: "#",
        },
      ]);
      setUploading(false);
    }, 1000);
  };

  const handleRemove = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Course Attachments & Notes</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="border rounded px-3 py-2 w-full"
        />
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Files</h2>
        {files.length === 0 ? (
          <div className="text-gray-500">No files uploaded yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {files.map((file) => (
              <li key={file.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">{file.name}</span>
                  <span className="ml-2 text-xs text-gray-500">({file.type})</span>
                  <span className="ml-4 text-xs text-gray-400">Uploaded: {file.uploadDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleRemove(file.id)}
                    className="text-red-500 hover:text-red-700 text-sm ml-2"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CourseAttachmentsFaculty; 