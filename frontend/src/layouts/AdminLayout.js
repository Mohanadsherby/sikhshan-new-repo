"use client"
import { Outlet, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Sidebar from "../components/navigation/Sidebar"
import Navbar from "../components/navigation/Navbar"

function AdminLayout() {
  const { currentUser } = useAuth()

  // Redirect to admin login if not authenticated as admin
  if (!currentUser || currentUser.role !== "SUPERADMIN") {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Use the same Navbar component as other layouts */}
        <Navbar />
        
        {/* Admin Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout 