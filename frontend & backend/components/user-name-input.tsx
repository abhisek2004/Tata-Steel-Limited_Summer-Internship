"use client"

import { useUser } from "@/components/user-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function UserNameInput() {
  const { userName, setUserName } = useUser()
  const [inputValue, setInputValue] = useState(userName)

  useEffect(() => {
    setInputValue(userName) // Keep input in sync with context
  }, [userName])

  const handleSave = () => {
    if (inputValue.trim()) {
      setUserName(inputValue.trim())
      alert(`User name set to: ${inputValue.trim()}`)
    } else {
      alert("Please enter a name.")
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 p-4 bg-gray-100 border-b border-gray-200">
      <Label htmlFor="user-name" className="sr-only">
        Your Name
      </Label>
      <Input
        id="user-name"
        type="text"
        placeholder="Enter your name for certificates"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="max-w-xs"
      />
      <Button onClick={handleSave}>Set Name</Button>
      {userName && (
        <span className="text-sm text-gray-600">
          Currently logged in as: <span className="font-semibold text-blue-700">{userName}</span>
        </span>
      )}
    </div>
  )
}
