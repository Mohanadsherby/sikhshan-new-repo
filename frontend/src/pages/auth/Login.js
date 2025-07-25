"use client"

import React, { useState, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import logo from "../../assets/images/logo.png"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState("STUDENT") // Default to student
  const { login, currentUser } = useAuth()
  const navigate = useNavigate()

  const redirectToDashboard = useCallback((role) => {
    console.log("Redirecting for role:", role); // Debug log
    switch (role) {
      case "FACULTY":
        navigate("/faculty")
        break
      case "STUDENT":
        navigate("/student")
        break
      case "SUPERADMIN":
        navigate("/admin")
        break
      default:
        navigate("/login")
    }
  }, [navigate])

  // If already logged in, redirect to appropriate dashboard
  React.useEffect(() => {
    if (currentUser) {
      redirectToDashboard(currentUser.role)
    }
  }, [currentUser, redirectToDashboard])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await login(email, password, selectedRole)
    setLoading(false)
    console.log("Login result:", result); // Debug log
    if (result.success) {
      // Use backend role for redirect
      redirectToDashboard(result.role || selectedRole)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center justify-center px-4 py-0 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-0">
              <div className="flex flex-col items-center" style={{ caretColor: 'transparent' }}>
                <img
                  src={logo}
                  alt="Sikhshan Logo"
                  className="h-48 w-auto mb-0 object-contain bg-transparent select-none pointer-events-none"
                />
                <h2 className="text-4xl font-bold mb-4">Welcome to Sikhshan</h2>
              </div>

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                </div>
              )}

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {/* Role Selector */}
                <div className="flex justify-center mb-6">
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("STUDENT")}
                      className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                        selectedRole === "STUDENT"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      } border border-gray-200`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("FACULTY")}
                      className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                        selectedRole === "FACULTY"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      } border border-gray-200`}
                    >
                      Faculty
                    </button>
                  </div>
                </div>

                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-16"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        tabIndex={0}
                        className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none z-10"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          // Eye icon with red slash overlay
                          <span className="relative inline-block h-5 w-5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary absolute top-0 left-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg className="h-5 w-5 absolute top-0 left-0 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <line x1="4" y1="20" x2="20" y2="4" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                          </span>
                        ) : (
                          // Eye icon (red)
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/reset-password" className="font-medium text-primary hover:text-primary-dark">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                    disabled={loading}
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
                      "Sign in"
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <Link to="/admin/login" className="font-medium text-primary hover:text-primary-dark">
                    Admin Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-8 max-w-lg">
            <h2 className="text-4xl font-bold mb-4">Welcome to Sikhshan</h2>
            <p className="text-xl">The comprehensive academic management system for modern educational institutions.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
