"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  FileSpreadsheet,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  MapPin,
  Award,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Course, UpcomingProgram } from "@/lib/types"
import { downloadCertificate, downloadResource } from "@/lib/download-utils"
import {
  upcomingPrograms,
  userAchievements, // Re-added userAchievements import
  discussionPosts as initialDiscussionPosts,
  popularTrainingPaths, // Re-added popularTrainingPaths import
  detailedTrainingModuleContent, // Re-added detailedTrainingModuleContent import
} from "@/lib/data"
import CourseAnalytics from "./course-analytics"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Re-added Dialog imports
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/components/user-provider" // Import useUser hook
// Removed RegistrationForm import as it's not used directly in UserDashboard anymore

interface UserDashboardProps {
  course: Course
}

interface ChartData {
  type: "bar" | "line" | "pie"
  title: string
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string[]
      borderColor: string
      borderWidth: number
    }[]
  }
}

export default function UserDashboard({ course }: UserDashboardProps) {
  const { userName } = useUser()
  const [activeMainTab, setActiveMainTab] = useState("overview")
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})
  const [completedModulesState, setCompletedModules] = useState<Record<string, boolean>>({})
  const [certificateName, setCertificateName] = useState(userName)
  const [showCertificateForm, setShowCertificateForm] = useState(false)
  const [expandedContent, setExpandedContent] = useState<Record<string, boolean>>({})
  const [downloadingResource, setDownloadingResource] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<any>(null)
  const [isModuleRegistered, setIsModuleRegistered] = useState(false) // Keep for potential future module-specific registration

  // State for Course Notes modal
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [courseNotes, setCourseNotes] = useState("")

  // State for Discussions
  const [discussions, setDiscussions] = useState(initialDiscussionPosts)
  const [newDiscussionTopic, setNewDiscussionTopic] = useState("")
  const [newDiscussionCategory, setNewDiscussionCategory] = useState("")
  const [newDiscussionMessage, setNewDiscussionMessage] = useState("")

  // Update certificateName when userName from context changes
  useEffect(() => {
    setCertificateName(userName)
  }, [userName])

  // Generate detailed modules from curriculum
  const modules = (course.curriculum || []).map((item, idx) => {
    // Added fallback for curriculum
    const title = item.split(":")[1]?.trim() || item
    const moduleNumber = idx + 1
    const moduleId = `module-${moduleNumber}`

    const detailedContent = generateDetailedContent(title, moduleNumber)

    return {
      id: moduleId,
      number: moduleNumber,
      title,
      detailedContent,
      isCompleted: completedModulesState[moduleId] || false,
    }
  })

  // Generate detailed content for a module (kept as is from previous context)
  function generateDetailedContent(moduleTitle: string, moduleNumber: number) {
    const baseContent = [
      {
        title: "Introduction",
        content: `
        <h4 class="text-lg font-semibold mb-2">Welcome to ${moduleTitle}</h4>
        <p class="mb-3">This module provides a comprehensive introduction to ${moduleTitle.toLowerCase()} and its applications in industrial settings. You'll learn both theoretical concepts and practical applications that are directly relevant to your role at Tata Steel.</p>
        <p class="mb-3">By the end of this module, you'll have a solid understanding of the core principles and be able to apply them in real-world scenarios.</p>
        <h5 class="font-medium mb-2">Learning Objectives:</h5>
        <ul class="list-disc pl-5 mb-3">
          <li>Understand the fundamental concepts of ${moduleTitle.toLowerCase()}</li>
          <li>Learn how to apply these concepts in industrial settings</li>
          <li>Develop practical skills through hands-on exercises</li>
          <li>Analyze case studies relevant to Tata Steel operations</li>
        </ul>
        <p>This module is designed to be interactive, with a mix of reading materials, videos, and practical exercises.</p>
      `,
        duration: "30 mins",
      },
      {
        title: "Core Concepts",
        content: `
        <h4 class="text-lg font-semibold mb-2">Core Concepts of ${moduleTitle}</h4>
        <p class="mb-3">This section covers the essential theoretical foundations of ${moduleTitle.toLowerCase()}. We'll explore the key principles, methodologies, and best practices that form the backbone of this subject.</p>
        
        <div class="bg-blue-50 p-3 rounded-md mb-3">
          <h5 class="font-medium mb-1">Key Terminology</h5>
          <p>Before diving deeper, let's familiarize ourselves with the essential terminology used in ${moduleTitle.toLowerCase()}:</p>
          <ul class="list-disc pl-5 mt-2">
            <li><strong>Term 1:</strong> Definition and explanation</li>
            <li><strong>Term 2:</strong> Definition and explanation</li>
            <li><strong>Term 3:</strong> Definition and explanation</li>
          </ul>
        </div>
        
        <h5 class="font-medium mb-2">Fundamental Principles:</h5>
        <ol class="list-decimal pl-5 mb-3">
          <li class="mb-1"><strong>Principle 1:</strong> Detailed explanation of the first principle and its importance</li>
          <li class="mb-1"><strong>Principle 2:</strong> Detailed explanation of the second principle and its applications</li>
          <li class="mb-1"><strong>Principle 3:</strong> Detailed explanation of the third principle and how it relates to Tata Steel operations</li>
        </ol>
        
        <p class="mb-3">Understanding these core concepts is essential for mastering the practical applications that follow in the next sections.</p>
        
        <div class="bg-yellow-50 p-3 rounded-md">
          <h5 class="font-medium mb-1">Important Note:</h5>
          <p>These concepts form the foundation for all practical applications in this course. Make sure you understand them thoroughly before proceeding to the next section.</p>
        </div>
      `,
        duration: "1 hour",
      },
      {
        title: "Practical Applications",
        content: `
        <h4 class="text-lg font-semibold mb-2">Practical Applications of ${moduleTitle}</h4>
        <p class="mb-3">This section bridges theory and practice by demonstrating how the concepts you've learned are applied in real-world scenarios at Tata Steel.</p>
        
        <h5 class="font-medium mb-2">Application Areas:</h5>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div class="bg-gray-50 p-3 rounded-md">
            <h6 class="font-medium">Production Optimization</h6>
            <p>How ${moduleTitle.toLowerCase()} is used to optimize production processes, reduce waste, and improve efficiency.</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-md">
            <h6 class="font-medium">Quality Control</h6>
            <p>Implementing ${moduleTitle.toLowerCase()} techniques for maintaining and improving product quality.</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-md">
            <h6 class="font-medium">Resource Management</h6>
            <p>Using ${moduleTitle.toLowerCase()} for effective allocation and utilization of resources.</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-md">
            <h6 class="font-medium">Process Improvement</h6>
            <p>Applying ${moduleTitle.toLowerCase()} methodologies to continuously improve operational processes.</p>
          </div>
        </div>
        
        <h5 class="font-medium mb-2">Step-by-Step Implementation:</h5>
        <ol class="list-decimal pl-5 mb-3">
          <li class="mb-2">
            <strong>Analysis:</strong> Detailed explanation of how to analyze current processes using ${moduleTitle.toLowerCase()} principles
          </li>
          <li class="mb-2">
            <strong>Design:</strong> Guidelines for designing improved processes or solutions
          </li>
          <li class="mb-2">
            <strong>Implementation:</strong> Step-by-step approach to implementing changes
          </li>
          <li class="mb-2">
            <strong>Evaluation:</strong> Methods to measure the effectiveness of implemented solutions
          </li>
        </ol>
        
        <div class="bg-green-50 p-3 rounded-md">
          <h5 class="font-medium mb-1">Practical Exercise:</h5>
          <p>Apply what you've learned to a simulated scenario based on actual challenges faced at Tata Steel. Complete the exercise in the downloadable workbook and check your approach against the provided solutions.</p>
        </div>
      `,
        duration: "1.5 hours",
      },
      {
        title: "Case Studies & Examples",
        content: `
        <h4 class="text-lg font-semibold mb-2">Case Studies & Examples from Tata Steel</h4>
        <p class="mb-3">This section presents real-world case studies from Tata Steel operations where ${moduleTitle.toLowerCase()} has been successfully applied to solve problems and improve processes.</p>
        
        <div class="border-l-4 border-blue-500 pl-3 mb-4">
          <h5 class="font-medium mb-1">Case Study 1: Process Optimization at Kalinganagar Plant</h5>
          <p class="mb-2">This case study examines how ${moduleTitle.toLowerCase()} principles were applied to optimize the production process at the Kalinganagar plant, resulting in a 15% increase in efficiency and a significant reduction in waste.</p>
          <p class="text-sm text-gray-600">Key outcomes:</p>
          <ul class="list-disc pl-5 text-sm text-gray-600">
            <li>15% increase in production efficiency</li>
            <li>12% reduction in material waste</li>
            <li>Improved product quality metrics</li>
          </ul>
        </div>
        
        <div class="border-l-4 border-blue-500 pl-3 mb-4">
          <h5 class="font-medium mb-1">Case Study 2: Quality Improvement Initiative</h5>
          <p class="mb-2">This case study details how a cross-functional team used ${moduleTitle.toLowerCase()} techniques to address quality issues in the manufacturing process, resulting in a significant reduction in defects and customer complaints.</p>
          <p class="text-sm text-gray-600">Key outcomes:</p>
          <ul class="list-disc pl-5 text-sm text-gray-600">
            <li>40% reduction in defect rate</li>
            <li>60% decrease in customer complaints</li>
            <li>Standardized quality control procedures</li>
          </ul>
        </div>
        
        <div class="border-l-4 border-blue-500 pl-3 mb-4">
          <h5 class="font-medium mb-1">Case Study 3: Resource Optimization Project</h5>
          <p class="mb-2">This case study explores how ${moduleTitle.toLowerCase()} was used to optimize resource allocation across multiple departments, leading to cost savings and improved operational efficiency.</p>
          <p class="text-sm text-gray-600">Key outcomes:</p>
          <ul class="list-disc pl-5 text-sm text-gray-600">
            <li>Annual cost savings of ₹1.5 crore</li>
            <li>20% improvement in resource utilization</li>
            <li>Reduced operational bottlenecks</li>
          </ul>
        </div>
        
        <p class="mb-3">These case studies demonstrate the practical value of applying ${moduleTitle.toLowerCase()} in various aspects of steel manufacturing and operations.</p>
        
        <div class="bg-purple-50 p-3 rounded-md">
          <h5 class="font-medium mb-1">Learning Activity:</h5>
          <p>Review the case studies and identify which principles and techniques were most effective. Consider how you might apply similar approaches to challenges in your own department.</p>
        </div>
      `,
        duration: "1 hour",
      },
      {
        title: "Assessment & Practice",
        content: `
        <h4 class="text-lg font-semibold mb-2">Assessment & Practice</h4>
        <p class="mb-3">This section helps you consolidate your learning through practical exercises, self-assessment questions, and application activities.</p>
        
        <h5 class="font-medium mb-2">Knowledge Check:</h5>
        <div class="bg-gray-50 p-3 rounded-md mb-4">
          <p class="font-medium mb-2">1. Which of the following best describes the primary purpose of ${moduleTitle.toLowerCase()}?</p>
          <div class="pl-5 space-y-1">
            <div class="flex items-center">
              <input type="radio" id="q1a" name="q1" class="mr-2" />
              <label htmlFor="q1a">Option A description</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="q1b" name="q1" class="mr-2" />
              <label htmlFor="q1b">Option B description</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="q1c" name="q1" class="mr-2" />
              <label htmlFor="q1c">Option C description</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="q1d" name="q1" class="mr-2" />
              <label htmlFor="q1d">Option D description</label>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 p-3 rounded-md mb-4">
          <p class="font-medium mb-2">2. What is the key benefit of implementing ${moduleTitle.toLowerCase()} in steel manufacturing?</p>
          <div class="pl-5 space-y-1">
            <div class="flex items-center">
              <input type="radio" id="q2a" name="q2" class="mr-2" />
              <label htmlFor="q2a">Option A description</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="q2b" name="q2" class="mr-2" />
              <label htmlFor="q2b">Option B description</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="q2c" name="q2" class="mr-2" />
              <label htmlFor="q2c">Option C description</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="q2d" name="q2" class="mr-2" />
              <label htmlFor="q2d">Option D description</label>
            </div>
          </div>
        </div>
        
        <h5 class="font-medium mb-2">Application Exercise:</h5>
        <div class="bg-blue-50 p-3 rounded-md mb-4">
          <p class="mb-2">Apply the concepts you've learned to solve the following scenario:</p>
          <p class="mb-3">A production line at Tata Steel is experiencing inconsistent quality in the final product. Using the principles of ${moduleTitle.toLowerCase()}, outline a systematic approach to identify the root causes and implement solutions.</p>
          <textarea className="w-full p-2 border border-gray-300 rounded-md" rows={4} placeholder="Enter your response here..."></textarea>
        </div>
        
        <div class="bg-green-50 p-3 rounded-md">
          <h5 class="font-medium mb-1">Module Completion:</h5>
          <p>Once you've completed the knowledge check and application exercise, mark this module as complete to track your progress through the course.</p>
        </div>
      `,
        duration: "45 mins",
      },
    ]

    switch (moduleNumber % 5) {
      case 1:
        baseContent.push({
          title: "Industry Standards & Regulations",
          content: `
           <h4 class="text-lg font-semibold mb-2">Industry Standards & Regulations</h4>
           <p class="mb-3">This section covers the key industry standards, regulations, and compliance requirements related to ${moduleTitle.toLowerCase()} in the steel manufacturing industry.</p>
           
           <h5 class="font-medium mb-2">Key Standards:</h5>
           <ul class="list-disc pl-5 mb-3">
             <li class="mb-1"><strong>ISO 9001:</strong> Quality management systems requirements</li>
             <li class="mb-1"><strong>ISO 14001:</strong> Environmental management systems</li>
             <li class="mb-1"><strong>OHSAS 18001:</strong> Occupational health and safety management</li>
             <li class="mb-1"><strong>Industry-specific standards:</strong> Steel industry standards and specifications</li>
           </ul>
           
           <p class="mb-3">Understanding and adhering to these standards is crucial for ensuring quality, safety, and regulatory compliance in all operations.</p>
           
           <div class="bg-yellow-50 p-3 rounded-md">
             <h5 class="font-medium mb-1">Compliance Requirements:</h5>
             <p>Tata Steel maintains strict compliance with all applicable regulations. This section outlines the specific requirements that apply to your role and how to ensure compliance in daily operations.</p>
           </div>
         `,
          duration: "45 mins",
        })
        break
      case 2:
        baseContent.push({
          title: "Technology Integration",
          content: `
           <h4 class="text-lg font-semibold mb-2">Technology Integration in ${moduleTitle}</h4>
           <p class="mb-3">This section explores how modern technology is integrated with ${moduleTitle.toLowerCase()} to enhance efficiency, accuracy, and productivity in steel manufacturing.</p>
           
           <h5 class="font-medium mb-2">Key Technologies:</h5>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
             <div class="bg-gray-50 p-3 rounded-md">
               <h6 class="font-medium">Automation Systems</h6>
               <p>How automated systems are revolutionizing ${moduleTitle.toLowerCase()} processes and improving precision.</p>
             </div>
             <div class="bg-gray-50 p-3 rounded-md">
               <h6 class="font-medium">Data Analytics</h6>
               <p>Using big data and analytics to derive insights and make data-driven decisions.</p>
             </div>
             <div class="bg-gray-50 p-3 rounded-md">
               <h6 class="font-medium">IoT Integration</h6>
               <p>Internet of Things applications in monitoring and controlling ${moduleTitle.toLowerCase()} processes.</p>
             </div>
             <div class="bg-gray-50 p-3 rounded-md">
               <h6 class="font-medium">AI and Machine Learning</h6>
               <p>How artificial intelligence is being used to predict outcomes and optimize processes.</p>
             </div>
           </div>
           
           <p class="mb-3">These technologies are transforming traditional approaches to ${moduleTitle.toLowerCase()} and creating new opportunities for innovation and improvement.</p>
           
           <div class="bg-blue-50 p-3 rounded-md">
             <h5 class="font-medium mb-1">Tata Steel Digital Transformation:</h5>
             <p>Learn about Tata Steel's digital transformation journey and how technology is being leveraged to enhance ${moduleTitle.toLowerCase()} across all facilities.</p>
           </div>
         `,
          duration: "1 hour",
        })
        break
      case 3:
        baseContent.push({
          title: "Sustainability Practices",
          content: `
           <h4 class="text-lg font-semibold mb-2">Sustainability Practices in ${moduleTitle}</h4>
           <p class="mb-3">This section focuses on how ${moduleTitle.toLowerCase()} contributes to Tata Steel's sustainability goals and environmental responsibility initiatives.</p>
           
           <h5 class="font-medium mb-2">Sustainable Approaches:</h5>
           <ol class="list-decimal pl-5 mb-3">
             <li class="mb-1"><strong>Resource Efficiency:</strong> Optimizing resource use to minimize waste and environmental impact</li>
             <li class="mb-1"><strong>Energy Conservation:</strong> Implementing energy-efficient practices in ${moduleTitle.toLowerCase()} processes</li>
             <li class="mb-1"><strong>Emissions Reduction:</strong> Techniques to reduce carbon footprint and other emissions</li>
             <li class="mb-1"><strong>Circular Economy:</strong> Adopting circular principles in material use and waste management</li>
           </ol>
           
           <div class="bg-green-50 p-3 rounded-md mb-3">
             <h5 class="font-medium mb-1">Tata Steel's Sustainability Commitments:</h5>
             <p>Learn about Tata Steel's sustainability targets and how your role in ${moduleTitle.toLowerCase()} contributes to these broader environmental goals.</p>
           </div>
           
           <p class="mb-3">Sustainable practices in ${moduleTitle.toLowerCase()} not only benefit the environment but also contribute to operational efficiency and cost savings.</p>
           
           <div class="bg-blue-50 p-3 rounded-md">
             <h5 class="font-medium mb-1">Case Example:</h5>
             <p>Explore how the Kalinganagar plant implemented sustainable ${moduleTitle.toLowerCase()} practices, resulting in a 25% reduction in water usage and significant energy savings.</p>
           </div>
         `,
          duration: "45 mins",
        })
        break
      case 4:
        baseContent.push({
          title: "Future Trends & Innovations",
          content: `
           <h4 class="text-lg font-semibold mb-2">Future Trends & Innovations in ${moduleTitle}</h4>
           <p class="mb-3">This section explores emerging trends, innovations, and future directions in ${moduleTitle.toLowerCase()} that are likely to impact the steel industry in the coming years.</p>
           
           <h5 class="font-medium mb-2">Emerging Trends:</h5>
           <div class="space-y-3 mb-4">
             <div class="bg-gray-50 p-3 rounded-md">
               <h6 class="font-medium">Industry 4.0 Integration</h6>
               <p>How the fourth industrial revolution is transforming ${moduleTitle.toLowerCase()} through smart factories, interconnected systems, and data-driven decision making.</p>
             </div>
             <div class="bg-gray-50 p-3 rounded-md">
               <h6 class="font-medium">Advanced Materials</h6>
               <p>Development and application of new materials that are changing traditional approaches to ${moduleTitle.toLowerCase()}.</p>
             </div>
             <div class="bg-gray-50 p-3 rounded-md">
               <h6 class="font-medium">Predictive Analytics</h6>
               <p>Using advanced analytics and AI to predict outcomes, prevent issues, and optimize processes before problems occur.</p>
             </div>
           </div>
           
           <p class="mb-3">Staying informed about these trends is essential for maintaining competitive advantage and driving continuous improvement in ${moduleTitle.toLowerCase()}.</p>
           
           <div class="bg-purple-50 p-3 rounded-md">
             <h5 class="font-medium mb-1">Innovation at Tata Steel:</h5>
             <p>Learn about Tata Steel's innovation initiatives related to ${moduleTitle.toLowerCase()} and how the company is positioning itself at the forefront of industry advancements.</p>
           </div>
         `,
          duration: "45 mins",
        })
        break
      default:
        baseContent.push({
          title: "Leadership & Team Management",
          content: `
           <h4 class="text-lg font-semibold mb-2">Leadership & Team Management in ${moduleTitle}</h4>
           <p class="mb-3">This section focuses on the human aspects of ${moduleTitle.toLowerCase()}, including leadership skills, team management, and effective communication required for successful implementation.</p>
           
           <h5 class="font-medium mb-2">Key Leadership Competencies:</h5>
           <ul class="list-disc pl-5 mb-3">
             <li class="mb-1"><strong>Strategic Thinking:</strong> Developing a vision and strategy for ${moduleTitle.toLowerCase()} initiatives</li>
             <li class="mb-1"><strong>Change Management:</strong> Leading teams through transitions and implementation of new ${moduleTitle.toLowerCase()} processes</li>
             <li class="mb-1"><strong>Stakeholder Management:</strong> Engaging with various stakeholders to ensure buy-in and support</li>
             <li class="mb-1"><strong>Performance Management:</strong> Setting goals, monitoring progress, and providing feedback</li>
           </ul>
           
           <div class="bg-yellow-50 p-3 rounded-md mb-3">
             <h5 class="font-medium mb-1">Team Dynamics:</h5>
             <p>Understanding team dynamics and creating a collaborative environment is crucial for successful ${moduleTitle.toLowerCase()} implementation. This section provides practical guidance on building and leading effective teams.</p>
           </div>
           
           <p class="mb-3">Effective leadership can significantly impact the success of ${moduleTitle.toLowerCase()} initiatives by ensuring alignment, motivation, and continuous improvement.</p>
           
           <div class="bg-blue-50 p-3 rounded-md">
             <h5 class="font-medium mb-1">Reflection Exercise:</h5>
             <p>Consider a ${moduleTitle.toLowerCase()} project you've been involved with. What leadership approaches were most effective? What could have been improved? How would you apply these insights in future projects?</p>
           </div>
         `,
          duration: "1 hour",
        })
    }

    return baseContent
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const toggleContent = (contentId: string) => {
    setExpandedContent((prev) => ({
      ...prev,
      [contentId]: !prev[contentId],
    }))
  }

  const markModuleComplete = (moduleId: string) => {
    setCompletedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const completedModulesCount = Object.values(completedModulesState).filter(Boolean).length
  const totalModules = modules.length
  const progress = totalModules > 0 ? (completedModulesCount / totalModules) * 100 : 0
  const allModulesCompleted = completedModulesCount === totalModules && totalModules > 0

  const handleCertificateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertificateName(e.target.value)
  }

  const handleGenerateCertificate = async () => {
    if (!userName) {
      alert("Please set your name using the input field at the top of the page before generating a certificate.")
      return
    }
    try {
      const result = await downloadCertificate(course.title, certificateName)
      alert(result.message)
    } catch (error) {
      console.error("Error generating certificate:", error)
      alert("Failed to generate certificate. Please try again.")
    }
  }

  const handleResourceDownload = async (resourceType: string, resourceName: string) => {
    try {
      setDownloadingResource(resourceName)
      const result = await downloadResource(course.title, resourceType, resourceName)
      alert(result.message)
    } catch (error) {
      console.error(`Error downloading ${resourceName}:`, error)
      alert(`Failed to download ${resourceName}. Please try again.`)
    } finally {
      setDownloadingResource(null)
    }
  }

  const handleDownloadAllResources = async () => {
    const resourcesToDownload = [
      { type: "pdf", name: "Course Handbook" },
      { type: "excel", name: "Practice Exercises" },
      { type: "pdf", name: "Reference Guide" },
      { type: "pdf", name: "Case Studies" },
      { type: "pdf", name: "Industry Standards" },
      { type: "pdf", name: "Quick Start Guide" },
    ]

    for (const resource of resourcesToDownload) {
      await handleResourceDownload(resource.type, resource.name)
    }
    alert("All resources downloaded!")
  }

  const handleScheduleStudyTime = () => {
    alert("Study time scheduled! (This is a placeholder. Integrate with your calendar for full functionality.)")
  }

  const handlePostDiscussion = () => {
    if (!newDiscussionTopic.trim() || !newDiscussionMessage.trim()) {
      alert("Please fill in both topic and message for your discussion.")
      return
    }
    if (!userName) {
      alert("Please set your name using the input field at the top of the page to post a discussion.")
      return
    }

    const newPost = {
      id: `d${discussions.length + 1}`,
      author: userName,
      timestamp: new Date().toISOString(),
      content: newDiscussionMessage,
      replies: [],
    }

    setDiscussions([newPost, ...discussions])
    setNewDiscussionTopic("")
    setNewDiscussionCategory("")
    setNewDiscussionMessage("")
    alert("Your discussion has been posted!")
  }

  const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`
    const years = Math.floor(months / 12)
    return `${years} year${years > 1 ? "s" : ""} ago`
  }

  const relevantPrograms: UpcomingProgram[] = upcomingPrograms.filter(
    (program) => program.category === course.category || program.category === "Soft Skills",
  )

  // This function is for module-specific registration, not overall course registration
  const handleModuleRegistrationSuccess = () => {
    setIsModuleRegistered(true)
  }

  const renderBarChart = (chart: ChartData) => (
    <div>
      <h3>{chart.title}</h3>
      {/* Placeholder for Bar Chart */}
      <p>Bar Chart Placeholder</p>
    </div>
  )

  const renderLineChart = (chart: ChartData) => (
    <div>
      <h3>{chart.title}</h3>
      {/* Placeholder for Line Chart */}
      <p>Line Chart Placeholder</p>
    </div>
  )

  const renderPieChart = (chart: ChartData) => {
    return (
      <div>
        <h3>{chart.title}</h3>
        {/* Placeholder for Pie Chart */}
        <p>Pie Chart Placeholder</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">{course.title}</h1>
          <p className="text-gray-600 mt-1">Welcome back, {userName || "Guest"}!</p>
        </div>
        <div className="flex items-center">
          <div className="w-12 h-12 relative mr-3">
            <Image src="/tata-steel-logo.png" alt="Tata Steel Logo" width={48} height={48} className="object-contain" />
          </div>
          <Link href="/courses" className="text-blue-600 hover:text-blue-800">
            Back to Courses
          </Link>
        </div>
      </div>

      <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Programs</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area - 2/3 width on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Your Current Course Card (simplified, without progress bar here) */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Current Course: {course.title}</CardTitle>
                  <CardDescription>{course.desc}</CardDescription>
                </CardHeader>
                <CardContent>{/* Progress bar moved to "Your Progress" card in sidebar */}</CardContent>
              </Card>

              {/* Nested Tabs for Course Content, Resources, Discussions */}
              <Tabs defaultValue="content">
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Course Content</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  {modules.map((module) => (
                    <Card key={module.id} className={module.isCompleted ? "border-green-300 bg-green-50" : ""}>
                      <CardContent className="p-0">
                        <div
                          className="p-4 flex items-center justify-between cursor-pointer"
                          onClick={() => toggleModule(module.id)}
                        >
                          <div className="flex items-center">
                            {module.isCompleted ? (
                              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-gray-300 mr-3 flex-shrink-0" />
                            )}
                            <div>
                              <h3 className="font-semibold text-lg">
                                Module {module.number}: {module.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {module.detailedContent.length} lessons • Approximately{" "}
                                {module.detailedContent.reduce((total, item) => {
                                  const duration = item.duration.match(/(\d+\.?\d*)/)?.[0] || "0"
                                  return total + Number.parseFloat(duration)
                                }, 0)}{" "}
                                hours
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {!module.isCompleted && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markModuleComplete(module.id)
                                }}
                              >
                                Mark Complete
                              </Button>
                            )}
                            {expandedModules[module.id] ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>

                        {expandedModules[module.id] && (
                          <div className="border-t border-gray-200">
                            {module.detailedContent.map((content, idx) => {
                              const contentId = `${module.id}-content-${idx}`
                              return (
                                <div key={contentId} className="border-b border-gray-100 last:border-b-0">
                                  <div
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                                    onClick={() => toggleContent(contentId)}
                                  >
                                    <div className="flex items-center">
                                      <div className="w-6 h-6 flex items-center justify-center mr-3">
                                        <BookOpen className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <span className="font-medium">{content.title}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-500 mr-3">
                                        <Clock className="h-4 w-4 inline mr-1" />
                                        {content.duration}
                                      </span>
                                      {expandedContent[contentId] ? (
                                        <ChevronUp className="h-4 w-4 text-gray-500" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                      )}
                                    </div>
                                  </div>

                                  {expandedContent[contentId] && (
                                    <div className="px-4 pb-4 pt-2">
                                      <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: content.content }}
                                      />
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="resources">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                        Course Resources with Visual Analytics
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-lg mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-red-500" />
                            Course Handbook (25-30 pages)
                          </h4>
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-md border border-red-200">
                            <div className="flex items-center">
                              <FileText className="h-6 w-6 text-red-500 mr-3" />
                              <div>
                                <span className="font-medium">{course.title} Course Handbook</span>
                                <p className="text-sm text-gray-600">
                                  Comprehensive guide with charts, graphs & visual analytics
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={downloadingResource === "Course Handbook"}
                              onClick={() => handleResourceDownload("pdf", "Course Handbook")}
                            >
                              {downloadingResource === "Course Handbook" ? (
                                "Generating..."
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-1" /> Download PDF
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                            <p className="mb-2 font-medium flex items-center">
                              <PieChart className="h-4 w-4 mr-1" />
                              Enhanced Content Includes:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                <strong>Performance Analytics Dashboard</strong> - Bar charts, pie charts, line graphs
                              </li>
                              <li>
                                <strong>Learning Progress Visualization</strong> - Progress tracking charts and metrics
                              </li>
                              <li>
                                <strong>Industry Benchmarking Charts</strong> - Comparative analysis with visual data
                              </li>
                              <li>
                                <strong>Process Flow Diagrams</strong> - Step-by-step visual workflows
                              </li>
                              <li>
                                <strong>Statistical Analysis</strong> - Histograms, scatter plots, trend analysis
                              </li>
                              <li>
                                <strong>Organizational Charts</strong> - Department structure and reporting lines
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-lg mb-3 flex items-center">
                            <FileSpreadsheet className="h-5 w-5 mr-2 text-green-500" />
                            Practice Exercises (25-30 pages)
                          </h4>
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-md border border-green-200">
                            <div className="flex items-center">
                              <FileSpreadsheet className="h-6 w-6 text-green-500 mr-3" />
                              <div>
                                <span className="font-medium">{course.title} Practice Exercises</span>
                                <p className="text-sm text-gray-600">
                                  Interactive workbook with data analysis & visual exercises
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={downloadingResource === "Practice Exercises"}
                              onClick={() => handleResourceDownload("excel", "Practice Exercises")}
                            >
                              {downloadingResource === "Practice Exercises" ? (
                                "Generating..."
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-1" /> Download PDF
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                            <p className="mb-2 font-medium flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              Interactive Features Include:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                <strong>Data Analysis Exercises</strong> - Work with real production data sets
                              </li>
                              <li>
                                <strong>Chart Creation Templates</strong> - Build your own performance charts
                              </li>
                              <li>
                                <strong>Interactive Worksheets</strong> - Fill-in calculation templates
                              </li>
                              <li>
                                <strong>Performance Tracking Tools</strong> - Monitor your learning progress
                              </li>
                              <li>
                                <strong>Visual Problem Solving</strong> - Diagram-based exercises
                              </li>
                              <li>
                                <strong>Assessment Rubrics</strong> - Self-evaluation with scoring charts
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-lg mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-500" />
                            Reference Guide (15-20 pages)
                          </h4>
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-200">
                            <div className="flex items-center">
                              <FileText className="h-6 w-6 text-blue-500 mr-3" />
                              <div>
                                <span className="font-medium">{course.title} Reference Guide</span>
                                <p className="text-sm text-gray-600">
                                  Quick reference with visual decision trees & flowcharts
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={downloadingResource === "Reference Guide"}
                              onClick={() => handleResourceDownload("pdf", "Reference Guide")}
                            >
                              {downloadingResource === "Reference Guide" ? (
                                "Generating..."
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-1" /> Download PDF
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                            <p className="mb-2 font-medium">Visual Reference Tools:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                <strong>Quick Reference Dashboard</strong> - Key metrics with visual indicators
                              </li>
                              <li>
                                <strong>Troubleshooting Flowcharts</strong> - Visual decision trees for problem solving
                              </li>
                              <li>
                                <strong>Formula Reference Charts</strong> - Calculations with visual examples
                              </li>
                              <li>
                                <strong>Performance Benchmarks</strong> - Industry comparison charts
                              </li>
                              <li>
                                <strong>Process Maps</strong> - Visual workflow diagrams
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-lg mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-purple-500" />
                            Case Studies (20-25 pages)
                          </h4>
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-md border border-purple-200">
                            <div className="flex items-center">
                              <FileText className="h-6 w-6 text-purple-500 mr-3" />
                              <div>
                                <span className="font-medium">{course.title} Case Studies</span>
                                <p className="text-sm text-gray-600">
                                  Real-world examples with detailed analytics & outcome charts
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={downloadingResource === "Case Studies"}
                              onClick={() => handleResourceDownload("pdf", "Case Studies")}
                            >
                              {downloadingResource === "Case Studies" ? (
                                "Generating..."
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-1" /> Download PDF
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                            <p className="mb-2 font-medium">Case Study Analytics:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                <strong>Before/After Comparison Charts</strong> - Visual impact analysis
                              </li>
                              <li>
                                <strong>ROI Analysis Graphs</strong> - Financial impact visualization
                              </li>
                              <li>
                                <strong>Implementation Timeline Charts</strong> - Project progression tracking
                              </li>
                              <li>
                                <strong>Success Metrics Dashboard</strong> - Key performance indicators
                              </li>
                              <li>
                                <strong>Cost-Benefit Analysis</strong> - Financial comparison charts
                              </li>
                              <li>
                                <strong>Process Improvement Maps</strong> - Visual transformation workflows
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-lg mb-3">Additional Resources</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-md border border-orange-200">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-orange-500 mr-2" />
                                <div>
                                  <span className="font-medium">Industry Standards</span>
                                  <p className="text-xs text-gray-600">15-18 pages with compliance charts</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={downloadingResource === "Industry Standards"}
                                onClick={() => handleResourceDownload("pdf", "Industry Standards")}
                              >
                                {downloadingResource === "Industry Standards" ? (
                                  "..."
                                ) : (
                                  <>
                                    <Download className="h-4 w-4 mr-1" /> PDF
                                  </>
                                )}
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-md border border-teal-200">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-teal-500 mr-2" />
                                <div>
                                  <span className="font-medium">Quick Start Guide</span>
                                  <p className="text-xs text-gray-600">12-15 pages with visual workflows</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={downloadingResource === "Quick Start Guide"}
                                onClick={() => handleResourceDownload("pdf", "Quick Start Guide")}
                              >
                                {downloadingResource === "Quick Start Guide" ? (
                                  "..."
                                ) : (
                                  <>
                                    <Download className="h-4 w-4 mr-1" /> PDF
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="discussions">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Course Discussions</h3>
                      <p className="text-gray-600 mb-4">
                        Connect with other learners and instructors to discuss course topics, ask questions, and share
                        insights.
                      </p>
                      <div className="space-y-4">
                        {discussions.map((discussion) => (
                          <div key={discussion.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold mr-3">
                                  {discussion.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <h4 className="font-medium">{discussion.author}</h4>
                                  <p className="text-xs text-gray-500">Posted {formatTimeAgo(discussion.timestamp)}</p>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{discussion.content}</p>
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center text-gray-500">
                                <span>{discussion.replies.length} replies</span>
                                <span className="mx-2">•</span>
                                <span>View thread</span>
                              </div>
                              <Button variant="outline" size="sm">
                                Reply
                              </Button>
                            </div>
                          </div>
                        ))}

                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Start a New Discussion</h4>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="discussion-topic" className="block text-sm font-medium mb-1">
                                Topic
                              </label>
                              <input
                                type="text"
                                id="discussion-topic"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter discussion topic"
                                value={newDiscussionTopic}
                                onChange={(e) => setNewDiscussionTopic(e.target.value)}
                              />
                            </div>
                            <div>
                              <label htmlFor="discussion-category" className="block text-sm font-medium mb-1">
                                Category
                              </label>
                              <select
                                id="discussion-category"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={newDiscussionCategory}
                                onChange={(e) => setNewDiscussionCategory(e.target.value)}
                              >
                                <option value="">Select category</option>
                                <option value="General">General</option>
                                <option value="Module 1">Module 1</option>
                                <option value="Module 2">Module 2</option>
                                <option value="Module 3">Module 3</option>
                                <option value="Technical Questions">Technical Questions</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="discussion-message" className="block text-sm font-medium mb-1">
                                Message
                              </label>
                              <Textarea
                                id="discussion-message"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter your message"
                                value={newDiscussionMessage}
                                onChange={(e) => setNewDiscussionMessage(e.target.value)}
                              />
                            </div>
                            <Button onClick={handlePostDiscussion}>Post Discussion</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar - 1/3 width on large screens */}
            <div className="lg:col-span-1 space-y-6">
              {/* Your Achievements Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Your Achievements</CardTitle>
                  <CardDescription>Milestones you've reached</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 mr-2 text-yellow-500" />
                        <div>
                          <span className="font-medium">{achievement.title}</span>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{achievement.date}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Your Progress Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 text-sm text-gray-600 mb-2">
                    {completedModulesCount} of {totalModules} modules completed
                  </div>
                  <Progress value={progress} className="w-full mb-2" />
                  <div className="text-sm text-gray-600">{Math.round(progress)}%</div>
                  {allModulesCompleted ? (
                    <div className="mt-4">
                      <Button variant="default" onClick={() => setShowCertificateForm(true)}>
                        Download Certificate
                      </Button>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      Complete all modules to receive your course certificate.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Course Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Level:</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span>{course.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Certification:</span>
                    <span>{course.certification}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Course Instructor Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Course Instructor</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xl">
                    DR
                  </div>
                  <div>
                    <h4 className="font-medium">Dr. Rajesh Kumar</h4>
                    <p className="text-sm text-gray-600">Senior Technical Expert</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Dr. Kumar has over 20 years of experience in steel manufacturing and has been instrumental in
                      developing training programs at Tata Steel.
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2 text-blue-600">
                      Contact Instructor
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setShowNotesModal(true)}>
                    Course Notes
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleScheduleStudyTime}>
                    Schedule Study Time
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleDownloadAllResources}>
                    Download All Resources
                  </Button>
                </CardContent>
              </Card>

              {/* Popular Training Paths Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Popular Training Paths</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {popularTrainingPaths.map((path) => (
                    <div key={path.slug} className="flex items-center justify-between">
                      {" "}
                      {/* Changed key to slug */}
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                        <span>{path.name}</span> {/* Changed to path.name */}
                      </div>
                      <Link href={`/training-paths/${path.slug}`} className="text-blue-600 hover:text-blue-800">
                        {" "}
                        {/* Corrected link */}
                        View
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab Content */}
        <TabsContent value="analytics">
          <CourseAnalytics course={course} />
        </TabsContent>

        {/* Upcoming Programs Tab Content */}
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relevantPrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{program.date}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Location: {program.location}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Category: {program.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    {/* Assuming there's a link for program details, otherwise remove */}
                    <Link href={`/events/${program.id}/dashboard`} className="text-blue-600 hover:text-blue-800">
                      Learn More
                    </Link>
                    {/* Registration form for upcoming programs, if needed */}
                    {/* {!isModuleRegistered ? (
                      <RegistrationForm program={program} onRegistrationSuccess={handleModuleRegistrationSuccess} />
                    ) : (
                      <span className="text-green-500 font-semibold">Registered</span>
                    )} */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Course Notes Modal */}
      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Notes</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Write your course notes here..."
            value={courseNotes}
            onChange={(e) => setCourseNotes(e.target.value)}
          />
        </DialogContent>
      </Dialog>

      {/* Certificate Generation Modal */}
      <Dialog open={showCertificateForm} onOpenChange={setShowCertificateForm}>
        {" "}
        {/* Changed to setShowCertificateForm */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Certificate</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to generate the certificate with the name "{certificateName}"?</p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowCertificateForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateCertificate}>Generate</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Module Detail Dialog (kept from previous context for functionality) */}
      {selectedModule && (
        <Dialog open={!!selectedModule} onOpenChange={(open) => !open && setSelectedModule(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center">
                <span className="text-3xl mr-3">{selectedModule.icon}</span>
                {selectedModule.name}
              </DialogTitle>
            </DialogHeader>

            {/* This RegistrationForm is for module-specific registration, not overall course */}
            {/* {!isModuleRegistered ? (
              <RegistrationForm
                itemTitle={selectedModule.name}
                onSuccess={handleModuleRegistrationSuccess}
                onCancel={() => setSelectedModule(null)}
              />
            ) : detailedTrainingModuleContent[selectedModule.name] ? ( */}
            {detailedTrainingModuleContent[selectedModule.name] ? (
              <div className="mt-4">
                <p className="text-gray-700 mb-6">{detailedTrainingModuleContent[selectedModule.name].description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {detailedTrainingModuleContent[selectedModule.name].objectives.map(
                        (objective: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-sm">{objective}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">Key Topics</h3>
                    <ul className="space-y-2">
                      {detailedTrainingModuleContent[selectedModule.name].topics.map((topic: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs mr-2 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-sm">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p>No detailed content available for this module.</p>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
