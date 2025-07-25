import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GradingFeedback from '../../components/GradingFeedback';

// Mock data for a completed assignment
const mockAssignment = {
  id: 1,
  title: "Introduction to Programming Assignment",
  course: "CS101 - Introduction to Computer Science",
  dueDate: "2024-03-25T23:59:59",
  status: "completed",
  description: "Complete the basic programming exercises and submit your solutions. The assignment includes:\n\n1. Write a program to calculate factorial\n2. Implement a simple calculator\n3. Create a program to find prime numbers\n\nPlease submit your solutions in a single zip file containing all the source code files.",
  totalMarks: 100,
  submittedMarks: 85,
  submissionType: "file",
  requirements: [
    "All code must be properly commented",
    "Include a README file with instructions",
    "Code should be well-formatted and follow best practices",
    "Submit only .java or .py files"
  ],
  attachments: [
    {
      name: "Assignment Guidelines.pdf",
      url: "#",
      type: "pdf"
    },
    {
      name: "Sample Code.zip",
      url: "#",
      type: "zip"
    }
  ],
  submission: {
    submittedAt: "2024-03-24T15:30:00",
    file: {
      name: "assignment_solution.zip",
      url: "#",
      size: "2.5MB"
    },
    feedback: "Good work on the implementation! The code is well-structured and follows best practices. However, there are a few areas that could be improved:\n\n1. Add more comments to explain complex logic\n2. Consider edge cases in the calculator implementation\n3. The prime number algorithm could be optimized further",
    gradedBy: "Dr. Smith",
    gradedAt: "2024-03-25T10:15:00"
  }
};

function CompletedAssignmentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAssignment(mockAssignment);
      } catch (err) {
        setError("Failed to load assignment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/student/assignments/submit")}
            className="text-primary hover:text-primary-dark mb-4 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Assignments
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{assignment.title}</h1>
          <p className="text-gray-600 mt-2">{assignment.course}</p>
        </div>

        {/* Assignment Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                <p className="mt-1 text-gray-900">{formatDueDate(assignment.dueDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Marks</h3>
                <p className="mt-1 text-gray-900">{assignment.totalMarks}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{assignment.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
              <ul className="list-disc list-inside text-gray-600">
                {assignment.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {assignment.attachments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Attachments</h3>
                <div className="space-y-2">
                  {assignment.attachments.map((file, index) => (
                    <a
                      key={index}
                      href={file.url}
                      className="flex items-center text-primary hover:text-primary-dark"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {file.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Submission Details */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Details</h3>
              
              {/* Grade Information */}
              <GradingFeedback
                isFaculty={false}
                grade={assignment.submittedMarks}
                feedback={assignment.submission.feedback}
                isGraded={true}
              />

              {/* Submission File */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted File</h4>
                <a
                  href={assignment.submission.file.url}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {assignment.submission.file.name}
                  <span className="ml-2 text-gray-500">({assignment.submission.file.size})</span>
                </a>
                <p className="mt-1 text-sm text-gray-500">
                  Submitted on {formatDueDate(assignment.submission.submittedAt)}
                </p>
              </div>

              {/* Feedback */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 whitespace-pre-line">{assignment.submission.feedback}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompletedAssignmentView; 