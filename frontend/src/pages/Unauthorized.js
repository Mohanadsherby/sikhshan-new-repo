import React from "react";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-white px-4">
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl p-10 border border-red-100">
        <div className="mb-6">
          <svg className="w-20 h-20 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-red-600 mb-2">Access Denied</h1>
        <p className="text-lg text-gray-700 mb-6 text-center max-w-md">
          You do not have permission to view this page.<br />
          Please check your account or contact your administrator if you believe this is a mistake.
        </p>
        <a href="/login" className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition text-lg font-semibold">
          Go to Login
        </a>
      </div>
    </div>
  );
} 