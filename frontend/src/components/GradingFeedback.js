import React, { useState } from 'react';

const GradingFeedback = ({
  isFaculty = false,
  grade = null,
  feedback = '',
  onSubmit = () => {},
  isGraded = false,
}) => {
  const [inputGrade, setInputGrade] = useState(grade || '');
  const [inputFeedback, setInputFeedback] = useState(feedback || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputGrade === '' || isNaN(inputGrade)) return;
    onSubmit({ grade: Number(inputGrade), feedback: inputFeedback });
  };

  if (isGraded || !isFaculty) {
    return (
      <div className="grading-feedback-view">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-green-700">Grade: <span className="font-bold">{grade !== null ? grade : 'Not graded yet'}</span></h4>
        </div>
        <div>
          <h5 className="font-semibold text-gray-700 mb-1">Feedback:</h5>
          <div className="bg-gray-50 rounded p-3 text-gray-700 min-h-[40px]">{feedback || 'No feedback provided.'}</div>
        </div>
        <hr className="my-6" />
      </div>
    );
  }

  // Faculty grading form
  return (
    <form className="grading-feedback-form space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
        <input
          type="number"
          min="0"
          max="100"
          value={inputGrade}
          onChange={(e) => setInputGrade(e.target.value)}
          required
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg font-semibold"
          placeholder="Enter grade"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
        <textarea
          value={inputFeedback}
          onChange={(e) => setInputFeedback(e.target.value)}
          placeholder="Enter feedback (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[80px]"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-block px-6 py-2 bg-primary text-white font-semibold rounded-md shadow hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition"
        >
          Submit Grade
        </button>
      </div>
    </form>
  );
};

export default GradingFeedback; 