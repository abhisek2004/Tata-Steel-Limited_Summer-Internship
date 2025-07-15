"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Eye } from "lucide-react"
import Image from "next/image"
import type { Course } from "@/lib/types"

interface CourseCertificateProps {
  course: Course
  previewMode?: boolean
  userName?: string
}

export default function CourseCertificate({
  course,
  previewMode = false,
  userName = "[Employee Name]",
}: CourseCertificateProps) {
  const [showPreview, setShowPreview] = useState(false)
  const currentDate = new Date()
  const formattedDate = `${currentDate.getDate()} ${
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][currentDate.getMonth()]
  } ${currentDate.getFullYear()}`

  const certificateId = `TS-${course.id}-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-blue-700">Course Certificate</h3>
        {!previewMode && (
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? "Hide Preview" : "Preview Certificate"}
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        )}
      </div>

      {(showPreview || previewMode) && (
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <div className="w-[500px] h-[500px] rotate-12">
              <Image
                src="/tata-steel-logo-new.png"
                alt="Tata Steel Watermark"
                width={500}
                height={500}
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center">
              <div className="w-20 h-20 relative mr-4">
                <Image
                  src="/tata-steel-logo-new.png"
                  alt="Tata Steel Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900">TATA STEEL</h2>
                <p className="text-sm text-gray-600">Learning & Development</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Certificate ID:</p>
              <p className="font-mono text-sm">{certificateId}</p>
            </div>
          </div>

          <div className="text-center py-8 relative z-10">
            <h1 className="text-3xl font-serif mb-2">Certificate of Completion</h1>
            <p className="text-lg mb-8">This is to certify that</p>
            <p className="text-2xl font-bold text-blue-800 border-b-2 border-blue-300 inline-block px-8 py-2 mb-8">
              {userName}
            </p>
            <p className="text-lg mb-2">has successfully completed the course</p>
            <p className="text-2xl font-bold text-blue-800 mb-8">{course.title}</p>
            <p className="text-lg mb-8">with a duration of {course.duration}</p>

            <div className="flex justify-between items-center mt-12">
              <div className="text-center">
                <div className="relative w-48 h-16 mx-auto mb-2">
                  <Image
                    src="/signatures/tv-narendran-signature.png"
                    alt="T. V. Narendran Signature"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="border-t-2 border-gray-400 pt-2 w-48 mx-auto">
                  <p className="font-semibold">T. V. Narendran</p>
                  <p className="text-sm text-gray-600">CEO & Managing Director</p>
                  <p className="text-xs text-green-600 font-medium">OK</p>
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold">{formattedDate}</p>
                <p className="text-sm text-gray-600">Date of Completion</p>
              </div>
              <div className="text-center">
                <div className="relative w-48 h-16 mx-auto mb-2">
                  <Image
                    src="/signatures/kumud-lata-singh-signature.png"
                    alt="Kumud Lata Singh Signature"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="border-t-2 border-gray-400 pt-2 w-48 mx-auto">
                  <p className="font-semibold">Kumud Lata Singh</p>
                  <p className="text-sm text-gray-600">L&D Head</p>
                  <p className="text-xs text-green-600 font-medium">OK</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600 relative z-10">
            <p>
              This certificate verifies the completion of the {course.title} course at Tata Steel Learning &
              Development.
            </p>
            <p>Certification: {course.certification}</p>
          </div>
        </Card>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h4 className="text-xl font-semibold text-blue-700 mb-4">Course Requirements</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800 mb-2">Completion Criteria</h5>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Attend at least 90% of all sessions</li>
                <li>Complete all assigned practical exercises</li>
                <li>Score at least 70% on the final assessment</li>
                <li>Submit the capstone project (if applicable)</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800 mb-2">Prerequisites</h5>
              <p className="text-gray-700 mb-2">{course.prerequisites}</p>
              <p className="text-gray-700">
                Participants should bring their own laptop with necessary software pre-installed as per the course
                guidelines.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-2">Certification Process</h5>
            <ol className="list-decimal pl-5 space-y-1 text-gray-700">
              <li>Complete all course requirements</li>
              <li>Pass the final assessment</li>
              <li>Submit feedback form</li>
              <li>Certificate will be issued within 7 working days after course completion</li>
              <li>Digital certificate will be emailed and physical copy will be sent to your department</li>
            </ol>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-2">Certificate Validity</h5>
            <p className="text-gray-700">
              The {course.certification} is valid for 3 years from the date of issuance. Recertification may be required
              to maintain the credential, depending on industry standards and company policy.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h5 className="font-semibold text-blue-800 mb-2">Career Advancement</h5>
        <p className="text-gray-700">
          This certification contributes to your professional development at Tata Steel and may be considered during
          performance reviews and promotion opportunities. It demonstrates your commitment to skill enhancement and
          continuous learning.
        </p>
      </div>
    </div>
  )
}
