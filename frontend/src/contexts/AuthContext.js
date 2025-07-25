"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { login as apiLogin, logout as apiLogout } from '../api/authApi';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { getProfile } from '../api/profileApi';

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, decode JWT from localStorage and set currentUser
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser({
          email: decoded.sub,
          role: decoded.role,
          id: decoded.id,
        });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password, role) => {
    try {
      const response = await apiLogin(email, password, role);
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      // Decode token to set current user
      const decoded = jwtDecode(response.data.token);
      let userObj = {
        email: decoded.sub,
        role: decoded.role,
        id: decoded.id,
      };
      // Fetch profile to get name and profilePictureUrl
      try {
        const profileRes = await getProfile(decoded.id);
        userObj = {
          ...userObj,
          name: profileRes.data.name,
          profilePictureUrl: profileRes.data.profilePictureUrl,
        };
      } catch (e) {
        // If profile fetch fails, fallback to basic info
      }
      setCurrentUser(userObj);
      return { success: true, message: response.data.message, role: response.data.role };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Login failed' };
    }
  };

  const logout = async () => {
    const role = currentUser?.role;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    if (role) {
      try {
        await apiLogout(role);
      } catch (e) {
        // Ignore logout errors
      }
    }
  };

  // Reset password function (mock)
  const resetPassword = (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Password reset email sent!" })
      }, 1000)
    })
  }

  const value = {
    currentUser,
    login,
    logout,
    resetPassword,
    setCurrentUser,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
