import React, { useState } from "react";

const mockEnrolledCourses = [
  {
    id: 1,
    title: "Web Development",
    code: "CS401",
    instructor: "Dr. Brown",
    credits: 3,
    startDate: "2024-08-15",
    endDate: "2024-12-20",
    averageGrade: 88,
    progress: 70,
  },
  {
    id: 2,
    title: "Machine Learning",
    code: "CS501",
    instructor: "Dr. Davis",
    credits: 4,
    startDate: "2024-08-15",
    endDate: "2024-12-20",
    averageGrade: 92,
    progress: 55,
  },
  {
    id: 3,
    title: "Database Systems",
    code: "CS301",
    instructor: "Prof. Williams",
    credits: 3,
    startDate: "2024-08-15",
    endDate: "2024-12-20",
    averageGrade: 80,
    progress: 40,
  },
];

function EnrolledCoursesStudent() {
  const [courses] = useState(mockEnrolledCourses);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Enrolled Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h2>
              <div className="text-sm text-gray-500 mb-2">{course.code}</div>
              <div className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</div>
              <div className="text-sm text-gray-600 mb-2">Credits: {course.credits}</div>
              <div className="text-sm text-gray-600 mb-2">{course.startDate} - {course.endDate}</div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Average Grade:</span>
                <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 font-semibold text-sm">{course.averageGrade}</span>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  className="w-full py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-200"
                  onClick={() => alert(`Viewing materials for ${course.title}`)}
                >
                  View Course Materials
                </button>
                <button
                  className="w-full py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-200"
                  onClick={() => alert(`Unenrolled from ${course.title}`)}
                >
                  Unenroll
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnrolledCoursesStudent; 