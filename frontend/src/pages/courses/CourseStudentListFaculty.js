import React from "react";
import { useParams, Link } from "react-router-dom";

const mockStudents = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    enrollmentDate: "2024-05-01",
    status: "active",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    enrollmentDate: "2024-05-03",
    status: "active",
  },
  {
    id: 3,
    name: "Charlie Lee",
    email: "charlie.lee@example.com",
    enrollmentDate: "2024-05-05",
    status: "inactive",
  },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date)) return "-";
  return date.toLocaleDateString();
};

function CourseStudentListFaculty() {
  const { courseId } = useParams();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enrolled Students</h1>
        <Link
          to={`/faculty/courses/${courseId}`}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Back to Course
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">{formatDate(student.enrollmentDate)}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseStudentListFaculty; 