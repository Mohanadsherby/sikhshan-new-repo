import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, deleteUser } from "../../api/adminUserApi";

function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getUserById(userId);
        setUser(res.data);
      } catch (err) {
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        navigate("/admin/users", { state: { success: "User deleted successfully." } });
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to delete user.";
        if (msg.includes("foreign key constraint")) {
          setError("Cannot delete user: user is assigned as instructor to one or more courses.");
        } else {
          setError("Failed to delete user.");
        }
      }
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString();
  };

  // Helper to get the full profile picture URL
  const getProfilePictureUrl = (url) => {
    if (!url) return "/placeholder-user.jpg";
    if (url.startsWith("http")) return url;
    return `http://localhost:8081${url}`;
  };

  // User-friendly role display mapping
  const roleDisplay = {
    STUDENT: "Student",
    FACULTY: "Faculty",
    SUPERADMIN: "Superadmin"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-primary text-white rounded">Back</button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <div className="flex flex-col items-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mb-2 overflow-hidden">
            {user.profilePictureUrl ? (
              <img
                src={getProfilePictureUrl(user.profilePictureUrl)}
                alt="Profile"
                className="h-20 w-20 object-cover rounded-full"
              />
            ) : (
              user.name && user.name.trim()
                ? user.name.charAt(0).toUpperCase()
                : (user.role ? user.role.charAt(0).toUpperCase() : "U")
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary bg-opacity-10 text-primary mb-2">
            {roleDisplay[user.role] || user.role}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} mb-2`}>
            {user.status}
          </span>
        </div>
        <div className="space-y-4 mb-8">
          <div>
            <span className="font-medium text-gray-700">Email:</span> <span className="text-gray-900">{user.email}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Created At:</span> <span className="text-gray-900">{formatDate(user.createdAt)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">User ID:</span> <span className="text-gray-900">{user.id}</span>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetails; 