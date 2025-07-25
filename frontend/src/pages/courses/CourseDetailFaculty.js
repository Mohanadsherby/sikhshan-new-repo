import React, { useState } from "react";
import { Link } from "react-router-dom";

const mockStudents = [
  { name: "Student A", email: "studenta@example.com" },
  { name: "Student B", email: "studentb@example.com" },
  { name: "Student C", email: "studentc@example.com" },
];

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function CourseDetailFaculty() {
  // Chapter state: [{ name: string, files: [{ name, file }] }]
  const [chapters, setChapters] = useState([
    { name: "Chapter 1: Introduction", files: [{ name: "Syllabus.pdf" }] },
    { name: "Chapter 2: Basics", files: [{ name: "Lecture1.pdf" }] },
  ]);
  const [newChapterName, setNewChapterName] = useState("");
  const [chapterFiles, setChapterFiles] = useState([]);

  // Add a new chapter with files
  const handleAddChapter = (e) => {
    e.preventDefault();
    if (!newChapterName.trim() || chapterFiles.length === 0) return;
    setChapters([
      ...chapters,
      {
        name: newChapterName.trim(),
        files: Array.from(chapterFiles).map((file) => ({ name: file.name })),
      },
    ]);
    setNewChapterName("");
    setChapterFiles([]);
  };

  // Remove a chapter
  const handleRemoveChapter = (idx) => {
    setChapters(chapters.filter((_, i) => i !== idx));
  };

  // Remove a file from a chapter
  const handleRemoveFile = (chapterIdx, fileIdx) => {
    setChapters(
      chapters.map((ch, i) =>
        i === chapterIdx
          ? { ...ch, files: ch.files.filter((_, j) => j !== fileIdx) }
          : ch
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Course</h1>
        <Link
          to="/faculty/courses"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Back to List
        </Link>
      </div>
      <div className="border-b border-gray-200 mb-6"></div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-primary">Course Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div><span className="font-medium">Title:</span> Introduction to Computer Science</div>
          <div><span className="font-medium">Code:</span> CS101</div>
          <div><span className="font-medium">Credits:</span> 3</div>
          <div><span className="font-medium">Category:</span> Computer Science</div>
          <div><span className="font-medium">Dates:</span> 2024-08-01 to 2024-12-15</div>
        </div>
      </section>
      <div className="border-b border-gray-200 mb-8"></div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-primary">Enrolled Students</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockStudents.map((student, idx) => (
                <tr key={student.email}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">
                      {getInitials(student.name)}
                    </span>
                    <span className="text-gray-900 font-medium">{student.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="border-b border-gray-200 mb-8"></div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-primary">Course Materials / Attachments</h2>
        {/* Add Chapter Form */}
        <form onSubmit={handleAddChapter} className="flex flex-col md:flex-row gap-4 items-end mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name</label>
            <input
              type="text"
              value={newChapterName}
              onChange={e => setNewChapterName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary"
              placeholder="e.g. Chapter 3: Functions"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach Files</label>
            <input
              type="file"
              multiple
              onChange={e => setChapterFiles(e.target.files)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Add Chapter
          </button>
        </form>
        {/* Chapters List */}
        {chapters.length === 0 ? (
          <div className="text-gray-500">No chapters or attachments added yet.</div>
        ) : (
          <div className="space-y-6">
            {chapters.map((chapter, cIdx) => (
              <div key={cIdx} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{chapter.name}</h3>
                  <button
                    className="text-red-500 text-xs hover:underline"
                    onClick={() => handleRemoveChapter(cIdx)}
                    type="button"
                  >
                    Remove Chapter
                  </button>
                </div>
                <ul className="list-disc pl-6 text-gray-700">
                  {chapter.files.map((file, fIdx) => (
                    <li key={fIdx} className="flex items-center justify-between py-1">
                      <span>{file.name}</span>
                      <button
                        className="ml-2 text-red-500 text-xs"
                        onClick={() => handleRemoveFile(cIdx, fIdx)}
                        type="button"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
      <div className="border-b border-gray-200 mb-8"></div>
      <section>
        <h2 className="text-xl font-semibold mb-4 text-primary">Assignments & Quizzes</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Assignment 1: Data Structures (Due: 2024-09-15)</li>
          <li>Quiz 1: Basics of Programming (Due: 2024-09-22)</li>
        </ul>
      </section>
    </div>
  );
}

export default CourseDetailFaculty; 