"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, ChevronDown, ChevronUp, Clock, CheckCircle } from "lucide-react"
import type { Course } from "@/lib/types"
import CertificateModal from "./certificate-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import RegistrationForm from "./registration-form"
import { useRouter } from "next/navigation" // Import useRouter

interface CourseDetailPageProps {
  course: Course
}

export default function CourseDetailPage({ course }: CourseDetailPageProps) {
  const router = useRouter() // Initialize useRouter
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false) // This state will still be used to control dialog visibility
  const [registeredUserName, setRegisteredUserName] = useState("")
  const [showCertificateModal, setShowCertificateModal] = useState(false) // New state for certificate modal

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleRegistrationSuccess = (data: { userName: string }) => {
    setRegisteredUserName(data.userName)
    setShowRegistrationModal(false)
    setIsRegistered(true) // Keep this to potentially update UI on CourseDetailPage if not redirecting immediately
    router.push("/dashboard") // Redirect to the dashboard page
  }

  // Generate additional detailed content for the course
  const generateDetailedContent = () => {
    // This would typically come from your database
    return [
      {
        title: "Module Details",
        preview: `This course contains ${course.modules} comprehensive modules covering all aspects of ${course.title}.`,
        locked: true,
        content: (course.curriculum || []).map((item, idx) => ({
          // Safely access curriculum
          title: item,
          description: `Detailed exploration of concepts, practical exercises, and real-world applications related to ${
            item.split(":")[1] || item
          }.`,
          duration: `${Math.floor(Math.random() * 5) + 2} hours`,
        })),
      },
      {
        title: "Learning Materials",
        preview: "Access comprehensive study materials, practice exercises, and reference guides.",
        locked: true,
        content: [
          "Comprehensive course handbook (PDF)",
          "Practice exercise workbook",
          "Reference guides and cheat sheets",
          "Case studies and real-world examples",
          "Additional reading materials and resources",
        ],
      },
      {
        title: "Industry Applications",
        preview: `Learn how ${course.title} is applied in various departments at Tata Steel.`,
        locked: false,
        content: [
          "Production optimization and quality control",
          "Maintenance planning and scheduling",
          "Supply chain management and logistics",
          "Financial analysis and reporting",
          "Human resource management and development",
        ],
      },
      {
        title: "Career Opportunities",
        preview: `Discover career paths that benefit from expertise in ${course.title}.`,
        locked: false,
        content: [
          `${course.title} Specialist`,
          `Senior ${course.category} Analyst`,
          `${course.category} Team Lead`,
          `${course.category} Project Manager`,
          "Technical Consultant",
        ],
      },
    ]
  }

  const detailedContent = generateDetailedContent()

  // Removed: if (isRegistered) { return <UserDashboard course={course} userName={registeredUserName} /> }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/courses">
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-primary">{course.title}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full ${getLevelColor(course.level)}`}>{course.level}</span>
            <span className="px-3 py-1 rounded-full bg-accent text-primary">{course.category}</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800">{course.duration}</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800">{course.modules} modules</span>
          </div>

          <p className="text-lg text-gray-700 mb-8">{course.desc}</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-4">Learning Objectives</h3>
              <ul className="space-y-2">
                {course.objectives.map((objective, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-primary mb-4">Course Details</h3>
              <div className="space-y-4">
                <div>
                  <strong className="text-gray-800">Prerequisites:</strong>
                  <p className="text-gray-600">{course.prerequisites}</p>
                </div>
                <div>
                  <strong className="text-gray-800">Certification:</strong>
                  <p className="text-gray-600">{course.certification}</p>
                </div>
                <div className="pt-2">
                  {/* Trigger for the CertificateModal */}
                  <Button onClick={() => setShowCertificateModal(true)}>Generate Certificate</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-primary mb-4">Curriculum Overview</h3>
            <div className="space-y-2">
              {course.curriculum.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center p-3 bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
              {course.curriculum.length > 3 && (
                <div className="p-3 bg-secondary rounded text-center">
                  <p className="text-primary font-medium">
                    +{course.curriculum.length - 3} more modules available after registration
                  </p>
                  <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                    <Lock size={14} className="mr-1" />
                    Register to unlock full curriculum
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button
              className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
              onClick={() => setShowRegistrationModal(true)}
            >
              Enroll Now
            </Button>
          </div>
        </div>

        {/* Detailed Course Content Sections */}
        <div className="space-y-6 mb-8">
          {detailedContent.map((section, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div
                className="p-6 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection(section.title)}
              >
                <h3 className="text-xl font-semibold text-primary">{section.title}</h3>
                <Button variant="ghost" size="sm">
                  {expandedSections[section.title] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <div
                className={`px-6 pb-6 ${expandedSections[section.title] ? "block" : "hidden"} border-t border-gray-100`}
              >
                <p className="text-gray-700 mb-4">{section.preview}</p>

                {section.locked ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500">
                        <Lock size={18} className="mr-2" />
                        <p>This content is available after registration</p>
                      </div>
                      <Button size="sm" onClick={() => setShowRegistrationModal(true)}>
                        Register to Access
                      </Button>
                    </div>
                  </div>
                ) : Array.isArray(section.content) ? (
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="text-green-500 mr-2 h-5 w-5 mt-0.5" />
                        <span className="text-gray-700">
                          {typeof item === "string" ? item : item.title}
                          {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                          {item.duration && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock size={12} className="mr-1" />
                              {item.duration}
                            </div>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">{section.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Course Requirements and Certification Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold text-primary mb-6">Course Requirements & Certification</h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Completion Criteria</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Attend at least 90% of all sessions</li>
                  <li>Complete all assigned practical exercises</li>
                  <li>Score at least 70% on the final assessment</li>
                  <li>Submit the capstone project (if applicable)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Assessment Methods</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Multiple-choice quizzes after each module</li>
                  <li>Practical assignments and case studies</li>
                  <li>Final comprehensive examination</li>
                  <li>Hands-on project demonstration</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Certification Process</h4>
              <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                <li>Complete all course requirements</li>
                <li>Pass the final assessment with minimum 70% score</li>
                <li>Submit feedback form</li>
                <li>Certificate will be issued within 7 working days after course completion</li>
                <li>Digital certificate will be emailed and physical copy will be sent to your department</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Certificate Validity & Recognition</h4>
              <p className="text-gray-700 mb-3">
                The {course.certification} is valid for 3 years from the date of issuance. Recertification may be
                required to maintain the credential, depending on industry standards and company policy.
              </p>
              <p className="text-gray-700">
                This certification is recognized across all Tata Steel facilities and is aligned with industry
                standards. It may also contribute to your professional development credits for external certifications
                where applicable.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-secondary border-l-4 border-primary p-6 rounded mb-8">
          <h4 className="font-semibold text-primary mb-3">Career Advancement</h4>
          <p className="text-gray-700 mb-3">
            This certification contributes to your professional development at Tata Steel and may be considered during
            performance reviews and promotion opportunities. It demonstrates your commitment to skill enhancement and
            continuous learning.
          </p>
          <p className="text-gray-700">
            Employees who complete this course may be eligible for advanced courses in this domain and may be considered
            for specialized roles requiring expertise in {course.title}.
          </p>
        </div>
      </div>

      {/* Registration Modal */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Course Registration</DialogTitle>
          </DialogHeader>
          <RegistrationForm
            itemTitle={course.title}
            onSuccess={handleRegistrationSuccess}
            onCancel={() => setShowRegistrationModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Certificate Modal (controlled by CourseDetailPage) */}
      <CertificateModal course={course} isOpen={showCertificateModal} onClose={() => setShowCertificateModal(false)} />
    </div>
  )
}
