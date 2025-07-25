"use client"
import { Outlet, Navigate } from "react-router-dom"
import Navbar from "../components/navigation/Navbar"
import Sidebar from "../components/navigation/Sidebar"
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from "react"

function MainLayout() {
  const { currentUser } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
