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
};

function EnrollCourseStudent() {
  const [showModal, setShowModal] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");

  const handleEnroll = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    setEnrolling(true);
    setError("");
    setTimeout(() => {
      setEnrolling(false);
      setEnrolled(true);
      setShowModal(false);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{mockCourse.title}</h1>
        <div className="text-sm text-gray-500 mb-2">{mockCourse.code}</div>
        <div className="text-sm text-gray-600 mb-2">Instructor: {mockCourse.instructor}</div>
        <div className="text-sm text-gray-600 mb-2">Credits: {mockCourse.credits}</div>
        <div className="text-sm text-gray-600 mb-2">{mockCourse.startDate} - {mockCourse.endDate}</div>
        <p className="text-gray-700 text-sm mb-4">{mockCourse.description}</p>
        {enrolled ? (
          <div className="text-green-600 font-semibold">You are now enrolled in this course!</div>
        ) : (
          <button
            className="w-full py-2 rounded-md text-white font-semibold bg-primary hover:bg-primary-dark transition-colors duration-200"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            Enroll
          </button>
        )}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Confirm Enrollment</h2>
            <p className="mb-4">Are you sure you want to enroll in <span className="font-semibold">{mockCourse.title}</span>?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setShowModal(false)}
                disabled={enrolling}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark"
                onClick={handleConfirm}
                disabled={enrolling}
              >
                {enrolling ? "Enrolling..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnrollCourseStudent; 