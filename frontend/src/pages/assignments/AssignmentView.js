import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GradingFeedback from '../../components/GradingFeedback';

// Mock data for a single assignment
const mockAssignment = {
  id: 1,
  title: "Introduction to Programming Assignment",
  course: "CS101 - Introduction to Computer Science",
  dueDate: "2024-03-25T23:59:59",
  status: "upcoming",
  description: "Complete the basic programming exercises and submit your solutions. The assignment includes:\n\n1. Write a program to calculate factorial\n2. Implement a simple calculator\n3. Create a program to find prime numbers\n\nPlease submit your solutions in a single zip file containing all the source code files.",
  totalMarks: 100,
  submittedMarks: null,
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
  ]
};

function AssignmentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionType, setSubmissionType] = useState("file"); // "file" or "link"
  const [submitting, setSubmitting] = useState(false);

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

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (submissionType === "file" && selectedFiles.length === 0) {
      alert("Please select at least one file to submit");
      return;
    }

    if (submissionType === "link" && !submissionLink.trim()) {
      alert("Please enter a submission link");
      return;
    }

    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Assignment submitted successfully!");
      navigate("/student/assignments/submit");
    } catch (err) {
      alert("Failed to submit assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

            {/* Grade and Feedback */}
            {assignment.submittedMarks !== undefined && assignment.submission && (
              <GradingFeedback
                isFaculty={false}
                grade={assignment.submittedMarks}
                feedback={assignment.submission.feedback}
                isGraded={true}
              />
            )}

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="mt-8">
              {/* Submission Type Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Type</h3>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-primary"
                      name="submissionType"
                      value="file"
                      checked={submissionType === "file"}
                      onChange={(e) => setSubmissionType(e.target.value)}
                    />
                    <span className="ml-2">File Upload</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-primary"
                      name="submissionType"
                      value="link"
                      checked={submissionType === "link"}
                      onChange={(e) => setSubmissionType(e.target.value)}
                    />
                    <span className="ml-2">Submission Link</span>
                  </label>
                </div>
              </div>

              {submissionType === "file" ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Your Solution
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".zip,.pdf,.doc,.docx,.txt,.java,.py,.cpp,.c,.js,.html,.css"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        ZIP, PDF, DOC, DOCX, TXT, or code files up to 10MB each
                      </p>
                    </div>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <div className="flex items-center">
                            <svg
                              className="flex-shrink-0 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="ml-2 text-sm text-gray-700">{file.name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)}MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <label htmlFor="submission-link" className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Link
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      id="submission-link"
                      name="submission-link"
                      className="block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="https://github.com/username/repo"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter a valid URL to your submission (e.g., GitHub repository, Google Drive link)
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || (submissionType === "file" ? selectedFiles.length === 0 : !submissionLink.trim())}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white ${
                  submitting || (submissionType === "file" ? selectedFiles.length === 0 : !submissionLink.trim())
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Assignment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentView; 