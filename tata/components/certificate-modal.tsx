"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/components/user-provider"
import type { Course } from "@/lib/types"
import { downloadCertificate } from "@/lib/download-utils"

interface CertificateModalProps {
  // For CourseDetailPage usage (uncontrolled or controlled by CourseDetailPage):
  course?: Course
  // For TrainingModuleDashboardPage usage (controlled):
  isOpen?: boolean
  onClose?: () => void
  // For TrainingModuleDashboardPage usage (direct props, if course is not passed):
  userName?: string | null
  courseName?: string
  completionDate?: string
}

export default function CertificateModal({
  course,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  userName: propUserName,
  courseName: propCourseName,
  completionDate: propCompletionDate,
}: CertificateModalProps) {
  // Internal state for uncontrolled usage (e.g., in CourseDetailPage if not explicitly controlled)
  const [internalIsOpen, setInternalIsOpen] = useState(false)

  // Determine actual isOpen and onClose based on whether props are provided
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const onClose = controlledOnClose !== undefined ? controlledOnClose : () => setInternalIsOpen(false)

  // Derive course details from 'course' prop or use direct props
  const actualCourseName = propCourseName || course?.title || "Unknown Course"
  const actualCompletionDate =
    propCompletionDate ||
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const { userName: contextUserName, isLoading: isUserLoading } = useUser()
  const [nameInput, setNameInput] = useState("")
  const [status, setStatus] = useState<"idle" | "generating" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (contextUserName && !isUserLoading) {
      setNameInput(contextUserName)
    } else if (propUserName && !isUserLoading) {
      setNameInput(propUserName)
    }
  }, [contextUserName, isUserLoading, propUserName])

  const handleGenerate = async () => {
    if (!nameInput.trim()) {
      setMessage("Please enter your name to generate the certificate.")
      setStatus("error")
      return
    }

    setStatus("generating")
    setMessage("Generating your certificate...")

    // Simulate certificate generation without actual download for demo purposes
    // setTimeout(() => {
    //   setStatus("success")
    //   setMessage("Certificate generated successfully! (Download is disabled in this demo preview)")
    //   // In a real application, you would call downloadCertificate(actualCourseName, nameInput) here
    //   // const result = await downloadCertificate(actualCourseName, nameInput);
    //   // setStatus(result.success ? 'success' : 'error');
    //   // setMessage(result.message);
    // }, 1500) // Simulate network delay
    const result = await downloadCertificate(actualCourseName, nameInput)
    setStatus(result.success ? "success" : "error")
    setMessage(result.message)
  }

  const isButtonDisabled = isUserLoading || status === "generating" || !nameInput.trim()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Certificate</DialogTitle>
          <DialogDescription>
            Enter your name to generate your completion certificate for "{actualCourseName}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Your Name
            </Label>
            <Input
              id="name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="col-span-3"
              disabled={isUserLoading || status === "generating"}
              placeholder={isUserLoading ? "Loading name..." : "Enter your name"}
            />
          </div>
          {message && (
            <p className={`text-sm text-center ${status === "error" ? "text-red-500" : "text-green-500"}`}>{message}</p>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleGenerate} disabled={isButtonDisabled}>
            {status === "generating" ? "Generating..." : "Generate Certificate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
