import React, { useState } from "react";

const mockAvailableCourses = [
  {
    id: 1,
    title: "Web Development",
    code: "CS401",
    instructor: "Dr. Brown",
    credits: 3,
    startDate: "2024-08-15",
    endDate: "2024-12-20",
    description: "Learn modern web development techniques and frameworks.",
  },
  {
    id: 2,
    title: "Machine Learning",
    code: "CS501",
    instructor: "Dr. Davis",
    credits: 4,
    startDate: "2024-08-15",
    endDate: "2024-12-20",
    description: "Introduction to machine learning algorithms and applications.",
  },
  {
    id: 3,
    title: "Database Systems",
    code: "CS301",
    instructor: "Prof. Williams",
    credits: 3,
    startDate: "2024-08-15",
    endDate: "2024-12-20",
    description: "Covers database design, implementation, and management principles.",
  },
];

function AvailableCoursesStudent() {
  const [courses, setCourses] = useState(mockAvailableCourses);
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState([]);

  const handleEnroll = (id) => {
    setEnrollingId(id);
    setTimeout(() => {
      setEnrolledIds((prev) => [...prev, id]);
      setEnrollingId(null);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h2>
              <div className="text-sm text-gray-500 mb-2">{course.code}</div>
              <div className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</div>
              <div className="text-sm text-gray-600 mb-2">Credits: {course.credits}</div>
              <div className="text-sm text-gray-600 mb-2">{course.startDate} - {course.endDate}</div>
              <p className="text-gray-700 text-sm mb-4">{course.description}</p>
              <button
                className={`w-full py-2 rounded-md text-white font-semibold transition-colors duration-200 ${enrolledIds.includes(course.id) ? 'bg-green-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                disabled={enrolledIds.includes(course.id) || enrollingId === course.id}
                onClick={() => handleEnroll(course.id)}
              >
                {enrolledIds.includes(course.id)
                  ? 'Enrolled'
                  : enrollingId === course.id
                  ? 'Enrolling...'
                  : 'Enroll'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableCoursesStudent; 