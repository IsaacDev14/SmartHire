// src/contexts/AuthContext.jsx
"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: true,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          credentials: "include",
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          localStorage.setItem("SmartHire_user", JSON.stringify(userData))
        } else {
          setUser(null)
          localStorage.removeItem("SmartHire_user")
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setUser(null)
        localStorage.removeItem("SmartHire_user")
      } finally {
        setLoading(false)
    }
    }

    checkSession()
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("SmartHire_user", JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
    setUser(null)
    localStorage.removeItem("SmartHire_user")
    }
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
    
  }
  return context


}



