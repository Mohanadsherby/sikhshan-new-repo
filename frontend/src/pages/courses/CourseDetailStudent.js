import React, { useState } from "react";
import { Link } from "react-router-dom";

function CourseDetailStudent() {
  // Mock data for demonstration
  const courseInfo = {
    title: "Introduction to Computer Science",
    code: "CS101",
    credits: 3,
    category: "Computer Science",
    dates: "2024-08-01 to 2024-12-15",
  };
  const chapters = [
    { name: "Chapter 1: Introduction", files: [{ name: "Syllabus.pdf" }] },
    { name: "Chapter 2: Basics", files: [{ name: "Lecture1.pdf" }] },
  ];
  const assignments = [
    { name: "Assignment 1: Data Structures", due: "2024-09-15" },
  ];
  const quizzes = [
    { name: "Quiz 1: Basics of Programming", due: "2024-09-22" },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Course Details</h1>
        <Link
          to="/student/courses"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Back to Courses
        </Link>
      </div>
      <div className="border-b border-gray-200 mb-6"></div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-primary">Course Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div><span className="font-medium">Title:</span> {courseInfo.title}</div>
          <div><span className="font-medium">Code:</span> {courseInfo.code}</div>
          <div><span className="font-medium">Credits:</span> {courseInfo.credits}</div>
          <div><span className="font-medium">Category:</span> {courseInfo.category}</div>
          <div><span className="font-medium">Dates:</span> {courseInfo.dates}</div>
        </div>
      </section>
      <div className="border-b border-gray-200 mb-8"></div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-primary">Course Materials / Attachments</h2>
        {chapters.length === 0 ? (
          <div className="text-gray-500">No chapters or attachments available yet.</div>
        ) : (
          <div className="space-y-6">
            {chapters.map((chapter, cIdx) => (
              <div key={cIdx} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{chapter.name}</h3>
                <ul className="list-disc pl-6 text-gray-700">
                  {chapter.files.map((file, fIdx) => (
                    <li key={fIdx}>
                      <a href="#" className="text-primary hover:underline">{file.name}</a>
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
          {assignments.map((a, i) => (
            <li key={i}>{a.name} (Due: {a.due})</li>
          ))}
          {quizzes.map((q, i) => (
            <li key={i + assignments.length}>{q.name} (Due: {q.due})</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default CourseDetailStudent; 