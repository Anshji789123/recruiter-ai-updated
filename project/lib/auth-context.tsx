"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "./firebase"

interface UserData {
  uid: string
  email: string
  name: string
  userType: "recruiter" | "candidate"
  company?: string
  phone?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  logout: () => Promise<void>
  setUserData: (data: UserData | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
  setUserData: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to set user data from external components
  const setUserDataExternal = (data: UserData | null) => {
    setUserData(data)
    if (data) {
      // Store in localStorage as backup
      localStorage.setItem("hiregenius_user_data", JSON.stringify(data))
    } else {
      localStorage.removeItem("hiregenius_user_data")
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true)

      if (currentUser) {
        setUser(currentUser)

        // Try to get user data from localStorage first
        try {
          const storedUserData = localStorage.getItem("hiregenius_user_data")
          if (storedUserData) {
            const parsedData = JSON.parse(storedUserData)
            if (parsedData.uid === currentUser.uid) {
              setUserData(parsedData)
              setLoading(false)
              return
            }
          }
        } catch (error) {
          console.log("No stored user data found")
        }

        // If no stored data, create basic user data from auth user
        const basicUserData: UserData = {
          uid: currentUser.uid,
          email: currentUser.email || "",
          name: currentUser.displayName || "User",
          userType: "candidate", // Default, will be updated during signup
          createdAt: new Date().toISOString(),
        }

        setUserData(basicUserData)
      } else {
        setUser(null)
        setUserData(null)
        localStorage.removeItem("hiregenius_user_data")
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setUserData(null)
      localStorage.removeItem("hiregenius_user_data")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, setUserData: setUserDataExternal }}>
      {children}
    </AuthContext.Provider>
  )
}
