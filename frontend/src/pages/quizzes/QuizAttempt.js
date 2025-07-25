"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useParams, useNavigate } from "react-router-dom"
import GradingFeedback from '../../components/GradingFeedback'

function QuizAttempt() {
  const { currentUser } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [hasPermission, setHasPermission] = useState(currentUser?.role === "STUDENT")
  const [isViewMode, setIsViewMode] = useState(false)

  const quizzes = useMemo(() => [
    {
      id: 1,
      title: "CS101 Quiz 2: Programming Fundamentals",
      course: "CS101",
      startDate: "2023-05-15",
      startTime: "10:00",
      duration: 30,
      totalPoints: 20,
      status: "Available",
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          text: "Which of the following is not a primitive data type in JavaScript?",
          points: 2,
          options: [
            { id: 1, text: "String", isCorrect: false },
            { id: 2, text: "Number", isCorrect: false },
            { id: 3, text: "Boolean", isCorrect: false },
            { id: 4, text: "Array", isCorrect: true },
          ],
        },
        {
          id: 2,
          type: "true_false",
          text: "JavaScript is a statically typed language.",
          points: 2,
          answer: "false",
        },
        {
          id: 3,
          type: "multiple_choice",
          text: "Which method is used to add an element to the end of an array in JavaScript?",
          points: 2,
          options: [
            { id: 1, text: "push()", isCorrect: true },
            { id: 2, text: "append()", isCorrect: false },
            { id: 3, text: "add()", isCorrect: false },
            { id: 4, text: "insert()", isCorrect: false },
          ],
        },
        {
          id: 4,
          type: "short_answer",
          text: "What does DOM stand for in web development?",
          points: 2,
          answer: "Document Object Model",
        },
        {
          id: 5,
          type: "multiple_choice",
          text: "Which of the following is used to declare a variable in JavaScript?",
          points: 2,
          options: [
            { id: 1, text: "var", isCorrect: false },
            { id: 2, text: "let", isCorrect: false },
            { id: 3, text: "const", isCorrect: false },
            { id: 4, text: "All of the above", isCorrect: true },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "CS201 Midterm: Data Structures",
      course: "CS201",
      startDate: "2023-05-20",
      startTime: "14:00",
      duration: 60,
      totalPoints: 50,
      status: "Upcoming",
    },
  ], [])

  useEffect(() => {
    setHasPermission(currentUser?.role === "STUDENT")
  }, [currentUser])

  useEffect(() => {
    if (id) {
      const quiz = quizzes.find(q => q.id === parseInt(id))
      if (quiz) {
        setSelectedQuiz(quiz)
        setIsViewMode(true)
      } else {
        navigate("/student/quizzes/attempt")
      }
    }
  }, [id, navigate, quizzes])

  const handleSubmitQuiz = useCallback(() => {
    if (selectedQuiz) {
      console.log("Quiz submitted:", {
        quizId: selectedQuiz.id,
        answers,
      })
      setQuizSubmitted(true)
    }
  }, [selectedQuiz, answers])

  useEffect(() => {
    let timer
    if (quizStarted && timeRemaining > 0 && !quizSubmitted) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
    } else if (quizStarted && timeRemaining === 0 && !quizSubmitted) {
      handleSubmitQuiz()
    }

    return () => clearTimeout(timer)
  }, [quizStarted, timeRemaining, quizSubmitted, handleSubmitQuiz])

  const handleStartQuiz = () => {
    const initialAnswers = {}
    selectedQuiz.questions.forEach((q) => (initialAnswers[q.id] = ""))
    setAnswers(initialAnswers)
    setTimeRemaining(selectedQuiz.duration * 60)
    setQuizStarted(true)
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  if (!hasPermission) {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isViewMode ? "View Quiz" : "Take Quiz"}
      </h1>

      {/* Show grade and feedback after quiz is submitted */}
      {quizSubmitted && (
        <GradingFeedback
          isFaculty={false}
          grade={18}
          feedback={'Well done!'}
          isGraded={true}
        />
      )}

      {!selectedQuiz ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Quizzes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quiz</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td className="px-6 py-4">{quiz.title}</td>
                    <td className="px-6 py-4">{quiz.course}</td>
                    <td className="px-6 py-4">{new Date(`${quiz.startDate}T${quiz.startTime}`).toLocaleString()}</td>
                    <td className="px-6 py-4">{quiz.duration} minutes</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          quiz.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : quiz.status === "Upcoming"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {quiz.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/student/quizzes/${quiz.id}/view`)}
                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        View
                      </button>
                      {quiz.status === "Available" && (
                        <button
                          onClick={() => navigate(`/student/quizzes/${quiz.id}/attempt`)}
                          className="ml-2 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                        >
                          Start
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{selectedQuiz.title}</h2>
            {quizStarted && !quizSubmitted && (
              <div className="text-lg font-medium text-gray-700">
                Time Remaining: {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          {!quizStarted && !quizSubmitted ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                This quiz has {selectedQuiz.questions.length} questions and will take approximately{" "}
                {selectedQuiz.duration} minutes to complete.
              </p>
              <button
                onClick={handleStartQuiz}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
              >
                Start Quiz
              </button>
          </div>
          ) : quizSubmitted ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Quiz submitted successfully!</p>
              <button
                onClick={() => navigate("/student/quizzes")}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
              >
                Back to Quizzes
              </button>
        </div>
      ) : (
            <div className="space-y-6">
              {selectedQuiz.questions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-800">{question.text}</h3>
                    <span className="text-sm text-gray-500">{question.points} points</span>
          </div>

                  {question.type === "multiple_choice" && (
                <div className="space-y-2">
                      {question.options.map((option) => (
                        <label key={option.id} className="flex items-center">
                      <input
                        type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            checked={answers[question.id] === option.id}
                            onChange={() => handleAnswerChange(question.id, option.id)}
                            className="mr-2"
                      />
                          {option.text}
                    </label>
                  ))}
                </div>
              )}

                  {question.type === "true_false" && (
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value="true"
                          checked={answers[question.id] === "true"}
                          onChange={() => handleAnswerChange(question.id, "true")}
                          className="mr-2"
                        />
                        True
                      </label>
                      <label className="flex items-center">
                      <input
                        type="radio"
                          name={`question-${question.id}`}
                          value="false"
                          checked={answers[question.id] === "false"}
                          onChange={() => handleAnswerChange(question.id, "false")}
                          className="mr-2"
                      />
                        False
                    </label>
                </div>
              )}

                  {question.type === "short_answer" && (
                <input
                  type="text"
                      value={answers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your answer"
                />
              )}
            </div>
          ))}

              <div className="flex justify-end">
          <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
          >
            Submit Quiz
          </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuizAttempt
