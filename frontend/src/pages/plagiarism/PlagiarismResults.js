"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

function PlagiarismResults() {
  const { currentUser } = useAuth()
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [checkMethod, setCheckMethod] = useState("file") // "file" or "text"
  const [uploadedFile, setUploadedFile] = useState(null)
  const [rawText, setRawText] = useState("")
  const [checkResult, setCheckResult] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState(null)

  // Mock plagiarism check results
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      assignment: "CS101 Assignment 3",
      course: "CS101",
      submissionDate: "2023-05-10",
      plagiarismScore: 15,
      status: "Flagged",
      matches: [
        {
          id: 1,
          source: "Internet Source - stackoverflow.com",
          matchedText:
            "The implementation of a binary search tree requires a node structure that contains a value and references to two child nodes.",
          similarity: 85,
        },
        {
          id: 2,
          source: "Student Submission - Jane Smith (2022)",
          matchedText:
            "To traverse a binary tree in-order, we first visit the left subtree, then the root node, and finally the right subtree.",
          similarity: 92,
        },
      ],
    },
    {
      id: 2,
      assignment: "CS201 Project Proposal",
      course: "CS201",
      submissionDate: "2023-05-08",
      plagiarismScore: 5,
      status: "Acceptable",
      matches: [
        {
          id: 1,
          source: "Internet Source - wikipedia.org",
          matchedText:
            "A hash table is a data structure that implements an associative array abstract data type, a structure that can map keys to values.",
          similarity: 75,
        },
      ],
    },
  ])

  // Determine if user can access this page
  const canAccessPage = currentUser?.role === "STUDENT"

  if (!canAccessPage) {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
      setRawText("") // Clear raw text when file is uploaded
    }
  }

  const handleTextChange = (event) => {
    setRawText(event.target.value)
    setUploadedFile(null) // Clear file when text is entered
  }

  const handleCheckPlagiarism = async () => {
    setIsChecking(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock result
    const newResult = {
      id: Date.now(),
      assignment: "New Check",
      course: "Current Course",
      submissionDate: new Date().toISOString().split('T')[0],
      plagiarismScore: Math.floor(Math.random() * 100),
      status: "Analyzed",
      matches: [
        {
          id: 1,
          source: "Internet Source - example.com",
          matchedText: "This is a sample matched text from the internet.",
          similarity: 75,
        },
      ],
    }
    
    setCheckResult(newResult)
    setSubmissions(prev => [newResult, ...prev])
    setIsChecking(false)
  }

  const generatePDF = (submission) => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.text("Plagiarism Report", 105, 20, { align: "center" })
    
    // Add submission details
    doc.setFontSize(12)
    doc.text(`Assignment: ${submission.assignment}`, 20, 40)
    doc.text(`Course: ${submission.course}`, 20, 50)
    doc.text(`Submission Date: ${submission.submissionDate}`, 20, 60)
    
    // Add plagiarism score
    doc.setFontSize(16)
    doc.text(`Plagiarism Score: ${submission.plagiarismScore}%`, 20, 80)
    doc.text(`Status: ${submission.status}`, 20, 90)
    
    // Add matches table
    const tableColumn = ["Source", "Similarity", "Matched Text"]
    const tableRows = submission.matches.map(match => [
      match.source,
      `${match.similarity}%`,
      match.matchedText
    ])
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 100,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [220, 53, 69] }
    })
    
    // Save the PDF
    doc.save(`plagiarism-report-${submission.assignment.toLowerCase().replace(/\s+/g, '-')}.pdf`)
  }

  const handleDeleteSubmission = (submission) => {
    setSubmissionToDelete(submission)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (submissionToDelete) {
      setSubmissions(prev => prev.filter(s => s.id !== submissionToDelete.id))
      if (selectedSubmission?.id === submissionToDelete.id) {
        setSelectedSubmission(null)
      }
    }
    setShowDeleteConfirm(false)
    setSubmissionToDelete(null)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Plagiarism Checker</h1>

      {/* Check Method Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Check Your Work</h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setCheckMethod("file")}
            className={`px-4 py-2 rounded-md ${
              checkMethod === "file"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setCheckMethod("text")}
            className={`px-4 py-2 rounded-md ${
              checkMethod === "text"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Enter Text
          </button>
        </div>

        {checkMethod === "file" ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".doc,.docx,.pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Choose File
              </label>
              <p className="mt-2 text-sm text-gray-500">
                {uploadedFile ? uploadedFile.name : "No file chosen"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supported formats: .doc, .docx, .pdf, .txt
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={rawText}
              onChange={handleTextChange}
              placeholder="Paste your text here..."
              className="w-full h-48 p-4 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleCheckPlagiarism}
            disabled={isChecking || (!uploadedFile && !rawText)}
            className={`w-full px-4 py-2 rounded-md text-white ${
              isChecking || (!uploadedFile && !rawText)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isChecking ? "Checking..." : "Check for Plagiarism"}
          </button>
        </div>
      </div>

      {/* Check Result */}
      {checkResult && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Check Result</h2>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800">Plagiarism Score</h3>
              <p className="text-3xl font-bold text-red-600">{checkResult.plagiarismScore}%</p>
            </div>
            <div
              className={`text-sm px-3 py-1 rounded-full font-medium ${
                checkResult.plagiarismScore < 10
                  ? "bg-green-100 text-green-800"
                  : checkResult.plagiarismScore < 25
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {checkResult.status}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Similarity Breakdown</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  checkResult.plagiarismScore < 10
                    ? "bg-green-600"
                    : checkResult.plagiarismScore < 25
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
                style={{ width: `${checkResult.plagiarismScore}%` }}
              ></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Matched Sources</h3>
            <div className="space-y-4">
              {checkResult.matches.map((match) => (
                <div key={match.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-gray-800">{match.source}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                      {match.similarity}% Match
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 border-l-4 border-red-500">
                    "{match.matchedText}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => generatePDF(checkResult)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Download PDF Report
            </button>
          </div>
        </div>
      )}

      {/* Previous Submissions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Previous Submissions</h2>
        <div className="divide-y divide-gray-200">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className={`p-4 hover:bg-gray-50 ${
                selectedSubmission?.id === submission.id ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 cursor-pointer" onClick={() => setSelectedSubmission(submission)}>
                  <h3 className="text-sm font-medium text-gray-900">{submission.assignment}</h3>
                  <p className="text-xs text-gray-500 mt-1">Course: {submission.course}</p>
                  <p className="text-xs text-gray-500">Submitted: {submission.submissionDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      submission.status === "Acceptable"
                        ? "bg-green-100 text-green-800"
                        : submission.status === "Flagged"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {submission.plagiarismScore}% Match
                  </span>
                  <button
                    onClick={() => generatePDF(submission)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Download PDF Report"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteSubmission(submission)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete Submission"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Submission Details */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedSubmission.assignment}</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="text-lg font-medium text-gray-900">{selectedSubmission.course}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submission Date</p>
                  <p className="text-lg font-medium text-gray-900">{selectedSubmission.submissionDate}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-800">Plagiarism Score</h3>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${
                      selectedSubmission.plagiarismScore < 10
                        ? "bg-green-100 text-green-800"
                        : selectedSubmission.plagiarismScore < 25
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedSubmission.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      selectedSubmission.plagiarismScore < 10
                        ? "bg-green-600"
                        : selectedSubmission.plagiarismScore < 25
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${selectedSubmission.plagiarismScore}%` }}
                  ></div>
                </div>
                <p className="text-3xl font-bold text-red-600 mt-2">{selectedSubmission.plagiarismScore}%</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Matched Sources</h3>
                <div className="space-y-4">
                  {selectedSubmission.matches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-gray-800">{match.source}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                          {match.similarity}% Match
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 border-l-4 border-red-500">
                        "{match.matchedText}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => generatePDF(selectedSubmission)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Download PDF Report
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Submission</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this submission? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlagiarismResults 