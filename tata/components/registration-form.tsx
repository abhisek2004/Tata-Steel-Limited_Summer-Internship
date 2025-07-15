"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/components/user-provider" // Corrected import path
// Removed: import type { RegistrationFormProps } from "@/types/registration-form-props" as it's not defined in the project

interface RegistrationFormProps {
  itemTitle: string
  onSuccess: (userName: string, employeeId: string, department: string) => void // Change to individual parameters
  onCancel?: () => void
}

export default function RegistrationForm({ itemTitle, onSuccess, onCancel }: RegistrationFormProps) {
  const [userName, setUserNameState] = useState("") // Renamed to avoid conflict with context
  const [employeeId, setEmployeeId] = useState("")
  const [department, setDepartment] = useState("")
  const [manager, setManager] = useState("")
  const [reason, setReason] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { setUserName: setGlobalUserName } = useUser() // Get setUserName from context

  const handleRegistration = () => {
    const errors: Record<string, string> = {}

    if (!userName) errors.userName = "Your full name is required"
    if (!employeeId) errors.employeeId = "Employee ID is required"
    if (!department) errors.department = "Department is required"
    if (!manager) errors.manager = "Manager's name is required"
    if (!reason) errors.reason = "Reason for enrollment is required"
    if (!agreeToTerms) errors.terms = "You must agree to the terms and conditions"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      console.log("RegistrationForm: Validation errors:", errors)
      return
    }

    // If validation passes, call onSuccess with individual parameters
    console.log("RegistrationForm: Validation passed. Calling onSuccess with", { userName, employeeId, department })
    setGlobalUserName(userName)
    onSuccess(userName, employeeId, department) // Pass individual parameters instead of object
  }

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h4 className="font-medium">Register for {itemTitle}</h4>
        <p className="text-sm text-gray-500">
          Complete the registration to access full materials and earn your certificate upon completion.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="user-name">Your Full Name*</Label>
          <Input
            id="user-name"
            placeholder="Enter your full name"
            value={userName}
            onChange={(e) => setUserNameState(e.target.value)}
            className={formErrors.userName ? "border-red-500" : ""}
          />
          {formErrors.userName && <p className="text-red-500 text-xs mt-1">{formErrors.userName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employee-id">Employee ID*</Label>
            <Input
              id="employee-id"
              placeholder="Enter your employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className={formErrors.employeeId ? "border-red-500" : ""}
            />
            {formErrors.employeeId && <p className="text-red-500 text-xs mt-1">{formErrors.employeeId}</p>}
          </div>
          <div>
            <Label htmlFor="department">Department*</Label>
            <select
              id="department"
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                formErrors.department ? "border-red-500" : ""
              }`}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select department</option>
              <option value="Production">Production</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Information Technology">Information Technology</option>
            </select>
            {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="manager">Manager's Name*</Label>
          <Input
            id="manager"
            placeholder="Enter your manager's name"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className={formErrors.manager ? "border-red-500" : ""}
          />
          {formErrors.manager && <p className="text-red-500 text-xs mt-1">{formErrors.manager}</p>}
        </div>

        <div>
          <Label htmlFor="reason">Reason for Enrollment*</Label>
          <textarea
            id="reason"
            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              formErrors.reason ? "border-red-500" : ""
            }`}
            rows={3}
            placeholder="Briefly explain why you want to take this course"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
          {formErrors.reason && <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="terms"
          className={`rounded ${formErrors.terms ? "border-red-500" : ""}`}
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
        />
        <Label htmlFor="terms" className="text-sm text-gray-700">
          I agree to the course terms and conditions*
        </Label>
      </div>
      {formErrors.terms && <p className="text-red-500 text-xs">{formErrors.terms}</p>}

      <DialogFooter className="flex justify-end space-x-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleRegistration}>Submit Registration</Button>
      </DialogFooter>
    </div>
  )
}
