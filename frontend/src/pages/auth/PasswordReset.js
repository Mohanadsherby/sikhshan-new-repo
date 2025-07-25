"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

function PasswordReset() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      const result = await resetPassword(email)
      setMessage(result.message)
    } catch (err) {
      setError("Failed to reset password: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Reset Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-center">
              <span className="text-primary">Academi</span>
              <span className="text-dark">X</span>
            </h1>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Reset your password</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
              <p className="font-medium">Success</p>
              <p>{message}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary-dark transition-colors duration-200"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-8 max-w-lg">
            <h2 className="text-4xl font-bold mb-4">Password Recovery</h2>
            <p className="text-xl">We'll help you get back into your account in no time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordReset
