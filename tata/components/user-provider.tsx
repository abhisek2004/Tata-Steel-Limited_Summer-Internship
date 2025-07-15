"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface UserContextType {
  userName: string
  setUserName: (name: string) => void
  isLoading: boolean // Add isLoading to context type
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true) // New loading state

  useEffect(() => {
    // Load user name from localStorage on initial mount
    const storedName = localStorage.getItem("tata-steel-user-name")
    if (storedName) {
      setUserNameState(storedName)
    }
    setIsLoading(false) // Set loading to false after attempting to load
  }, [])

  const setUserName = (name: string) => {
    setUserNameState(name)
    localStorage.setItem("tata-steel-user-name", name)
  }

  return <UserContext.Provider value={{ userName, setUserName, isLoading }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
