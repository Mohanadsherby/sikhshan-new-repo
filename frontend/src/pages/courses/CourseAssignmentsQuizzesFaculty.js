import React, { useState } from "react";

const mockAssignments = [
  { id: 1, title: "Programming Assignment 1", dueDate: "2024-03-15", status: "Published" },
  { id: 2, title: "Midterm Project", dueDate: "2024-04-01", status: "Draft" },
];
const mockQuizzes = [
  { id: 1, title: "Quiz 1: Basics", dueDate: "2024-03-10", status: "Published" },
  { id: 2, title: "Quiz 2: Algorithms", dueDate: "2024-04-05", status: "Draft" },
];

function CourseAssignmentsQuizzesFaculty() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: "", dueDate: "" });
  const [newQuiz, setNewQuiz] = useState({ title: "", dueDate: "" });

  const handleAddAssignment = (e) => {
    e.preventDefault();
    setAssignments((prev) => [
      ...prev,
      { id: Date.now(), title: newAssignment.title, dueDate: newAssignment.dueDate, status: "Draft" },
    ]);
    setNewAssignment({ title: "", dueDate: "" });
    setShowAssignmentForm(false);
  };

  const handleAddQuiz = (e) => {
    e.preventDefault();
    setQuizzes((prev) => [
      ...prev,
      { id: Date.now(), title: newQuiz.title, dueDate: newQuiz.dueDate, status: "Draft" },
    ]);
    setNewQuiz({ title: "", dueDate: "" });
    setShowQuizForm(false);
  };

  const handleRemoveAssignment = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };
  const handleRemoveQuiz = (id) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Assignments & Quizzes</h1>
      {/* Assignments Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Assignments</h2>
          <button
            className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
            onClick={() => setShowAssignmentForm((v) => !v)}
          >
            {showAssignmentForm ? "Cancel" : "Add Assignment"}
          </button>
        </div>
        {showAssignmentForm && (
          <form onSubmit={handleAddAssignment} className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Title"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment((prev) => ({ ...prev, title: e.target.value }))}
              required
              className="border rounded px-2 py-1 flex-1"
            />
            <input
              type="date"
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
              className="border rounded px-2 py-1"
            />
            <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
          </form>
        )}
        <ul className="divide-y divide-gray-200">
          {assignments.map((a) => (
            <li key={a.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{a.title}</span>
                <span className="ml-4 text-xs text-gray-500">Due: {a.dueDate}</span>
                <span className={`ml-4 text-xs px-2 py-1 rounded-full ${a.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{a.status}</span>
              </div>
              <button onClick={() => handleRemoveAssignment(a.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Quizzes Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Quizzes</h2>
          <button
            className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
            onClick={() => setShowQuizForm((v) => !v)}
          >
            {showQuizForm ? "Cancel" : "Add Quiz"}
          </button>
        </div>
        {showQuizForm && (
          <form onSubmit={handleAddQuiz} className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Title"
              value={newQuiz.title}
              onChange={(e) => setNewQuiz((prev) => ({ ...prev, title: e.target.value }))}
              required
              className="border rounded px-2 py-1 flex-1"
            />
            <input
              type="date"
              value={newQuiz.dueDate}
              onChange={(e) => setNewQuiz((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
              className="border rounded px-2 py-1"
            />
            <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
          </form>
        )}
        <ul className="divide-y divide-gray-200">
          {quizzes.map((q) => (
            <li key={q.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{q.title}</span>
                <span className="ml-4 text-xs text-gray-500">Due: {q.dueDate}</span>
                <span className={`ml-4 text-xs px-2 py-1 rounded-full ${q.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{q.status}</span>
              </div>
              <button onClick={() => handleRemoveQuiz(q.id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CourseAssignmentsQuizzesFaculty; 