"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Award, 
  Download, 
  Clock, 
  CheckCircle, 
  Circle, 
  BarChart2,
  FileSpreadsheet,
  FilePdf,
  PenTool,
  Send,
  Plus
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import CourseAnalytics from "./CourseAnalytics"
import CourseCertificate from "./CourseCertificate"
import SimpleMarkdown from "./SimpleMarkdown"

interface UserDashboardProps {
  courseId?: string
  userName?: string
}

interface DiscussionPost {
  id: string
  author: string
  content: string
  timestamp: Date
  replies: DiscussionReply[]
}

interface DiscussionReply {
  id: string
  author: string
  content: string
  timestamp: Date
}

interface ModuleType {
  id: string
  title: string
  content: string
  resources: {
    title: string
    type: string
    url: string
  }[]
  quiz: {
    question: string
    options: string[]
    correctAnswer: number
  }[]
}

export default function UserDashboard({ courseId = "1", userName = "User" }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedModules, setExpandedModules] = useState<{[key: string]: boolean}>({})
  const [moduleProgress, setModuleProgress] = useState<{[key: string]: boolean}>({})
  const [quizScores, setQuizScores] = useState<{[key: string]: number}>({})
  const [timeSpent, setTimeSpent] = useState<{[key: string]: number}>({})
  const [notes, setNotes] = useState<{[key: string]: string}>({})
  const [currentNote, setCurrentNote] = useState("")
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([])
  const [newPostContent, setNewPostContent] = useState("")
  const [replyContent, setReplyContent] = useState<{[key: string]: string}>({})
  const [showCertificate, setShowCertificate] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  // Mock course data
  const availableCourses = [
    {
      id: "1",
      title: "Steel Manufacturing Fundamentals",
      description: "Learn the core principles and processes of steel manufacturing in this comprehensive course.",
      level: "Intermediate",
      category: "Technical",
      duration: "6 weeks",
      modules: 6,
      instructor: "Dr. Rajesh Kumar",
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      objectives: [
        "Understand the basic principles of steel manufacturing",
        "Learn about different types of steel and their properties",
        "Master the safety protocols in steel production",
        "Analyze quality control measures in the manufacturing process"
      ],
      prerequisites: [
        "Basic understanding of metallurgy",
        "Familiarity with industrial processes"
      ]
    },
    {
      id: "2",
      title: "Quality Control in Manufacturing",
      description: "Master the techniques and methodologies for ensuring quality in steel manufacturing processes.",
      level: "Advanced",
      category: "Technical",
      duration: "8 weeks",
      modules: 8,
      instructor: "Dr. Priya Sharma",
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      objectives: [
        "Implement quality control systems in manufacturing",
        "Analyze and interpret quality data",
        "Apply statistical process control techniques",
        "Develop quality improvement strategies"
      ],
      prerequisites: [
        "Basic understanding of manufacturing processes",
        "Familiarity with statistical concepts"
      ]
    },
    {
      id: "3",
      title: "Advanced Steel Processing",
      description: "Explore advanced techniques in steel processing and manufacturing for specialized applications.",
      level: "Expert",
      category: "Technical",
      duration: "10 weeks",
      modules: 10,
      instructor: "Prof. Amit Patel",
      startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      objectives: [
        "Master advanced steel processing techniques",
        "Understand specialized steel applications",
        "Analyze complex manufacturing challenges",
        "Develop innovative solutions for steel processing"
      ],
      prerequisites: [
        "Strong background in metallurgy",
        "Experience with steel manufacturing processes",
        "Understanding of material science principles"
      ]
    }
  ];
  
  // Get the selected course or null if none selected
  const course = selectedCourseId ? availableCourses.find(c => c.id === selectedCourseId) : null;

  // Mock module data
  const moduleContent: ModuleType[] = [
    {
      id: "module-1",
      title: "Introduction to Steel Manufacturing",
      content: "# Introduction to Steel Manufacturing\n\nSteel is an alloy of iron and carbon, and sometimes other elements. Because of its high tensile strength and low cost, it is a major component used in buildings, infrastructure, tools, ships, automobiles, machines, appliances, and weapons.\n\n## History of Steel Production\n\nThe history of steel production and manufacturing can be traced back to ancient times. The earliest known production of steel is seen in pieces of ironware excavated from an archaeological site in Anatolia (Kaman-Kalehöyük) and are nearly 4,000 years old, dating from 1800 BCE.\n\n## Modern Steel Manufacturing Process\n\n1. **Iron Making**: The first step in making steel is to combine iron ore, coke, and lime in a blast furnace to produce molten iron.\n2. **Primary Steel Making**: The molten iron from the blast furnace is converted into steel in the Basic Oxygen Furnace (BOF).\n3. **Secondary Steel Making**: This involves treating the molten steel to adjust the composition.\n4. **Continuous Casting**: The molten steel is cast into solid slabs, blooms, or billets.\n5. **Primary Forming**: The cast steel is formed into various shapes by hot rolling, cold rolling, or forging.\n\nIn the next module, we will explore each of these steps in detail.",
      resources: [
        {
          title: "Steel Manufacturing Process Overview",
          type: "pdf",
          url: "/resources/steel-manufacturing-overview.pdf"
        },
        {
          title: "History of Steel Production",
          type: "video",
          url: "/resources/steel-history-video.mp4"
        }
      ],
      quiz: [
        {
          question: "What is steel primarily composed of?",
          options: ["Iron and Carbon", "Iron and Aluminum", "Carbon and Zinc", "Iron and Zinc"],
          correctAnswer: 0
        },
        {
          question: "Which of the following is NOT a step in modern steel manufacturing?",
          options: ["Iron Making", "Continuous Casting", "Chemical Separation", "Secondary Steel Making"],
          correctAnswer: 2
        }
      ]
    },
    {
      id: "module-2",
      title: "Types of Steel and Properties",
      content: "# Types of Steel and Properties\n\nSteel can be classified into various types based on its composition and properties. Understanding these classifications is crucial for selecting the right type of steel for specific applications.\n\n## Carbon Steel\n\n- **Low Carbon Steel (Mild Steel)**: Contains 0.04% to 0.3% carbon. It's malleable, ductile, and used for car bodies, wire, and sheets.\n- **Medium Carbon Steel**: Contains 0.3% to 0.6% carbon. Used for machinery, shafts, and axles.\n- **High Carbon Steel**: Contains 0.6% to 1.5% carbon. Used for cutting tools, springs, and high-strength wire.\n\n## Alloy Steel\n\nAlloy steels contain specific amounts of alloying elements like manganese, silicon, nickel, titanium, copper, chromium, and aluminum. These elements enhance properties like strength, hardness, and corrosion resistance.\n\n## Stainless Steel\n\nStainless steel contains a minimum of 10.5% chromium, which forms a passive layer of chromium oxide that prevents corrosion. Types include:\n\n- **Austenitic**: Non-magnetic, excellent corrosion resistance (e.g., 304, 316)\n- **Ferritic**: Magnetic, good corrosion resistance (e.g., 430)\n- **Martensitic**: Can be hardened by heat treatment (e.g., 420)\n- **Duplex**: Mixed structure with high strength and corrosion resistance\n\n## Tool Steel\n\nTool steels are known for their hardness, resistance to abrasion, and ability to hold a cutting edge at elevated temperatures. They're used for cutting and drilling tools.\n\nIn the next module, we'll explore the safety protocols essential for steel manufacturing environments.",
      resources: [
        {
          title: "Steel Types Comparison Chart",
          type: "excel",
          url: "/resources/steel-types-comparison.xlsx"
        },
        {
          title: "Properties of Stainless Steel",
          type: "pdf",
          url: "/resources/stainless-steel-properties.pdf"
        }
      ],
      quiz: [
        {
          question: "What is the carbon content range for low carbon steel?",
          options: ["0.04% to 0.3%", "0.3% to 0.6%", "0.6% to 1.5%", "Above 1.5%"],
          correctAnswer: 0
        },
        {
          question: "Which type of stainless steel can be hardened by heat treatment?",
          options: ["Austenitic", "Ferritic", "Martensitic", "Duplex"],
          correctAnswer: 2
        }
      ]
    },
    {
      id: "module-3",
      title: "Safety Protocols in Steel Production",
      content: "# Safety Protocols in Steel Production\n\nSafety is paramount in steel production due to the inherent hazards of working with high temperatures, heavy machinery, and potentially dangerous materials.\n\n## Common Hazards in Steel Manufacturing\n\n1. **Heat and Thermal Hazards**: Exposure to molten metal, hot surfaces, and high-temperature environments\n2. **Mechanical Hazards**: Moving machinery, falling objects, and handling heavy materials\n3. **Chemical Hazards**: Exposure to dust, fumes, gases, and other chemicals\n4. **Noise Hazards**: High noise levels from machinery and processes\n5. **Electrical Hazards**: Risks associated with high-voltage equipment\n\n## Personal Protective Equipment (PPE)\n\nProper PPE is essential and typically includes:\n\n- Heat-resistant clothing and gloves\n- Safety helmets with face shields\n- Safety footwear with metatarsal protection\n- Respiratory protection\n- Hearing protection\n- Eye protection\n\n## Safety Procedures\n\n1. **Lockout/Tagout (LOTO)**: Procedures to ensure machinery is properly shut off and cannot be started during maintenance\n2. **Hot Work Permits**: Required for any work involving open flames or generating heat and sparks\n3. **Confined Space Entry**: Protocols for safely entering and working in confined spaces\n4. **Emergency Response**: Procedures for fires, spills, medical emergencies, and evacuations\n\n## Safety Training\n\nAll personnel must receive comprehensive safety training, including:\n\n- Hazard recognition and prevention\n- Proper use of PPE\n- Emergency procedures\n- First aid and CPR\n- Specific job safety procedures\n\nIn the next module, we'll discuss quality control measures in steel manufacturing.",
      resources: [
        {
          title: "Steel Industry Safety Manual",
          type: "pdf",
          url: "/resources/safety-manual.pdf"
        },
        {
          title: "PPE Requirements Checklist",
          type: "excel",
          url: "/resources/ppe-checklist.xlsx"
        }
      ],
      quiz: [
        {
          question: "What does LOTO stand for in safety procedures?",
          options: ["Light On Turn Off", "Lockout/Tagout", "Low Temperature Operation", "Long Term Operational Training"],
          correctAnswer: 1
        },
        {
          question: "Which of the following is NOT typically part of PPE in steel manufacturing?",
          options: ["Heat-resistant gloves", "Respiratory protection", "Radiation badges", "Safety footwear"],
          correctAnswer: 2
        }
      ]
    },
    {
      id: "module-4",
      title: "Quality Control in Manufacturing",
      content: "# Quality Control in Manufacturing\n\nQuality control is essential in steel manufacturing to ensure products meet specifications and customer requirements.\n\n## Quality Control Methods\n\n1. **Visual Inspection**: Examining steel products for surface defects, dimensions, and finish\n2. **Non-Destructive Testing (NDT)**:\n   - Ultrasonic testing to detect internal flaws\n   - Magnetic particle inspection for surface and near-surface defects\n   - Radiographic testing using X-rays or gamma rays\n   - Eddy current testing for surface defects\n3. **Mechanical Testing**:\n   - Tensile testing for strength and ductility\n   - Hardness testing (Brinell, Rockwell, Vickers)\n   - Impact testing for toughness\n   - Fatigue testing for long-term performance\n4. **Chemical Analysis**:\n   - Spectrometry for composition analysis\n   - Carbon and sulfur analysis\n\n## Statistical Process Control (SPC)\n\nSPC involves using statistical methods to monitor and control a process, including:\n\n- Control charts to track process variables\n- Capability analysis to assess process performance\n- Sampling plans for inspection\n\n## Quality Management Systems\n\nMany steel manufacturers implement quality management systems such as:\n\n- ISO 9001: Quality Management System\n- IATF 16949: Automotive Quality Management System\n- API Q1: Quality Management System for the petroleum and natural gas industry\n\n## Continuous Improvement\n\nQuality control is not just about detecting defects but also about continuous improvement through:\n\n- Root cause analysis of defects\n- Corrective and preventive actions\n- Process optimization\n- Employee training and engagement\n\nIn the next module, we'll explore advanced steel processing techniques.",
      resources: [
        {
          title: "Quality Control Procedures",
          type: "pdf",
          url: "/resources/quality-control-procedures.pdf"
        },
        {
          title: "NDT Methods Comparison",
          type: "excel",
          url: "/resources/ndt-methods.xlsx"
        }
      ],
      quiz: [
        {
          question: "Which of the following is a non-destructive testing method?",
          options: ["Tensile testing", "Hardness testing", "Ultrasonic testing", "Fatigue testing"],
          correctAnswer: 2
        },
        {
          question: "What does SPC stand for in quality control?",
          options: ["Standard Production Control", "Statistical Process Control", "System Performance Check", "Steel Production Certification"],
          correctAnswer: 1
        }
      ]
    },
    {
      id: "module-5",
      title: "Advanced Steel Processing",
      content: "# Advanced Steel Processing\n\nAdvanced steel processing techniques allow for the production of steel with enhanced properties for specialized applications.\n\n## Heat Treatment Processes\n\n1. **Annealing**: Heating steel to a specific temperature and then cooling it slowly to reduce hardness and increase ductility\n2. **Normalizing**: Heating steel above its critical temperature and then cooling it in still air to improve strength and toughness\n3. **Quenching**: Rapid cooling of steel to increase hardness and strength\n4. **Tempering**: Reheating quenched steel to a temperature below its critical point to reduce brittleness while maintaining hardness\n5. **Case Hardening**: Surface hardening techniques like carburizing, nitriding, and induction hardening\n\n## Thermomechanical Processing\n\nThermomechanical processing combines deformation (rolling, forging) with thermal treatments to achieve desired microstructures and properties:\n\n- Controlled rolling\n- Accelerated cooling\n- Direct quenching\n\n## Advanced High-Strength Steels (AHSS)\n\nAHSS are a group of steels designed for improved strength and formability:\n\n- Dual Phase (DP) steels\n- Transformation-Induced Plasticity (TRIP) steels\n- Complex Phase (CP) steels\n- Martensitic steels\n- Twinning-Induced Plasticity (TWIP) steels\n\n## Surface Engineering\n\nSurface engineering techniques improve surface properties:\n\n- Galvanizing (zinc coating)\n- Aluminizing\n- Chromizing\n- Physical Vapor Deposition (PVD)\n- Chemical Vapor Deposition (CVD)\n\nIn the final module, we'll discuss future trends in steel manufacturing.",
      resources: [
        {
          title: "Heat Treatment Processes Guide",
          type: "pdf",
          url: "/resources/heat-treatment-guide.pdf"
        },
        {
          title: "Advanced High-Strength Steels Applications",
          type: "presentation",
          url: "/resources/ahss-applications.pptx"
        }
      ],
      quiz: [
        {
          question: "Which heat treatment process involves rapid cooling of steel?",
          options: ["Annealing", "Normalizing", "Quenching", "Tempering"],
          correctAnswer: 2
        },
        {
          question: "What does TRIP stand for in Advanced High-Strength Steels?",
          options: ["Thermal Resistance In Production", "Transformation-Induced Plasticity", "Toughness Reinforced Iron Process", "Temperature Regulated Internal Properties"],
          correctAnswer: 1
        }
      ]
    },
    {
      id: "module-6",
      title: "Future Trends in Steel Industry",
      content: "# Future Trends in Steel Industry\n\nThe steel industry is evolving to address challenges related to sustainability, efficiency, and new applications.\n\n## Sustainable Steel Production\n\n1. **Carbon Reduction Technologies**:\n   - Hydrogen-based direct reduction\n   - Carbon capture, utilization, and storage (CCUS)\n   - Biomass and waste utilization\n   - Electrolysis of iron ore\n\n2. **Energy Efficiency**:\n   - Waste heat recovery\n   - Process optimization\n   - Advanced sensors and controls\n\n3. **Circular Economy**:\n   - Increased scrap utilization\n   - By-product recovery and utilization\n   - Design for recyclability\n\n## Industry 4.0 in Steel Manufacturing\n\n1. **Digitalization**:\n   - Digital twins of production processes\n   - Predictive maintenance\n   - Real-time quality monitoring\n\n2. **Automation and Robotics**:\n   - Autonomous vehicles in plants\n   - Robotic inspection and maintenance\n   - Automated material handling\n\n3. **Artificial Intelligence and Machine Learning**:\n   - Process optimization\n   - Quality prediction\n   - Energy management\n\n## New Steel Products and Applications\n\n1. **Ultra-High-Strength Steels**:\n   - For lightweight automotive applications\n   - For high-rise construction\n\n2. **Functional Steels**:\n   - Self-healing steels\n   - Steels with enhanced electromagnetic properties\n   - Steels with improved corrosion resistance\n\n3. **Additive Manufacturing with Steel**:\n   - 3D printing of complex steel components\n   - Rapid prototyping and production\n\nThis concludes our course on Steel Manufacturing Fundamentals. You now have a comprehensive understanding of steel production processes, properties, safety protocols, quality control, advanced processing, and future trends in the industry.",
      resources: [
        {
          title: "Future of Steel Manufacturing Report",
          type: "pdf",
          url: "/resources/future-steel-report.pdf"
        },
        {
          title: "Industry 4.0 in Steel Production",
          type: "video",
          url: "/resources/industry4-steel-video.mp4"
        }
      ],
      quiz: [
        {
          question: "Which of the following is a carbon reduction technology in steel production?",
          options: ["Blast furnace optimization", "Basic oxygen furnace enhancement", "Hydrogen-based direct reduction", "Continuous casting improvement"],
          correctAnswer: 2
        },
        {
          question: "What does CCUS stand for in sustainable steel production?",
          options: ["Carbon Cleaning Using Steam", "Continuous Casting Under Supervision", "Carbon Capture, Utilization, and Storage", "Controlled Cooling of Unfinished Steel"],
          correctAnswer: 2
        }
      ]
    }
  ]

  // Initialize state from localStorage
  useEffect(() => {
    // Load progress
    const savedProgress = localStorage.getItem(`course-${courseId}-progress`)
    if (savedProgress) {
      setModuleProgress(JSON.parse(savedProgress))
    } else {
      const initialProgress = moduleContent.reduce((acc, module) => {
        acc[module.id] = false
        return acc
      }, {} as {[key: string]: boolean})
      setModuleProgress(initialProgress)
    }

    // Load quiz scores
    const savedQuizScores = localStorage.getItem(`course-${courseId}-quiz-scores`)
    if (savedQuizScores) {
      setQuizScores(JSON.parse(savedQuizScores))
    } else {
      const initialScores = moduleContent.reduce((acc, module) => {
        acc[module.id] = 0
        return acc
      }, {} as {[key: string]: number})
      setQuizScores(initialScores)
    }

    // Load time spent
    const savedTimeSpent = localStorage.getItem(`course-${courseId}-time-spent`)
    if (savedTimeSpent) {
      setTimeSpent(JSON.parse(savedTimeSpent))
    } else {
      const initialTime = moduleContent.reduce((acc, module) => {
        acc[module.id] = 0
        return acc
      }, {} as {[key: string]: number})
      setTimeSpent(initialTime)
    }

    // Load notes
    const savedNotes = localStorage.getItem(`course-${courseId}-notes`)
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }

    // Load discussion posts
    const savedPosts = localStorage.getItem(`course-${courseId}-discussions`)
    if (savedPosts) {
      setDiscussionPosts(JSON.parse(savedPosts))
    }

    // Load achievements
    const savedAchievements = localStorage.getItem(`course-${courseId}-achievements`)
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    } else {
      setAchievements([])
    }

    // Check if certificate should be available
    const allModulesCompleted = moduleContent.every(module => 
      localStorage.getItem(`course-${courseId}-progress`) ? 
        JSON.parse(localStorage.getItem(`course-${courseId}-progress`) || '{}')[module.id] : 
        false
    )
    setShowCertificate(allModulesCompleted)
  }, [courseId])

  // Save state to localStorage when it changes
  useEffect(() => {
    if (Object.keys(moduleProgress).length > 0) {
      localStorage.setItem(`course-${courseId}-progress`, JSON.stringify(moduleProgress))
      
      // Check if all modules are completed to enable certificate
      const allModulesCompleted = moduleContent.every(module => moduleProgress[module.id])
      setShowCertificate(allModulesCompleted)
      
      // Add achievement if all modules completed
      if (allModulesCompleted && !achievements.includes('course-completed')) {
        const newAchievements = [...achievements, 'course-completed']
        setAchievements(newAchievements)
        localStorage.setItem(`course-${courseId}-achievements`, JSON.stringify(newAchievements))
      }
    }
  }, [moduleProgress, courseId, achievements])

  useEffect(() => {
    if (Object.keys(quizScores).length > 0) {
      localStorage.setItem(`course-${courseId}-quiz-scores`, JSON.stringify(quizScores))
      
      // Add achievement for perfect quiz score
      const hasPerfectScore = Object.values(quizScores).some(score => score === 100)
      if (hasPerfectScore && !achievements.includes('perfect-score')) {
        const newAchievements = [...achievements, 'perfect-score']
        setAchievements(newAchievements)
        localStorage.setItem(`course-${courseId}-achievements`, JSON.stringify(newAchievements))
      }
    }
  }, [quizScores, courseId, achievements])

  useEffect(() => {
    if (Object.keys(timeSpent).length > 0) {
      localStorage.setItem(`course-${courseId}-time-spent`, JSON.stringify(timeSpent))
      
      // Add achievement for dedicated learner (>120 minutes)
      const totalTime = Object.values(timeSpent).reduce((sum, time) => sum + time, 0)
      if (totalTime > 120 && !achievements.includes('dedicated-learner')) {
        const newAchievements = [...achievements, 'dedicated-learner']
        setAchievements(newAchievements)
        localStorage.setItem(`course-${courseId}-achievements`, JSON.stringify(newAchievements))
      }
    }
  }, [timeSpent, courseId, achievements])

  useEffect(() => {
    if (Object.keys(notes).length > 0) {
      localStorage.setItem(`course-${courseId}-notes`, JSON.stringify(notes))
    }
  }, [notes, courseId])

  useEffect(() => {
    if (discussionPosts.length > 0) {
      localStorage.setItem(`course-${courseId}-discussions`, JSON.stringify(discussionPosts))
      
      // Add achievement for first discussion post
      if (!achievements.includes('first-post')) {
        const newAchievements = [...achievements, 'first-post']
        setAchievements(newAchievements)
        localStorage.setItem(`course-${courseId}-achievements`, JSON.stringify(newAchievements))
      }
    }
  }, [discussionPosts, courseId, achievements])

  // Track time spent on active module
  useEffect(() => {
    if (activeTab === "content") {
      const timer = setInterval(() => {
        const activeModuleId = Object.keys(expandedModules).find(key => expandedModules[key])
        if (activeModuleId) {
          setTimeSpent(prev => ({
            ...prev,
            [activeModuleId]: (prev[activeModuleId] || 0) + 1
          }))
        }
      }, 60000) // Update every minute

      return () => clearInterval(timer)
    }
  }, [activeTab, expandedModules])

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => {
      // Close all other modules
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false
        return acc
      }, {} as {[key: string]: boolean})
      
      // Toggle the clicked module
      newState[moduleId] = !prev[moduleId]
      return newState
    })
  }

  const handleModuleCompletion = (moduleId: string) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const handleQuizSubmission = (moduleId: string) => {
    // Simulate quiz score (70-100%)
    const score = Math.floor(Math.random() * 31) + 70
    setQuizScores(prev => ({
      ...prev,
      [moduleId]: score
    }))

    // Automatically mark module as complete if score is above 70%
    if (score >= 70 && !moduleProgress[moduleId]) {
      handleModuleCompletion(moduleId)
    }
  }

  const handleSaveNote = () => {
    if (editingModuleId && currentNote.trim()) {
      setNotes(prev => ({
        ...prev,
        [editingModuleId]: currentNote
      }))
      setCurrentNote("")
      setEditingModuleId(null)
    }
  }

  const handleAddPost = () => {
    if (newPostContent.trim()) {
      const newPost: DiscussionPost = {
        id: Date.now().toString(),
        author: userName,
        content: newPostContent,
        timestamp: new Date(),
        replies: []
      }
      setDiscussionPosts(prev => [newPost, ...prev])
      setNewPostContent("")
    }
  }

  const handleAddReply = (postId: string) => {
    const replyText = replyContent[postId]
    if (replyText && replyText.trim()) {
      const newReply: DiscussionReply = {
        id: Date.now().toString(),
        author: userName,
        content: replyText,
        timestamp: new Date()
      }
      
      setDiscussionPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, newReply]
          }
        }
        return post
      }))
      
      setReplyContent(prev => ({
        ...prev,
        [postId]: ""
      }))
    }
  }

  const handleDownloadResource = (resource: { title: string, type: string, url: string }) => {
    // In a real application, this would trigger a download
    alert(`Downloading ${resource.title}`)
  }

  // Calculate progress metrics
  const totalModules = moduleContent.length
  const completedModules = Object.values(moduleProgress).filter(Boolean).length
  const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
  const averageQuizScore = Object.values(quizScores).length > 0 
    ? Math.round(Object.values(quizScores).reduce((sum, score) => sum + score, 0) / Object.values(quizScores).length) 
    : 0
  const totalTimeSpent = Object.values(timeSpent).reduce((sum, time) => sum + time, 0)

  return (
    <div className="space-y-6">
      {!course ? (
        // Course Selection Interface
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Learning Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userName}</p>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Select a Course to Continue</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableCourses.map((availableCourse) => (
              <Card key={availableCourse.id} className="cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => setSelectedCourseId(availableCourse.id)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{availableCourse.title}</CardTitle>
                  <CardDescription>
                    {availableCourse.category} | {availableCourse.level}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{availableCourse.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{availableCourse.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{availableCourse.modules} Modules</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full" onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedCourseId(availableCourse.id); 
                  }}>
                    Select Course
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        // Course Content when a course is selected
        <>
          {/* Course Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">Welcome back, {userName}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedCourseId(null)}>
                <BookOpen className="mr-2 h-4 w-4" />
                Change Course
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("resources")}>
                <FileText className="mr-2 h-4 w-4" />
                Resources
              </Button>
              {showCertificate && (
                <Button onClick={() => setActiveTab("certificate")}>
                  <Award className="mr-2 h-4 w-4" />
                  View Certificate
                </Button>
              )}
            </div>
          </div>

      {/* Progress Overview */}
      {course && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{completedModules}/{totalModules} Modules</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{averageQuizScore}%</p>
                    <p className="text-xs text-muted-foreground">Average Score</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{Math.floor(totalTimeSpent / 60)}h {totalTimeSpent % 60}m</p>
                    <p className="text-xs text-muted-foreground">Time Spent</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      {course && achievements.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.includes('course-completed') && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <Award className="mr-1 h-3 w-3" />
                  Course Completed
                </Badge>
              )}
              {achievements.includes('perfect-score') && (
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  <Award className="mr-1 h-3 w-3" />
                  Perfect Score
                </Badge>
              )}
              {achievements.includes('dedicated-learner') && (
                <Badge className="bg-purple-500 hover:bg-purple-600">
                  <Clock className="mr-1 h-3 w-3" />
                  Dedicated Learner
                </Badge>
              )}
              {achievements.includes('first-post') && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  Discussion Starter
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs - Only show when a course is selected */}
      {course && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          {showCertificate && (
            <TabsTrigger value="certificate" className="hidden md:block">Certificate</TabsTrigger>
          )}
          <TabsTrigger value="analytics" className="hidden md:block">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">{course.duration}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Modules</p>
                  <p className="text-sm text-muted-foreground">{course.modules} modules</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Level</p>
                  <p className="text-sm text-muted-foreground">{course.level}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{course.category}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Instructor</p>
                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">{course.startDate.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Learning Objectives</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {course.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Prerequisites</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {course.prerequisites.map((prerequisite, index) => (
                    <li key={index}>{prerequisite}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moduleContent.map((module, index) => (
                  <div key={module.id} className="flex items-center gap-3">
                    {moduleProgress[module.id] ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{module.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Quiz: {quizScores[module.id] || 0}%</span>
                        <span>•</span>
                        <span>Time: {timeSpent[module.id] || 0} min</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-shrink-0"
                      onClick={() => {
                        setActiveTab("content")
                        setTimeout(() => toggleModuleExpansion(module.id), 100)
                      }}
                    >
                      {moduleProgress[module.id] ? "Review" : "Start"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {moduleContent.map((module, index) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="hover:bg-gray-50 px-4 py-2 rounded-md">
                  <div className="flex items-center gap-3 text-left">
                    {moduleProgress[module.id] ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{module.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {quizScores[module.id] > 0 && <span>Quiz: {quizScores[module.id]}%</span>}
                        {quizScores[module.id] > 0 && timeSpent[module.id] > 0 && <span>•</span>}
                        {timeSpent[module.id] > 0 && <span>Time: {timeSpent[module.id]} min</span>}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4">
                  <div className="space-y-4">
                    {/* Module Content */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="prose prose-sm max-w-none">
                          <SimpleMarkdown>{module.content}</SimpleMarkdown>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Module Resources */}
                    {module.resources.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Module Resources</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {module.resources.map((resource, resourceIndex) => (
                              <div key={resourceIndex} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {resource.type === 'pdf' && <FilePdf className="h-4 w-4 text-red-500" />}
                                  {resource.type === 'excel' && <FileSpreadsheet className="h-4 w-4 text-green-500" />}
                                  {resource.type === 'video' && <Play className="h-4 w-4 text-blue-500" />}
                                  {resource.type === 'presentation' && <FileText className="h-4 w-4 text-orange-500" />}
                                  <span className="text-sm">{resource.title}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDownloadResource(resource)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Quiz */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Module Quiz</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {module.quiz.map((quizItem, quizIndex) => (
                            <div key={quizIndex} className="space-y-2">
                              <p className="font-medium">{quizIndex + 1}. {quizItem.question}</p>
                              <div className="space-y-1">
                                {quizItem.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <input 
                                      type="radio" 
                                      id={`${module.id}-q${quizIndex}-o${optionIndex}`} 
                                      name={`${module.id}-q${quizIndex}`} 
                                      className="h-4 w-4 text-primary"
                                    />
                                    <label 
                                      htmlFor={`${module.id}-q${quizIndex}-o${optionIndex}`}
                                      className="text-sm"
                                    >
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline"
                          onClick={() => handleModuleCompletion(module.id)}
                        >
                          {moduleProgress[module.id] ? "Mark as Incomplete" : "Mark as Complete"}
                        </Button>
                        <Button onClick={() => handleQuizSubmission(module.id)}>
                          Submit Quiz
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Notes */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Your Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {notes[module.id] ? (
                          <div className="space-y-2">
                            <p className="text-sm whitespace-pre-wrap">{notes[module.id]}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setCurrentNote(notes[module.id])
                                setEditingModuleId(module.id)
                              }}
                            >
                              <PenTool className="h-4 w-4 mr-2" />
                              Edit Notes
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setCurrentNote("")
                              setEditingModuleId(module.id)
                            }}
                          >
                            <PenTool className="h-4 w-4 mr-2" />
                            Add Notes
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
              <CardDescription>Download materials to support your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">PDF Documents</h3>
                  <div className="space-y-2">
                    {moduleContent.flatMap(module => 
                      module.resources.filter(r => r.type === 'pdf')
                    ).map((resource, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FilePdf className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{resource.title}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadResource(resource)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Spreadsheets</h3>
                  <div className="space-y-2">
                    {moduleContent.flatMap(module => 
                      module.resources.filter(r => r.type === 'excel')
                    ).map((resource, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{resource.title}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadResource(resource)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Videos</h3>
                  <div className="space-y-2">
                    {moduleContent.flatMap(module => 
                      module.resources.filter(r => r.type === 'video')
                    ).map((resource, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{resource.title}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadResource(resource)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Presentations</h3>
                  <div className="space-y-2">
                    {moduleContent.flatMap(module => 
                      module.resources.filter(r => r.type === 'presentation')
                    ).map((resource, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{resource.title}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadResource(resource)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discussion Board</CardTitle>
              <CardDescription>Engage with other learners and instructors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-post">New Post</Label>
                  <Textarea 
                    id="new-post" 
                    placeholder="Share your thoughts or questions..." 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <Button 
                    className="mt-2" 
                    onClick={handleAddPost}
                    disabled={!newPostContent.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>

                <div className="space-y-4">
                  {discussionPosts.length > 0 ? (
                    discussionPosts.map(post => (
                      <Card key={post.id} className="border border-gray-200">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 p-1 rounded-full">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <p className="font-medium">{post.author}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {post.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                          
                          {/* Replies */}
                          {post.replies.length > 0 && (
                            <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
                              {post.replies.map(reply => (
                                <div key={reply.id} className="space-y-1">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                      <div className="bg-primary/10 p-1 rounded-full">
                                        <User className="h-3 w-3 text-primary" />
                                      </div>
                                      <p className="text-sm font-medium">{reply.author}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {reply.timestamp.toLocaleString()}
                                    </p>
                                  </div>
                                  <p className="text-sm pl-5 whitespace-pre-wrap">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Reply Form */}
                          <div className="mt-4 flex gap-2">
                            <Input 
                              placeholder="Write a reply..." 
                              value={replyContent[post.id] || ''}
                              onChange={(e) => setReplyContent(prev => ({
                                ...prev,
                                [post.id]: e.target.value
                              }))}
                              className="text-sm"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleAddReply(post.id)}
                              disabled={!replyContent[post.id]?.trim()}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No discussions yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificate Tab */}
        <TabsContent value="certificate" className="space-y-4">
          {showCertificate ? (
            <CourseCertificate 
              course={course} 
              userName={userName} 
              previewMode={true}
              completionDate={new Date()}
              averageScore={averageQuizScore}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Trophy className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Certificate Not Available</h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  Complete all modules to earn your course certificate. You've completed {completedModules} out of {totalModules} modules.
                </p>
                <Progress value={progress} className="h-2 w-full max-w-md mb-6" />
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("content")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <CourseAnalytics 
            courseId={courseId} 
            courseName={course.title} 
            userName={userName} 
          />
        </TabsContent>
      </Tabs>
      )}

      {/* Notes Dialog - Only show when a course is selected */}
      {course && (
        <Dialog open={!!editingModuleId} onOpenChange={(open) => !open && setEditingModuleId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Notes</DialogTitle>
              <DialogDescription>
                {editingModuleId && moduleContent.find(m => m.id === editingModuleId)?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Textarea 
                placeholder="Write your notes here..." 
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingModuleId(null)}>Cancel</Button>
              <Button onClick={handleSaveNote}>Save Notes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Missing component imports
const User = MessageSquare
const Play = FileText
const Trophy = Award