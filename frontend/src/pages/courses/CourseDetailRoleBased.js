import React, { useState } from "react";

const mockCourse = {
  id: 1,
  title: "Web Development",
  code: "CS401",
  instructor: "Dr. Brown",
  credits: 3,
  startDate: "2024-08-15",
  endDate: "2024-12-20",
  description: "Learn modern web development techniques and frameworks.",
  materials: [
    { id: 1, name: "Syllabus.pdf", type: "PDF", uploadDate: "2024-08-01" },
    { id: 2, name: "Lecture1.pdf", type: "PDF", uploadDate: "2024-08-16" },
  ],
  assignments: [
    { id: 1, title: "Assignment 1", dueDate: "2024-09-01", grade: 85, status: "Submitted" },
    { id: 2, title: "Assignment 2", dueDate: "2024-10-01", grade: null, status: "Not Submitted" },
  ],
  quizzes: [
    { id: 1, title: "Quiz 1", dueDate: "2024-09-10", grade: 90, status: "Attempted" },
    { id: 2, title: "Quiz 2", dueDate: "2024-10-10", grade: null, status: "Not Attempted" },
  ],
  enrolledStudents: [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ],
  averageGrade: 88,
  progress: 70,
};

// Change this to "FACULTY" or "STUDENT" to test role-based view
const mockCurrentUser = { role: "STUDENT" };

function CourseDetailRoleBased() {
  const [tab, setTab] = useState("overview");
  const { role } = mockCurrentUser;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockCourse.title}</h1>
        <div className="text-sm text-gray-500 mb-2">{mockCourse.code}</div>
        <div className="text-sm text-gray-600 mb-2">Instructor: {mockCourse.instructor}</div>
        <div className="text-sm text-gray-600 mb-2">Credits: {mockCourse.credits}</div>
        <div className="text-sm text-gray-600 mb-2">{mockCourse.startDate} - {mockCourse.endDate}</div>
        <p className="text-gray-700 text-sm mb-4">{mockCourse.description}</p>
        <div className="flex gap-4 mt-4">
          <button className={`px-4 py-2 rounded ${tab === "overview" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setTab("overview")}>Overview</button>
          <button className={`px-4 py-2 rounded ${tab === "materials" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setTab("materials")}>Materials</button>
          <button className={`px-4 py-2 rounded ${tab === "assignments" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setTab("assignments")}>Assignments</button>
          <button className={`px-4 py-2 rounded ${tab === "quizzes" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setTab("quizzes")}>Quizzes</button>
          {role === "FACULTY" && <button className={`px-4 py-2 rounded ${tab === "students" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setTab("students")}>Enrolled Students</button>}
        </div>
      </div>
      {/* Tab Content */}
      {tab === "overview" && (
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          {role === "STUDENT" ? (
            <>
              <div className="mb-4 flex items-center gap-4">
                <span className="text-sm text-gray-600">Average Grade:</span>
                <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 font-semibold text-sm">{mockCourse.averageGrade}</span>
                <span className="text-sm text-gray-600 ml-6">Progress:</span>
                <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 font-semibold text-sm">{mockCourse.progress}%</span>
              </div>
              <button className="mt-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Unenroll</button>
            </>
          ) : (
            <>
              <button className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark mr-2">Edit Course</button>
              <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">Manage Attachments</button>
            </>
          )}
        </div>
      )}
      {tab === "materials" && (
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-lg font-semibold mb-4">Course Materials</h2>
          <ul className="divide-y divide-gray-200">
            {mockCourse.materials.map((m) => (
              <li key={m.id} className="py-2 flex items-center justify-between">
                <span>{m.name}</span>
                <span className="text-xs text-gray-500">{m.type} • Uploaded: {m.uploadDate}</span>
                <button className="text-primary hover:underline text-sm">View</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === "assignments" && (
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-lg font-semibold mb-4">Assignments</h2>
          <ul className="divide-y divide-gray-200">
            {mockCourse.assignments.map((a) => (
              <li key={a.id} className="py-2 flex items-center justify-between">
                <span>{a.title}</span>
                <span className="text-xs text-gray-500">Due: {a.dueDate}</span>
                {role === "STUDENT" ? (
                  <>
                    <span className="text-xs text-gray-600 ml-2">{a.status}</span>
                    <span className="ml-2 inline-block px-2 py-1 rounded bg-green-100 text-green-800 font-semibold text-xs">{a.grade !== null ? a.grade : "-"}</span>
                    <button className="ml-4 text-primary hover:underline text-sm">View</button>
                  </>
                ) : (
                  <>
                    <button className="ml-4 text-primary hover:underline text-sm">Grade</button>
                    <button className="ml-2 text-red-500 hover:underline text-sm">Remove</button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {role === "FACULTY" && <button className="mt-4 px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark">Add Assignment</button>}
        </div>
      )}
      {tab === "quizzes" && (
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-lg font-semibold mb-4">Quizzes</h2>
          <ul className="divide-y divide-gray-200">
            {mockCourse.quizzes.map((q) => (
              <li key={q.id} className="py-2 flex items-center justify-between">
                <span>{q.title}</span>
                <span className="text-xs text-gray-500">Due: {q.dueDate}</span>
                {role === "STUDENT" ? (
                  <>
                    <span className="text-xs text-gray-600 ml-2">{q.status}</span>
                    <span className="ml-2 inline-block px-2 py-1 rounded bg-green-100 text-green-800 font-semibold text-xs">{q.grade !== null ? q.grade : "-"}</span>
                    <button className="ml-4 text-primary hover:underline text-sm">Attempt</button>
                  </>
                ) : (
                  <>
                    <button className="ml-4 text-primary hover:underline text-sm">Grade</button>
                    <button className="ml-2 text-red-500 hover:underline text-sm">Remove</button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {role === "FACULTY" && <button className="mt-4 px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark">Add Quiz</button>}
        </div>
      )}
      {tab === "students" && role === "FACULTY" && (
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-lg font-semibold mb-4">Enrolled Students</h2>
          <ul className="divide-y divide-gray-200">
            {mockCourse.enrolledStudents.map((s) => (
              <li key={s.id} className="py-2 flex items-center justify-between">
                <span>{s.name}</span>
                <button className="text-red-500 hover:underline text-sm">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CourseDetailRoleBased; 