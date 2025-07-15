import type {
  Course,
  Facility,
  Achievement, // This is now the summary object type
  UserAchievement, // New type for individual user achievements
  UpcomingProgram,
  Testimonial,
  TechNews,
  DetailedTrainingModuleContent,
  DiscussionPost, // Ensure DiscussionPost is imported
  ChartData,
  DetailedTrainingPathContent, // Use the correct type
  LearnerProgress, // New import
  TeamReport, // New import
  ModuleEngagement, // New import
  CertificateTracking, // New import
} from "./types"
import { slugify } from "./slug-utils" // Import slugify
import type { TrainingModule, TrainingPath } from "./types"

// Helper function to generate detailed content for modules
function generateDetailedModuleSections(moduleTitle: string, numSections = 5) {
  const baseSections = [
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

  // Add more sections if numSections is greater than baseSections.length
  for (let i = baseSections.length; i < numSections; i++) {
    baseSections.push({
      title: `Advanced Topic ${i + 1}`,
      content: `
        <h4 class="text-lg font-semibold mb-2">Deep Dive into Advanced Topic ${i + 1} of ${moduleTitle}</h4>
        <p class="mb-3">This section delves into more advanced aspects and nuances of ${moduleTitle.toLowerCase()}, building upon the core concepts and practical applications.</p>
        <p class="mb-3">We will explore complex scenarios, cutting-edge techniques, and recent developments in this field. This content is designed for learners who wish to gain a deeper, more specialized understanding.</p>
        <h5 class="font-medium mb-2">Key Areas Covered:</h5>
        <ul class="list-disc pl-5 mb-3">
          <li>Detailed analysis of specific sub-topics</li>
          <li>Advanced methodologies and tools</li>
          <li>Troubleshooting complex issues</li>
          <li>Integration with other systems/disciplines</li>
        </ul>
        <div class="bg-orange-50 p-3 rounded-md">
          <h5 class="font-medium mb-1">Expert Insight:</h5>
          <p>An expert's perspective on the challenges and opportunities related to this advanced topic, drawing from real-world experience in the steel industry.</p>
        </div>
      `,
      duration: "1 hour",
    })
  }

  return baseSections.slice(0, numSections)
}

export const courses: Course[] = [
  {
    id: 1,
    title: "Office 365",
    desc: "Master the Office productivity suite for business needs.",
    category: "Digital Tools",
    level: "Beginner",
    duration: "40 hours",
    modules: 8,
    objectives: [
      "Master Word, Excel, PowerPoint, and Outlook",
      "Collaborate effectively using Teams and SharePoint",
      "Manage email and calendar efficiently",
      "Create professional presentations and reports",
    ],
    curriculum: [
      "Week 1: Word Processing Fundamentals",
      "Week 2: Excel Basics and Formulas",
      "Week 3: PowerPoint Design Principles",
      "Week 4: Outlook Email Management",
      "Week 5: Teams Collaboration",
      "Week 6: SharePoint Document Management",
      "Week 7: Advanced Features Integration",
      "Week 8: Project-based Assessment",
    ],
    prerequisites: "Basic computer knowledge",
    certification: "Microsoft Office Specialist",
  },
  {
    id: 2,
    title: "Computer Training for Cluster",
    desc: "Basic digital literacy and system usage training.",
    category: "Digital Tools",
    level: "Beginner",
    duration: "24 hours",
    modules: 6,
    objectives: [
      "Understand computer fundamentals",
      "Navigate operating systems effectively",
      "Use basic software applications",
      "Practice digital safety and security",
    ],
    curriculum: [
      "Week 1: Computer Hardware Basics",
      "Week 2: Operating System Navigation",
      "Week 3: File Management",
      "Week 4: Internet and Email Basics",
      "Week 5: Basic Troubleshooting",
      "Week 6: Digital Security Best Practices",
    ],
    prerequisites: "None",
    certification: "Digital Literacy Certificate",
  },
  {
    id: 3,
    title: "Microsoft Excel - Basic",
    desc: "Learn the fundamentals of Microsoft Excel.",
    category: "Digital Tools",
    level: "Beginner",
    duration: "32 hours",
    modules: 8,
    objectives: [
      "Create and format spreadsheets",
      "Use basic formulas and functions",
      "Create charts and graphs",
      "Manage data effectively",
    ],
    curriculum: [
      "Week 1: Excel Interface and Navigation",
      "Week 2: Data Entry and Formatting",
      "Week 3: Basic Formulas and Functions",
      "Week 4: Working with Charts",
      "Week 5: Data Sorting and Filtering",
      "Week 6: Print Setup and Page Layout",
      "Week 7: Basic Data Analysis",
      "Week 8: Practical Applications",
    ],
    prerequisites: "Basic computer skills",
    certification: "Excel Basic Proficiency",
  },
  {
    id: 4,
    title: "Advanced Microsoft Excel",
    desc: "Advanced tools and features in Excel for data professionals.",
    category: "Digital Tools",
    level: "Advanced",
    duration: "48 hours",
    modules: 12,
    objectives: [
      "Master advanced formulas and functions",
      "Create dynamic dashboards",
      "Use pivot tables and data analysis tools",
      "Automate tasks with macros",
    ],
    curriculum: [
      "Week 1-2: Advanced Formulas (VLOOKUP, INDEX, MATCH)",
      "Week 3-4: Pivot Tables and Pivot Charts",
      "Week 5-6: Data Analysis Tools",
      "Week 7-8: Dashboard Creation",
      "Week 9-10: VBA and Macro Programming",
      "Week 11-12: Advanced Data Modeling",
    ],
    prerequisites: "Excel Basic course completion",
    certification: "Excel Advanced Professional",
  },
  {
    id: 5,
    title: "React JS",
    desc: "Build modern web applications using React framework.",
    category: "Technical",
    level: "Intermediate",
    duration: "60 hours",
    modules: 15,
    objectives: [
      "Build interactive web applications",
      "Master React components and hooks",
      "Implement state management",
      "Deploy production-ready applications",
    ],
    curriculum: [
      "Week 1-2: JavaScript ES6+ Fundamentals",
      "Week 3-4: React Components and JSX",
      "Week 5-6: State and Props Management",
      "Week 7-8: React Hooks",
      "Week 9-10: Routing and Navigation",
      "Week 11-12: API Integration",
      "Week 13-14: Testing and Debugging",
      "Week 15: Deployment and Best Practices",
    ],
    prerequisites: "HTML, CSS, JavaScript knowledge",
    certification: "React Developer Certificate",
  },
  {
    id: 6,
    title: "SAP PM (Plant Maintenance)",
    desc: "Understand SAP's Plant Maintenance module.",
    category: "Technical",
    level: "Intermediate",
    duration: "80 hours",
    modules: 20,
    objectives: [
      "Master SAP PM module functionality",
      "Manage maintenance orders and work orders",
      "Handle equipment and asset management",
      "Generate maintenance reports",
    ],
    curriculum: [
      "Week 1-2: SAP PM Introduction and Navigation",
      "Week 3-4: Equipment Master Data",
      "Week 5-6: Maintenance Planning",
      "Week 7-8: Work Order Management",
      "Week 9-10: Preventive Maintenance",
      "Week 11-12: Material Management Integration",
      "Week 13-14: Cost Management",
      "Week 15-16: Reporting and Analytics",
      "Week 17-18: Mobile Plant Maintenance",
      "Week 19-20: Project Implementation",
    ],
    prerequisites: "Basic SAP knowledge recommended",
    certification: "SAP PM Certified Professional",
  },
  {
    id: 7,
    title: "Data Analytics & Data Science",
    desc: "Explore data insights and develop predictive models.",
    category: "Technical",
    level: "Advanced",
    duration: "100 hours",
    modules: 25,
    objectives: [
      "Analyze complex datasets",
      "Build predictive models",
      "Use statistical analysis tools",
      "Present data-driven insights",
    ],
    curriculum: [
      "Week 1-2: Statistics and Probability",
      "Week 3-4: Python for Data Science",
      "Week 5-6: Data Cleaning and Preparation",
      "Week 7-8: Exploratory Data Analysis",
      "Week 9-10: Machine Learning Basics",
      "Week 11-12: Supervised Learning",
      "Week 13-14: Unsupervised Learning",
      "Week 15-16: Deep Learning Introduction",
      "Week 17-18: Big Data Technologies",
      "Week 19-20: Data Visualization",
      "Week 21-22: A/B Testing and Experimentation",
      "Week 23-24: Model Deployment",
      "Week 25: Capstone Project",
    ],
    prerequisites: "Statistics background helpful",
    certification: "Data Science Professional",
  },
  {
    id: 8,
    title: "Visualization - Tableau",
    desc: "Create compelling dashboards and data stories with Tableau.",
    category: "Digital Tools",
    level: "Intermediate",
    duration: "40 hours",
    modules: 10,
    objectives: [
      "Create interactive dashboards",
      "Design compelling visualizations",
      "Connect to various data sources",
      "Share insights effectively",
    ],
    curriculum: [
      "Week 1: Tableau Desktop Introduction",
      "Week 2: Data Connections and Preparation",
      "Week 3: Basic Chart Types",
      "Week 4: Advanced Visualizations",
      "Week 5: Dashboard Design Principles",
      "Week 6: Interactive Features",
      "Week 7: Calculated Fields and Parameters",
      "Week 8: Data Blending and Joins",
      "Week 9: Publishing and Sharing",
      "Week 10: Advanced Analytics Features",
    ],
    prerequisites: "Basic data analysis knowledge",
    certification: "Tableau Desktop Specialist",
  },
  {
    id: 9,
    title: "Power Automate",
    desc: "Automate repetitive tasks and workflows with Power Automate.",
    category: "Digital Tools",
    level: "Intermediate",
    duration: "32 hours",
    modules: 8,
    objectives: [
      "Design automated workflows",
      "Integrate multiple applications",
      "Reduce manual tasks",
      "Monitor and optimize flows",
    ],
    curriculum: [
      "Week 1: Power Platform Overview",
      "Week 2: Flow Creation Basics",
      "Week 3: Triggers and Actions",
      "Week 4: Conditional Logic",
      "Week 5: Data Operations",
      "Week 6: Integration with Office 365",
      "Week 7: Error Handling and Testing",
      "Week 8: Advanced Scenarios and Best Practices",
    ],
    prerequisites: "Office 365 familiarity",
    certification: "Power Platform Fundamentals",
  },
  {
    id: 10,
    title: "Generative AI & Creativity",
    desc: "Explore how Generative AI is transforming work and innovation.",
    category: "Emerging Tech",
    level: "Beginner",
    duration: "24 hours",
    modules: 6,
    objectives: [
      "Understand AI fundamentals",
      "Use AI tools for productivity",
      "Explore creative applications",
      "Implement AI in daily work",
    ],
    curriculum: [
      "Week 1: AI and Machine Learning Basics",
      "Week 2: Generative AI Applications",
      "Week 3: Prompt Engineering",
      "Week 4: AI Tools for Content Creation",
      "Week 5: Ethics and Responsible AI",
      "Week 6: Future of AI in Industry",
    ],
    prerequisites: "None",
    certification: "AI Literacy Certificate",
  },
  {
    id: 11,
    title: "Visualization with Excel",
    desc: "Use Excel's features for impactful data visualization.",
    category: "Digital Tools",
    level: "Intermediate",
    duration: "24 hours",
    modules: 6,
    objectives: [
      "Create professional charts and graphs",
      "Design interactive dashboards",
      "Use advanced charting features",
      "Present data effectively",
    ],
    curriculum: [
      "Week 1: Chart Types and Selection",
      "Week 2: Formatting and Customization",
      "Week 3: Dynamic Charts with Formulas",
      "Week 4: Dashboard Design in Excel",
      "Week 5: Interactive Elements",
      "Week 6: Presentation and Storytelling",
    ],
    prerequisites: "Excel Basic knowledge",
    certification: "Excel Visualization Specialist",
  },
  {
    id: "course-1",
    title: "IoT for Industrial Applications",
    desc: "Learn how to implement Internet of Things solutions in industrial settings for improved efficiency and monitoring.",
    category: "Digital Transformation",
    duration: "4 weeks",
    level: "Intermediate",
    progress: 0,
    status: "Not Started",
    resources: [],
    objectives: [],
    keyTopics: [],
    analytics: {
      completionRate: 0,
      quizScores: [],
      skillCoverage: [],
    },
  },
  {
    id: "course-2",
    title: "Data Analytics for Business Decisions",
    desc: "Understand how to collect, analyze, and interpret data to make informed business decisions in a manufacturing context.",
    category: "Digital Transformation",
    duration: "5 weeks",
    level: "Intermediate",
    progress: 0,
    status: "Not Started",
    resources: [],
    objectives: [],
    keyTopics: [],
    analytics: {
      completionRate: 0,
      quizScores: [],
      skillCoverage: [],
    },
  },
  {
    id: "course-3",
    title: "Additive Manufacturing Techniques",
    desc: "Explore the principles and applications of 3D printing and other additive manufacturing processes.",
    category: "Automation",
    duration: "3 weeks",
    level: "Advanced",
    progress: 0,
    status: "Not Started",
    resources: [],
    objectives: [],
    keyTopics: [],
    analytics: {
      completionRate: 0,
      quizScores: [],
      skillCoverage: [],
    },
  },
]

export const facilities: Facility[] = [
  { name: "Power Plant", desc: "Advanced thermal power generation facility", icon: "⚡" },
  { name: "Steel Melting Shop", desc: "Electric arc furnace operations", icon: "🔥" },
  { name: "Sinter Plant", desc: "Iron ore processing and agglomeration", icon: "🏭" },
  { name: "Hot Strip Mill", desc: "Steel rolling and shaping operations", icon: "🔧" },
  { name: "Blast Furnace", desc: "Iron production from iron ore", icon: "🏗️" },
  { name: "Coke Oven", desc: "Metallurgical coke production", icon: "⚙️" },
]

// This is the summary achievements object that HomePage expects
export const achievements: Achievement = {
  yearsInOperation: 15,
  totalEmployeesTrained: 45000,
  yearlyTraining: 8500,
  partnerships: 25,
  recognitions: [
    {
      title: "Best Learning Initiative 2024",
      subtitle: "Indian Steel Industry Association",
      icon: "Award", // Corresponds to LucideReact icon name
    },
    {
      title: "Excellence in Employee Development",
      subtitle: "Confederation of Indian Industry",
      icon: "Target", // Corresponds to LucideReact icon name
    },
    {
      title: "Digital Transformation Leader",
      subtitle: "NASSCOM Excellence Awards",
      icon: "Globe", // Corresponds to LucideReact icon name
    },
  ],
}

// This is the array of individual user achievements, renamed to avoid conflict
export const userAchievements: UserAchievement[] = [
  {
    id: "1",
    title: "Completed 'Introduction to AI'",
    date: "2024-05-15",
    type: "course",
    details: "Successfully finished the foundational course in Artificial Intelligence.",
  },
  {
    id: "2",
    title: "Attended 'Leadership Summit 2024'",
    date: "2024-04-20",
    type: "event",
    details: "Participated in the annual leadership summit, gaining insights into modern leadership.",
  },
  {
    id: "3",
    title: "Certified in 'Digital Transformation Path'",
    date: "2024-03-01",
    type: "path",
    details: "Achieved certification in the comprehensive Digital Transformation training path.",
  },
]

export const trainingModules: Record<string, TrainingModule[]> = {
  Technical: [
    { name: "SAP Systems", slug: slugify("SAP Systems"), modules: 12, icon: "💻" },
    { name: "Plant Operations", slug: slugify("Plant Operations"), modules: 8, icon: "🏭" },
    { name: "Quality Control", slug: slugify("Quality Control"), modules: 6, icon: "🔍" },
    { name: "Maintenance Systems", slug: slugify("Maintenance Systems"), modules: 10, icon: "🔧" },
  ],
  Safety: [
    { name: "Workplace Safety", slug: slugify("Workplace Safety"), modules: 5, icon: "🦺" },
    { name: "Emergency Procedures", slug: slugify("Emergency Procedures"), modules: 4, icon: "🚨" },
    { name: "Equipment Safety", slug: slugify("Equipment Safety"), modules: 6, icon: "⚠️" },
    { name: "Environmental Safety", slug: slugify("Environmental Safety"), modules: 3, icon: "🌱" },
  ],
  "Soft Skills": [
    { name: "Communication", slug: slugify("Communication"), modules: 4, icon: "💬" },
    { name: "Team Building", slug: slugify("Team Building"), modules: 3, icon: "👥" },
    { name: "Problem Solving", slug: slugify("Problem Solving"), modules: 5, icon: "🧩" },
    { name: "Time Management", slug: slugify("Time Management"), modules: 2, icon: "⏰" },
  ],
  Leadership: [
    { name: "Strategic Thinking", slug: slugify("Strategic Thinking"), modules: 6, icon: "🎯" },
    { name: "Change Management", slug: slugify("Change Management"), modules: 4, icon: "🔄" },
    { name: "Performance Management", slug: slugify("Performance Management"), modules: 5, icon: "📊" },
    { name: "Decision Making", slug: slugify("Decision Making"), modules: 3, icon: "⚖️" },
  ],
}

export const detailedTrainingModuleContent: Record<string, DetailedTrainingModuleContent> = {
  Communication: {
    description:
      "Effective communication is crucial for success in any organization. This module focuses on developing verbal, written, and non-verbal communication skills essential for workplace interactions.",
    objectives: [
      "Develop clear and concise verbal communication",
      "Improve active listening skills",
      "Master professional email and report writing",
      "Enhance presentation skills",
      "Understand cross-cultural communication",
      "Develop conflict resolution communication strategies",
    ],
    topics: [
      "Fundamentals of Business Communication",
      "Active Listening Techniques",
      "Email Etiquette and Professional Writing",
      "Presentation Skills and Public Speaking",
      "Cross-Cultural Communication",
      "Conflict Resolution Communication",
    ],
    charts: [
      {
        title: "Communication Effectiveness by Method",
        type: "bar",
        data: [
          { label: "Face-to-Face", value: 85 },
          { label: "Video Call", value: 75 },
          { label: "Phone Call", value: 65 },
          { label: "Email", value: 50 },
          { label: "Text Message", value: 35 },
        ],
      },
      {
        title: "Communication Skills Impact on Career Growth",
        type: "line",
        data: [
          { label: "Year 1", value: 100 },
          { label: "Year 2", value: 115 },
          { label: "Year 3", value: 135 },
          { label: "Year 4", value: 160 },
          { label: "Year 5", value: 190 },
        ],
      },
    ],
    caseStudy: {
      title: "Communication Transformation at Tata Steel",
      description:
        "A cross-functional team at the Jamshedpur plant implemented new communication protocols that reduced misunderstandings by 45% and improved project completion rates by 30%. The initiative focused on standardized reporting templates, structured meeting formats, and communication training for all team leaders.",
    },
    resources: [
      { name: "Communication Guide", type: "PDF" },
      { name: "Communication Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Communication", 6), // Add 6 sections
  },
  "Team Building": {
    description:
      "This module focuses on developing skills to build and maintain high-performing teams. Participants learn strategies for team formation, development, and conflict resolution.",
    objectives: [
      "Understand team dynamics and development stages",
      "Learn effective team leadership techniques",
      "Develop strategies for building trust and collaboration",
      "Master conflict resolution within teams",
      "Implement effective team communication protocols",
      "Create inclusive team environments",
    ],
    topics: [
      "Team Formation and Development Stages",
      "Building Trust and Psychological Safety",
      "Team Leadership and Facilitation",
      "Managing Team Conflicts",
      "Remote and Hybrid Team Management",
      "Team Performance Evaluation",
    ],
    charts: [
      {
        title: "Team Performance Factors",
        type: "pie",
        data: [
          { label: "Trust", value: 30 },
          { label: "Clear Goals", value: 25 },
          { label: "Communication", value: 20 },
          { label: "Accountability", value: 15 },
          { label: "Recognition", value: 10 },
        ],
      },
      {
        title: "Team Development Stages",
        type: "line",
        data: [
          { label: "Forming", value: 40 },
          { label: "Storming", value: 30 },
          { label: "Norming", value: 60 },
          { label: "Performing", value: 90 },
          { label: "Adjourning", value: 70 },
        ],
      },
    ],
    caseStudy: {
      title: "Cross-Functional Team Success at Kalinganagar",
      description:
        "A newly formed cross-functional team at the Kalinganagar plant implemented team-building strategies that resulted in a 40% improvement in project delivery time and a 25% increase in innovation ideas. The initiative included regular team-building activities, clear role definition, and transparent communication channels.",
    },
    resources: [
      { name: "Team Building Guide", type: "PDF" },
      { name: "Team Building Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Team Building", 7), // Add 7 sections
  },
  "Problem Solving": {
    description:
      "This module equips participants with systematic approaches to identify, analyze, and solve complex problems in the workplace, using both analytical and creative thinking methods.",
    objectives: [
      "Develop structured problem-solving methodologies",
      "Learn root cause analysis techniques",
      "Enhance creative thinking for innovative solutions",
      "Master decision-making frameworks",
      "Implement solution evaluation methods",
      "Develop continuous improvement mindset",
    ],
    topics: [
      "Problem Identification and Definition",
      "Root Cause Analysis Methods",
      "Creative Problem-Solving Techniques",
      "Decision-Making Frameworks",
      "Solution Implementation and Evaluation",
      "Continuous Improvement Approaches",
    ],
    charts: [
      {
        title: "Problem-Solving Methodology Effectiveness",
        type: "bar",
        data: [
          { label: "Six Sigma", value: 85 },
          { label: "PDCA", value: 80 },
          { label: "5 Whys", value: 75 },
          { label: "Fishbone", value: 70 },
          { label: "Brainstorming", value: 65 },
        ],
      },
      {
        title: "Problem Resolution Time by Approach",
        type: "line",
        data: [
          { label: "Reactive", value: 100 },
          { label: "Structured", value: 70 },
          { label: "Preventive", value: 40 },
          { label: "Predictive", value: 20 },
        ],
      },
    ],
    caseStudy: {
      title: "Quality Improvement Through Systematic Problem Solving",
      description:
        "The quality control team at Tata Steel implemented a structured problem-solving approach that reduced defect rates by 35% and saved ₹2.5 crore annually. The initiative used root cause analysis, cross-functional problem-solving teams, and data-driven decision making to address persistent quality issues.",
    },
    resources: [
      { name: "Problem Solving Guide", type: "PDF" },
      { name: "Problem Solving Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Problem Solving", 6), // Add 6 sections
  },
  "Time Management": {
    description:
      "This module helps participants maximize productivity through effective time management strategies, prioritization techniques, and tools to eliminate time-wasting activities.",
    objectives: [
      "Master prioritization techniques",
      "Learn effective scheduling methods",
      "Develop strategies to minimize distractions",
      "Implement delegation best practices",
      "Create sustainable work-life balance",
      "Utilize digital tools for time management",
    ],
    topics: [
      "Time Audit and Analysis",
      "Prioritization Frameworks (Eisenhower Matrix)",
      "Effective Scheduling and Planning",
      "Delegation Strategies",
      "Managing Distractions and Interruptions",
      "Digital Tools for Time Management",
    ],
    charts: [
      {
        title: "Time Allocation Before and After Training",
        type: "bar",
        data: [
          { label: "Value-Adding", value: 65, comparison: 40 },
          { label: "Planning", value: 15, comparison: 10 },
          { label: "Meetings", value: 10, comparison: 25 },
          { label: "Email", value: 5, comparison: 15 },
          { label: "Distractions", value: 5, comparison: 10 },
        ],
      },
      {
        title: "Productivity Improvement After Time Management Training",
        type: "line",
        data: [
          { label: "Week 1", value: 100 },
          { label: "Week 2", value: 115 },
          { label: "Week 3", value: 125 },
          { label: "Week 4", value: 135 },
          { label: "Week 8", value: 150 },
        ],
      },
    ],
    caseStudy: {
      title: "Meeting Efficiency Transformation",
      description:
        "The management team at Tata Steel implemented time management best practices that reduced meeting time by 30% while increasing decision-making effectiveness by 25%. The initiative included implementing meeting agendas, time-boxing discussions, and establishing clear action items with owners and deadlines.",
    },
    resources: [
      { name: "Time Management Guide", type: "PDF" },
      { name: "Time Management Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Time Management", 5), // Add 5 sections
  },
  "Strategic Thinking": {
    description:
      "This module develops the ability to think strategically, anticipate future trends, and make decisions that align with long-term organizational goals and vision.",
    objectives: [
      "Understand strategic thinking frameworks",
      "Develop long-term vision and planning skills",
      "Learn scenario planning techniques",
      "Master strategic analysis methods",
      "Align tactical decisions with strategic goals",
      "Implement strategic change management",
    ],
    topics: [
      "Strategic Thinking Fundamentals",
      "Environmental Scanning and Analysis",
      "Vision Development and Strategic Planning",
      "Scenario Planning and Future Thinking",
      "Strategic Decision Making",
      "Strategy Implementation and Execution",
    ],
    charts: [
      {
        title: "Strategic Thinking Components",
        type: "pie",
        data: [
          { label: "Vision", value: 25 },
          { label: "Analysis", value: 20 },
          { label: "Planning", value: 20 },
          { label: "Innovation", value: 15 },
          { label: "Execution", value: 20 },
        ],
      },
      {
        title: "Strategic vs. Tactical Focus Impact on Growth",
        type: "line",
        data: [
          { label: "Year 1", value: 100 },
          { label: "Year 2", value: 110 },
          { label: "Year 3", value: 130 },
          { label: "Year 4", value: 160 },
          { label: "Year 5", value: 200 },
        ],
      },
    ],
    caseStudy: {
      title: "Market Expansion Through Strategic Thinking",
      description:
        "A strategic planning team at Tata Steel used advanced strategic thinking frameworks to identify new market opportunities that resulted in a 15% revenue increase within two years. The initiative included comprehensive market analysis, scenario planning, and strategic resource allocation to high-potential segments.",
    },
    resources: [
      { name: "Strategic Thinking Guide", type: "PDF" },
      { name: "Strategic Thinking Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Strategic Thinking", 6), // Add 6 sections
  },
  "Change Management": {
    description:
      "This module equips leaders with the skills to effectively manage organizational change, minimize resistance, and ensure successful implementation of new initiatives.",
    objectives: [
      "Understand change management models and frameworks",
      "Learn to assess change readiness",
      "Develop effective change communication strategies",
      "Master resistance management techniques",
      "Implement sustainable change processes",
      "Measure change effectiveness",
    ],
    topics: [
      "Change Management Models (Kotter, ADKAR)",
      "Change Readiness Assessment",
      "Stakeholder Analysis and Management",
      "Communication Strategies for Change",
      "Managing Resistance to Change",
      "Sustaining Change and Measuring Success",
    ],
    charts: [
      {
        title: "Change Success Factors",
        type: "bar",
        data: [
          { label: "Leadership", value: 90 },
          { label: "Communication", value: 85 },
          { label: "Engagement", value: 80 },
          { label: "Training", value: 75 },
          { label: "Resources", value: 70 },
        ],
      },
      {
        title: "Change Adoption Curve",
        type: "line",
        data: [
          { label: "Awareness", value: 20 },
          { label: "Understanding", value: 40 },
          { label: "Acceptance", value: 60 },
          { label: "Adoption", value: 80 },
          { label: "Commitment", value: 95 },
        ],
      },
    ],
    caseStudy: {
      title: "Digital Transformation Success Story",
      description:
        "The technology team at Tata Steel implemented a comprehensive change management approach during a major digital transformation that resulted in 95% user adoption and minimal disruption to operations. The initiative included early stakeholder engagement, targeted communication, extensive training, and continuous support throughout the transition.",
    },
    resources: [
      { name: "Change Management Guide", type: "PDF" },
      { name: "Change Management Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Change Management", 7), // Add 7 sections
  },
  "Performance Management": {
    description:
      "This module focuses on developing skills to effectively set goals, provide feedback, and evaluate performance to drive individual and team success.",
    objectives: [
      "Master goal-setting frameworks (SMART, OKRs)",
      "Develop effective feedback techniques",
      "Learn performance evaluation methods",
      "Implement coaching and development planning",
      "Address performance gaps effectively",
      "Create high-performance culture",
    ],
    topics: [
      "Strategic Goal Setting and Alignment",
      "Effective Feedback Techniques",
      "Performance Evaluation Methods",
      "Coaching for Performance Improvement",
      "Managing Underperformance",
      "Recognition and Reward Systems",
    ],
    charts: [
      {
        title: "Performance Management Impact",
        type: "bar",
        data: [
          { label: "Productivity", value: 35 },
          { label: "Engagement", value: 30 },
          { label: "Retention", value: 25 },
          { label: "Innovation", value: 20 },
          { label: "Quality", value: 15 },
        ],
      },
      {
        title: "Performance Improvement After Feedback",
        type: "line",
        data: [
          { label: "Week 1", value: 100 },
          { label: "Week 4", value: 115 },
          { label: "Week 8", value: 130 },
          { label: "Week 12", value: 145 },
          { label: "Week 16", value: 160 },
        ],
      },
    ],
    caseStudy: {
      title: "Performance Transformation in Manufacturing",
      description:
        "The production team at Tata Steel implemented a new performance management system that increased productivity by 22% and reduced quality issues by 18%. The initiative included clear performance metrics, regular feedback sessions, targeted coaching, and a transparent reward system tied to performance outcomes.",
    },
    resources: [
      { name: "Performance Management Guide", type: "PDF" },
      { name: "Performance Management Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Performance Management", 6), // Add 6 sections
  },
  "Decision Making": {
    description:
      "This module equips leaders with frameworks and techniques to make effective decisions, even in complex and uncertain situations, using both analytical and intuitive approaches.",
    objectives: [
      "Understand decision-making models and biases",
      "Learn structured decision-making processes",
      "Develop risk assessment techniques",
      "Master group decision-making facilitation",
      "Implement decision evaluation methods",
      "Balance data-driven and intuitive approaches",
    ],
    topics: [
      "Decision-Making Models and Frameworks",
      "Cognitive Biases in Decision Making",
      "Data-Driven Decision Making",
      "Risk Assessment and Management",
      "Group Decision Making Techniques",
      "Decision Evaluation and Learning",
    ],
    charts: [
      {
        title: "Decision Quality by Approach",
        type: "bar",
        data: [
          { label: "Structured", value: 85 },
          { label: "Data-Driven", value: 80 },
          { label: "Collaborative", value: 75 },
          { label: "Intuitive", value: 60 },
          { label: "Ad-hoc", value: 40 },
        ],
      },
      {
        title: "Decision Implementation Success Rate",
        type: "pie",
        data: [
          { label: "Full Success", value: 60 },
          { label: "Partial Success", value: 25 },
          { label: "Delayed Success", value: 10 },
          { label: "Failure", value: 5 },
        ],
      },
    ],
    caseStudy: {
      title: "Strategic Investment Decision Process",
      description:
        "The executive team at Tata Steel implemented a structured decision-making framework for capital investments that improved ROI by 18% and reduced failed initiatives by 65%. The approach included comprehensive data analysis, scenario planning, stakeholder input, and systematic risk assessment before major investment decisions.",
    },
    resources: [
      { name: "Decision Making Guide", type: "PDF" },
      { name: "Decision Making Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Decision Making", 5), // Add 5 sections
  },
  // Technical Modules
  "SAP Systems": {
    description:
      "This module provides a comprehensive overview of SAP systems relevant to Tata Steel's operations, focusing on key modules and their integration for efficient business processes.",
    objectives: [
      "Understand the architecture and core modules of SAP",
      "Navigate SAP interface and perform basic transactions",
      "Learn data management and reporting in SAP",
      "Understand integration points between different SAP modules",
      "Apply SAP knowledge to optimize daily tasks",
      "Troubleshoot common SAP issues",
    ],
    topics: [
      "SAP Overview and Architecture",
      "SAP Navigation and User Interface",
      "Master Data Management in SAP",
      "Transaction Processing in Key Modules (e.g., MM, PP, FICO)",
      "SAP Reporting and Analytics",
      "SAP Best Practices and Security",
    ],
    charts: [
      {
        title: "SAP Module Usage at Tata Steel",
        type: "pie",
        data: [
          { label: "SAP MM", value: 30 },
          { label: "SAP PP", value: 25 },
          { label: "SAP FICO", value: 20 },
          { label: "SAP PM", value: 15 },
          { label: "Other", value: 10 },
        ],
      },
      {
        title: "Efficiency Gain Post-SAP Training",
        type: "bar",
        data: [
          { label: "Data Entry Speed", value: 40, comparison: 20 },
          { label: "Report Generation", value: 35, comparison: 15 },
          { label: "Process Accuracy", value: 30, comparison: 10 },
        ],
      },
    ],
    caseStudy: {
      title: "SAP Implementation for Supply Chain Optimization",
      description:
        "Tata Steel successfully implemented a new SAP S/4HANA system to streamline its supply chain, resulting in a 20% reduction in inventory costs and a 15% improvement in delivery times. The project involved extensive user training and process re-engineering.",
    },
    resources: [
      { name: "SAP Systems Guide", type: "PDF" },
      { name: "SAP Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("SAP Systems", 6), // Add 6 sections
  },
  "Plant Operations": {
    description:
      "This module covers the fundamental principles and best practices for efficient and safe operation of steel plant machinery and processes.",
    objectives: [
      "Understand the overall steel manufacturing process flow",
      "Learn about key machinery and equipment in a steel plant",
      "Master operational procedures for various plant sections",
      "Identify and mitigate operational risks",
      "Implement energy efficiency measures in operations",
      "Ensure compliance with operational safety standards",
    ],
    topics: [
      "Iron Making Process (Blast Furnace)",
      "Steel Making Process (SMS, Concast)",
      "Rolling Mill Operations (Hot Strip, Cold Rolling)",
      "Utilities and Ancillary Services",
      "Process Control and Automation",
      "Operational Safety and Emergency Procedures",
    ],
    charts: [
      {
        title: "Key Performance Indicators in Plant Operations",
        type: "bar",
        data: [
          { label: "Production Volume", value: 95 },
          { label: "Energy Consumption", value: 80 },
          { label: "Yield Rate", value: 92 },
          { label: "Downtime", value: 10 },
        ],
      },
      {
        title: "Operational Efficiency Improvement",
        type: "line",
        data: [
          { label: "Q1", value: 100 },
          { label: "Q2", value: 105 },
          { label: "Q3", value: 110 },
          { label: "Q4", value: 115 },
        ],
      },
    ],
    caseStudy: {
      title: "Optimizing Hot Strip Mill Operations",
      description:
        "A project at the Hot Strip Mill focused on optimizing rolling parameters using real-time data, leading to a 5% increase in production throughput and a 3% reduction in energy consumption. This was achieved through advanced process control and operator training.",
    },
    resources: [
      { name: "Plant Operations Guide", type: "PDF" },
      { name: "Plant Operations Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Plant Operations", 7), // Add 7 sections
  },
  "Quality Control": {
    description:
      "This module provides a deep understanding of quality control principles, methodologies, and tools essential for maintaining high product standards in steel manufacturing.",
    objectives: [
      "Understand the importance of quality in steel production",
      "Learn various quality control tools and techniques (e.g., SPC, FMEA)",
      "Master inspection and testing procedures for steel products",
      "Identify and analyze root causes of quality defects",
      "Implement corrective and preventive actions",
      "Ensure compliance with national and international quality standards",
    ],
    topics: [
      "Introduction to Quality Management Systems",
      "Statistical Process Control (SPC)",
      "Inspection and Testing Methods",
      "Root Cause Analysis for Defects",
      "Corrective and Preventive Actions (CAPA)",
      "Quality Audits and Certifications (ISO)",
    ],
    charts: [
      {
        title: "Defect Reduction After QC Training",
        type: "bar",
        data: [
          { label: "Surface Defects", value: 60, comparison: 80 },
          { label: "Dimensional Errors", value: 70, comparison: 90 },
          { label: "Composition Issues", value: 50, comparison: 70 },
        ],
      },
      {
        title: "Quality Index Trend",
        type: "line",
        data: [
          { label: "Jan", value: 80 },
          { label: "Feb", value: 85 },
          { label: "Mar", value: 90 },
          { label: "Apr", value: 92 },
          { label: "May", value: 95 },
        ],
      },
    ],
    caseStudy: {
      title: "Reducing Defects in Cold Rolled Products",
      description:
        "By implementing advanced SPC techniques and enhancing operator training, the Cold Rolling Mill reduced surface defects by 25% and improved overall product quality, leading to higher customer satisfaction and reduced rework costs.",
    },
    resources: [
      { name: "Quality Control Guide", type: "PDF" },
      { name: "Quality Control Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Quality Control", 6), // Add 6 sections
  },
  "Maintenance Systems": {
    description:
      "This module focuses on modern maintenance strategies and systems, including preventive, predictive, and reliability-centered maintenance, to ensure optimal asset performance and minimize downtime.",
    objectives: [
      "Understand different types of maintenance strategies",
      "Learn to implement preventive and predictive maintenance programs",
      "Utilize CMMS/EAM systems for maintenance management",
      "Conduct root cause analysis for equipment failures",
      "Optimize spare parts management",
      "Improve overall equipment effectiveness (OEE)",
    ],
    topics: [
      "Evolution of Maintenance Strategies",
      "Preventive Maintenance Planning and Scheduling",
      "Predictive Maintenance Technologies (Vibration, Thermography)",
      "Reliability-Centered Maintenance (RCM)",
      "Computerized Maintenance Management Systems (CMMS)",
      "Spare Parts Management and Inventory Control",
    ],
    charts: [
      {
        title: "Maintenance Strategy Effectiveness",
        type: "pie",
        data: [
          { label: "Predictive", value: 40 },
          { label: "Preventive", value: 30 },
          { label: "Reactive", value: 20 },
          { label: "Other", value: 10 },
        ],
      },
      {
        title: "Reduction in Unplanned Downtime",
        type: "line",
        data: [
          { label: "Q1", value: 100 },
          { label: "Q2", value: 90 },
          { label: "Q3", value: 75 },
          { label: "Q4", value: 60 },
        ],
      },
    ],
    caseStudy: {
      title: "Implementing Predictive Maintenance in Blast Furnace",
      description:
        "The Blast Furnace team adopted predictive maintenance technologies, including vibration analysis and thermal imaging, which led to a 30% reduction in unplanned breakdowns and significant cost savings from optimized maintenance schedules.",
    },
    resources: [
      { name: "Maintenance Systems Guide", type: "PDF" },
      { name: "Maintenance Systems Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Maintenance Systems", 7), // Add 7 sections
  },
  "Workplace Safety": {
    description:
      "This module covers essential workplace safety principles, hazard identification, risk assessment, and the importance of a safety-first culture to prevent accidents and injuries.",
    objectives: [
      "Understand fundamental workplace safety regulations and policies",
      "Identify common workplace hazards and risks",
      "Learn to conduct basic risk assessments",
      "Understand the importance of personal protective equipment (PPE)",
      "Know emergency procedures and reporting protocols",
      "Contribute to a proactive safety culture",
    ],
    topics: [
      "Introduction to Occupational Health and Safety",
      "Hazard Identification and Risk Assessment",
      "Personal Protective Equipment (PPE) Usage",
      "Ergonomics and Manual Handling Safety",
      "Fire Safety and Emergency Preparedness",
      "Accident Reporting and Investigation",
    ],
    charts: [
      {
        title: "Common Workplace Accident Types",
        type: "pie",
        data: [
          { label: "Slips/Trips/Falls", value: 30 },
          { label: "Machinery Incidents", value: 25 },
          { label: "Material Handling", value: 20 },
          { label: "Chemical Exposure", value: 15 },
          { label: "Other", value: 10 },
        ],
      },
      {
        title: "Safety Incident Rate Reduction",
        type: "line",
        data: [
          { label: "Jan", value: 100 },
          { label: "Feb", value: 95 },
          { label: "Mar", value: 85 },
          { label: "Apr", value: 70 },
          { label: "May", value: 60 },
        ],
      },
    ],
    caseStudy: {
      title: "Enhancing Safety Culture at Jamshedpur Works",
      description:
        "Through a comprehensive 'Safety First' campaign, including regular training, hazard reporting incentives, and leadership commitment, the Jamshedpur Works achieved a 40% reduction in lost-time injuries over one year.",
    },
    resources: [
      { name: "Workplace Safety Guide", type: "PDF" },
      { name: "Workplace Safety Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Workplace Safety", 6), // Add 6 sections
  },
  "Emergency Procedures": {
    description:
      "This module trains employees on critical emergency procedures, including fire safety, evacuation protocols, and first aid, to ensure a rapid and effective response during crises.",
    objectives: [
      "Understand emergency response plans and roles",
      "Learn fire prevention and suppression techniques",
      "Master safe evacuation procedures",
      "Acquire basic first aid and CPR skills",
      "Understand chemical spill response protocols",
      "Participate effectively in emergency drills",
    ],
    topics: [
      "Emergency Response Planning",
      "Fire Safety and Extinguisher Use",
      "Evacuation Procedures and Assembly Points",
      "Basic First Aid and CPR",
      "Chemical Spill Response",
      "Emergency Communication and Reporting",
    ],
    charts: [
      {
        title: "Emergency Preparedness Score",
        type: "bar",
        data: [
          { label: "Awareness", value: 90 },
          { label: "Response Time", value: 85 },
          { label: "First Aid Knowledge", value: 75 },
          { label: "Evacuation Drills", value: 80 },
        ],
      },
      {
        title: "Evacuation Drill Completion Time",
        type: "line",
        data: [
          { label: "Drill 1", value: 100 },
          { label: "Drill 2", value: 80 },
          { label: "Drill 3", value: 60 },
          { label: "Drill 4", value: 50 },
        ],
      },
    ],
    caseStudy: {
      title: "Improving Emergency Response at Kalinganagar",
      description:
        "After a series of intensive emergency response drills and training sessions, the Kalinganagar plant reduced its average evacuation time by 35% and improved employee confidence in handling emergency situations.",
    },
    resources: [
      { name: "Emergency Procedures Guide", type: "PDF" },
      { name: "Emergency Procedures Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Emergency Procedures", 5), // Add 5 sections
  },
  "Equipment Safety": {
    description:
      "This module focuses on safe operating procedures for various industrial equipment, emphasizing lockout/tagout, machine guarding, and preventive maintenance to avoid machinery-related incidents.",
    objectives: [
      "Understand safe operating procedures for specific equipment",
      "Learn lockout/tagout (LOTO) procedures",
      "Identify and ensure proper machine guarding",
      "Understand electrical safety protocols",
      "Perform pre-operational checks and inspections",
      "Recognize and report equipment malfunctions safely",
    ],
    topics: [
      "General Machine Safety Principles",
      "Lockout/Tagout (LOTO) Procedures",
      "Machine Guarding and Interlocks",
      "Electrical Safety in Industrial Settings",
      "Hydraulic and Pneumatic Safety",
      "Safe Use of Hand and Power Tools",
    ],
    charts: [
      {
        title: "Equipment-Related Incident Reduction",
        type: "bar",
        data: [
          { label: "LOTO Compliance", value: 95 },
          { label: "Machine Guarding", value: 90 },
          { label: "Electrical Safety", value: 85 },
        ],
      },
      {
        title: "Near Misses Related to Equipment",
        type: "line",
        data: [
          { label: "Jan", value: 10 },
          { label: "Feb", value: 8 },
          { label: "Mar", value: 6 },
          { label: "Apr", value: 4 },
          { label: "May", value: 2 },
        ],
      },
    ],
    caseStudy: {
      title: "Zero Harm Initiative in Rolling Mills",
      description:
        "A targeted 'Zero Harm' initiative in the Rolling Mills, focusing on strict LOTO adherence and enhanced machine guarding, resulted in zero machinery-related accidents for two consecutive years.",
    },
    resources: [
      { name: "Equipment Safety Guide", type: "PDF" },
      { name: "Equipment Safety Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Equipment Safety", 6), // Add 6 sections
  },
  "Environmental Safety": {
    description:
      "This module educates employees on environmental protection, waste management, pollution control, and sustainable practices to minimize the ecological footprint of operations.",
    objectives: [
      "Understand environmental regulations and compliance",
      "Learn proper waste segregation and disposal methods",
      "Identify sources of pollution and control measures",
      "Understand water and energy conservation techniques",
      "Participate in environmental audits and initiatives",
      "Contribute to Tata Steel's sustainability goals",
    ],
    topics: [
      "Environmental Management Systems (EMS)",
      "Waste Management and Recycling",
      "Air and Water Pollution Control",
      "Hazardous Waste Handling",
      "Energy and Water Conservation",
      "Environmental Impact Assessment",
    ],
    charts: [
      {
        title: "Waste Diversion Rate",
        type: "pie",
        data: [
          { label: "Recycled", value: 60 },
          { label: "Reused", value: 20 },
          { label: "Landfilled", value: 15 },
          { label: "Other", value: 5 },
        ],
      },
      {
        title: "Carbon Footprint Reduction",
        type: "line",
        data: [
          { label: "2022", value: 100 },
          { label: "2023", value: 95 },
          { label: "2024", value: 90 },
          { label: "2025", value: 85 },
        ],
      },
    ],
    caseStudy: {
      title: "Achieving Water Neutrality at Jamshedpur",
      description:
        "Tata Steel's Jamshedpur plant implemented advanced water recycling and conservation technologies, achieving near water neutrality and significantly reducing its freshwater consumption, setting a benchmark for sustainable operations.",
    },
    resources: [
      { name: "Environmental Safety Guide", type: "PDF" },
      { name: "Environmental Safety Exercises", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Environmental Safety", 5), // Add 5 sections
  },
  // New detailed module content for Automation Specialist path
  "Advanced Robotics for Automation": {
    description:
      "This module provides a deep dive into robotic systems, programming, and their integration into industrial automation processes for enhanced efficiency and precision.",
    objectives: [
      "Understand different types of industrial robots and their applications",
      "Learn robotic kinematics and dynamics",
      "Master robot programming languages and environments",
      "Integrate robots with other automation systems (PLCs, sensors)",
      "Implement safety protocols for robotic work cells",
      "Troubleshoot common robotic system issues",
    ],
    topics: [
      "Introduction to Industrial Robotics",
      "Robot Kinematics and Trajectory Planning",
      "Robot Programming (e.g., ABB RAPID, KUKA KRL)",
      "Robot Vision Systems",
      "Human-Robot Collaboration (HRC)",
      "Robot Safety Standards and Implementation",
    ],
    charts: [
      {
        title: "Robotics Adoption Rate in Manufacturing",
        type: "bar",
        data: [
          { label: "Assembly", value: 70 },
          { label: "Welding", value: 65 },
          { label: "Material Handling", value: 80 },
          { label: "Painting", value: 55 },
        ],
      },
      {
        title: "Productivity Increase with Robotic Automation",
        type: "line",
        data: [
          { label: "Month 1", value: 100 },
          { label: "Month 3", value: 115 },
          { label: "Month 6", value: 130 },
          { label: "Month 12", value: 150 },
        ],
      },
    ],
    caseStudy: {
      title: "Robotic Welding Implementation at Tata Motors",
      description:
        "Tata Motors successfully implemented robotic welding cells in its assembly lines, leading to a 20% increase in welding speed and a 15% improvement in weld quality, while significantly enhancing worker safety.",
    },
    resources: [
      { name: "Robotics Programming Guide", type: "PDF" },
      { name: "Robot Safety Checklist", type: "PDF" },
    ],
    detailedContent: generateDetailedModuleSections("Advanced Robotics for Automation", 7), // Add 7 sections
  },
}

// Renamed popularTrainingPaths to trainingPaths and exported it
export const trainingPaths: TrainingPath[] = [
  { name: "Leadership Development", slug: slugify("Leadership Development"), modules: 12, duration: "6 months" },
  { name: "Technical Excellence", slug: slugify("Technical Excellence"), modules: 15, duration: "8 months" },
  { name: "Digital Transformation", slug: slugify("Digital Transformation"), modules: 10, duration: "5 months" },
  { name: "Automation Specialist", slug: slugify("Automation Specialist"), modules: 8, duration: "4 months" }, // Added Automation Specialist
]

// Export popularTrainingPaths as an alias to satisfy deployment requirements
export const popularTrainingPaths = trainingPaths

// Consolidated and corrected detailedTrainingPathContent as a Record
export const detailedTrainingPathContent: Record<string, DetailedTrainingPathContent> = {
  "leadership-development": {
    description:
      "A comprehensive path designed to cultivate future leaders at Tata Steel, focusing on strategic thinking, change management, performance leadership, and effective decision-making. This path combines theoretical knowledge with practical application through case studies and interactive sessions.",
    objectives: [
      "Develop strong strategic thinking and planning abilities",
      "Master effective change management and implementation",
      "Enhance performance management and coaching skills",
      "Improve decision-making in complex and uncertain environments",
      "Foster a culture of innovation and continuous improvement",
      "Build resilient and high-performing teams",
    ],
    topics: [
      "Strategic Thinking Fundamentals",
      "Change Management Models",
      "Performance Management Frameworks",
      "Decision Making Under Uncertainty",
      "Emotional Intelligence for Leaders",
      "Conflict Resolution Strategies",
    ],
    charts: [
      {
        title: "Leadership Competency Growth",
        type: "bar",
        data: [
          { label: "Strategic Thinking", value: 80, comparison: 50 },
          { label: "Communication", value: 90, comparison: 60 },
          { label: "Team Building", value: 85, comparison: 55 },
          { label: "Problem Solving", value: 75, comparison: 45 },
          { label: "Innovation", value: 70, comparison: 40 },
        ],
      },
      {
        title: "Participant Satisfaction",
        type: "pie",
        data: [
          { label: "Excellent", value: 60 },
          { label: "Good", value: 30 },
          { label: "Average", value: 10 },
        ],
      },
    ],
    caseStudy: {
      title: "Transforming Leadership at Tata Steel Europe",
      description:
        "A multi-year initiative to develop a new generation of leaders across Tata Steel Europe resulted in a 20% increase in leadership effectiveness scores and a significant improvement in employee engagement. The program included executive coaching, cross-functional projects, and a focus on adaptive leadership.",
    },
    resources: [
      { name: "Leadership Handbook", type: "PDF" },
      { name: "Leadership Case Studies", type: "PDF" },
    ],
    modules: [
      { name: "Strategic Thinking", icon: "🎯" },
      { name: "Change Management", icon: "🔄" },
      { name: "Performance Management", icon: "📊" },
      { name: "Decision Making", icon: "⚖️" },
      { name: "Communication", icon: "💬" },
      { name: "Team Building", icon: "👥" },
    ],
  },
  "technical-excellence": {
    description:
      "This path is designed for employees seeking to master core technical skills essential for operational excellence and innovation within Tata Steel. It covers critical areas from SAP systems to advanced plant operations and quality control.",
    objectives: [
      "Gain in-depth knowledge of SAP systems for various plant functions",
      "Master operational procedures for key steel manufacturing processes",
      "Implement advanced quality control techniques to minimize defects",
      "Apply modern maintenance strategies for optimal asset performance",
      "Enhance problem-solving skills for technical challenges",
      "Understand and apply environmental safety protocols in operations",
    ],
    topics: [
      "SAP Systems Overview",
      "Plant Operations Best Practices",
      "Quality Control Methodologies",
      "Maintenance Systems and Strategies",
      "Equipment Safety Protocols",
      "Environmental Safety Compliance",
    ],
    charts: [
      {
        title: "Technical Skill Proficiency Improvement",
        type: "bar",
        data: [
          { label: "SAP Systems", value: 85, comparison: 40 },
          { label: "Plant Operations", value: 80, comparison: 35 },
          { label: "Quality Control", value: 75, comparison: 30 },
          { label: "Maintenance Systems", value: 70, comparison: 25 },
        ],
      },
      {
        title: "Operational Efficiency Gains",
        type: "line",
        data: [
          { label: "Month 1", value: 100 },
          { label: "Month 2", value: 105 },
          { label: "Month 3", value: 110 },
          { label: "Month 4", value: 115 },
        ],
      },
    ],
    caseStudy: {
      title: "Achieving Operational Efficiency at Kalinganagar Plant",
      description:
        "By enrolling key personnel in the Technical Excellence path, the Kalinganagar plant achieved a 15% increase in overall equipment effectiveness (OEE) and a 10% reduction in operational costs within 18 months. This was driven by improved technical proficiency and cross-functional collaboration.",
    },
    resources: [
      { name: "Technical Excellence Guide", type: "PDF" },
      { name: "Technical Excellence Case Studies", type: "PDF" },
    ],
    modules: [
      { name: "SAP Systems", icon: "💻" },
      { name: "Plant Operations", icon: "🏭" },
      { name: "Quality Control", icon: "🔍" },
      { name: "Maintenance Systems", icon: "🔧" },
      { name: "Equipment Safety", icon: "⚠️" },
      { name: "Environmental Safety", icon: "🌱" },
    ],
  },
  "digital-transformation": {
    description:
      "This path equips employees with the skills and mindset necessary to lead and contribute to digital initiatives across Tata Steel. It covers emerging technologies, data analytics, and digital tools for enhanced productivity and innovation.",
    objectives: [
      "Understand the landscape of digital transformation and its impact",
      "Learn to leverage data analytics for informed decision-making",
      "Master digital productivity tools like Office 365 and Power Automate",
      "Explore the potential of Generative AI and other emerging technologies",
      "Develop skills in cybersecurity fundamentals for digital safety",
      "Drive digital adoption and innovation within their respective functions",
    ],
    topics: [
      "Introduction to Digital Transformation",
      "Data Analytics & Data Science Fundamentals",
      "Office 365 & Power Automate Proficiency",
      "Generative AI & Creativity",
      "Cybersecurity Fundamentals",
      "Digital Project Management",
    ],
    charts: [
      {
        title: "Digital Skill Adoption Rate",
        type: "pie",
        data: [
          { label: "AI/ML", value: 30 },
          { label: "Power Automate", value: 25 },
          { label: "Data Analytics", value: 20 },
          { label: "Office 365", value: 15 },
          { label: "Cybersecurity", value: 10 },
        ],
      },
      {
        title: "Productivity Improvement Post-Digital Training",
        type: "bar",
        data: [
          { label: "Task Automation", value: 40, comparison: 15 },
          { label: "Data Processing", value: 35, comparison: 10 },
          { label: "Collaboration", value: 30, comparison: 10 },
        ],
      },
    ],
    caseStudy: {
      title: "Digitalizing Procurement Processes at Tata Steel India",
      description:
        "The procurement team, after completing the Digital Transformation path, successfully implemented an AI-powered automation system that reduced manual processing time by 50% and improved data accuracy by 30%, leading to significant cost savings and efficiency gains.",
    },
    resources: [
      { name: "Digital Transformation Guide", type: "PDF" },
      { name: "Digital Transformation Case Studies", type: "PDF" },
    ],
    modules: [
      { name: "Generative AI & Creativity", icon: "💡", courseId: 10 }, // Added courseId
      { name: "Microsoft Excel - Basic", icon: "📊", courseId: 3 }, // Added courseId
      { name: "Advanced Microsoft Excel", icon: "📈", courseId: 4 }, // Added courseId
      { name: "Power Automate", icon: "🤖", courseId: 9 }, // Added courseId
      { name: "SAP Systems", icon: "💻" }, // This is a module, not a course
      { name: "Data Analytics & Data Science", icon: "🔬", courseId: 7 }, // Added courseId
    ],
  },
  "automation-specialist": {
    // Added new path for Automation Specialist
    description:
      "This path focuses on equipping employees with advanced skills in industrial automation, including robotics, process control, and smart manufacturing techniques.",
    objectives: [
      "Understand principles of industrial automation and control systems",
      "Learn to program and operate robotic systems for manufacturing",
      "Master process optimization through automation technologies",
      "Explore applications of AI and IoT in automation",
      "Develop skills in troubleshooting automated systems",
      "Contribute to smart factory initiatives",
    ],
    topics: [
      "Introduction to Industrial Automation",
      "Robotics and Mechatronics",
      "Process Control Systems (PLC, DCS)",
      "Sensors and Actuators in Automation",
      "AI and Machine Learning for Automation",
      "Cyber-Physical Systems and Industry 4.0",
    ],
    charts: [
      {
        title: "Automation Skill Proficiency",
        type: "bar",
        data: [
          { label: "Robotics", value: 75 },
          { label: "PLC Programming", value: 80 },
          { label: "Process Control", value: 70 },
          { label: "IIoT Integration", value: 65 },
        ],
      },
      {
        title: "Automation Project Success Rate",
        type: "pie",
        data: [
          { label: "On Time", value: 50 },
          { label: "Early", value: 20 },
          { label: "Delayed", value: 25 },
          { label: "Failed", value: 5 },
        ],
      },
    ],
    caseStudy: {
      title: "Automating Material Handling at Jamshedpur Plant",
      description:
        "The Jamshedpur plant implemented an automated material handling system, reducing manual labor by 60% and increasing throughput by 25%. This project leveraged advanced robotics and integrated control systems, demonstrating significant efficiency gains.",
    },
    resources: [
      { name: "Automation Handbook", type: "PDF" },
      { name: "Robotics Case Studies", type: "PDF" },
    ],
    modules: [
      { name: "Advanced Robotics for Automation", icon: "🤖" }, // Removed courseId, now a direct module
      { name: "Additive Manufacturing Techniques", icon: "🖨️", courseId: "course-3" },
      { name: "IoT for Industrial Applications", icon: "📡", courseId: "course-1" },
      { name: "Plant Operations", icon: "🏭" }, // Direct module
      { name: "Maintenance Systems", icon: "🔧" }, // Direct module
    ],
  },
}

export const upcomingPrograms: UpcomingProgram[] = [
  {
    id: "event-1",
    title: "Advanced Data Analytics Workshop",
    date: "2025-06-15", // Changed to string
    time: "09:00 AM - 01:00 PM",
    location: "Training Hall 1",
    description:
      "This workshop provides a deep dive into advanced data analysis techniques using Python and R. Participants will learn to build predictive models, perform statistical analysis, and visualize complex datasets. Key topics include regression, classification, clustering, and time series analysis. Hands-on exercises will be provided.",
    category: "Technical",
    capacity: 50,
    registered: 35,
    speakers: [
      { name: "Dr. Anya Sharma", role: "Lead Data Scientist", bio: "Expert in machine learning and big data." },
      {
        name: "Mr. Rajeev Kumar",
        role: "Senior Data Analyst",
        bio: "Specializes in data visualization and reporting.",
      },
    ],
    materials: ["Workshop Guide", "Dataset Files", "Python/R Cheatsheet"],
    prerequisites: "Basic knowledge of Python or R, and fundamental statistics.",
    agenda: [
      "09:00 AM - 09:30 AM: Introduction to Advanced Analytics & Tools",
      "09:30 AM - 11:00 AM: Predictive Modeling Techniques (Regression & Classification)",
      "11:00 AM - 12:30 PM: Hands-on Session: Data Visualization with Tableau/Power BI",
      "12:30 PM - 01:00 PM: Case Studies and Q&A",
    ],
    meetingDetails: {
      link: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_TBD%40thread.v2/0?context=%7b%22Tid%22%3a%22your-tenant-id%22%2c%22Oid%22%3a%22your-object-id%22%7d",
      id: "987 654 3210",
      password: "SteelFuture",
    },
  },
  {
    id: "event-2",
    title: "Leadership in Crisis Management",
    date: "2025-06-15", // Changed to string
    time: "02:00 PM - 05:00 PM",
    location: "Conference Room B",
    description:
      "This session focuses on developing effective leadership strategies for navigating organizational crises. Learn how to make swift decisions, communicate effectively under pressure, and maintain team morale during challenging times. Includes practical scenarios and group discussions.",
    category: "Soft Skills",
    capacity: 30,
    registered: 28,
    speakers: [
      {
        name: "Ms. Priya Singh",
        role: "Organizational Psychologist",
        bio: "Specializes in crisis communication and resilience.",
      },
    ],
    materials: ["Crisis Management Handbook", "Decision-Making Frameworks"],
    prerequisites: "Mid-level management experience or aspiring leaders.",
    agenda: [
      "02:00 PM - 02:30 PM: Understanding Crisis Dynamics & Impact",
      "02:30 PM - 03:30 PM: Effective Communication Strategies in Crisis",
      "03:30 PM - 04:30 PM: Role-playing Scenarios & Case Studies",
      "04:30 PM - 05:00 PM: Q&A and Action Planning",
    ],
    meetingDetails: {
      link: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_TBD%40thread.v2/0?context=%7b%22Tid%22%3a%22your-tenant-id%22%2c%22Oid%22%3a%22your-object-id%22%7d",
      id: "112 233 4455",
      password: "LeadChangeNow",
    },
  },
  {
    id: "event-3",
    title: "Cybersecurity Fundamentals",
    date: "2025-06-16", // Changed to string
    time: "10:00 AM - 04:00 PM",
    location: "IT Lab 2",
    description:
      "An introductory course to cybersecurity principles and best practices for all employees. Understand common cyber threats, how to protect sensitive information, and what to do in case of a security incident. This course is essential for maintaining a secure digital environment at Tata Steel.",
    category: "Technical",
    capacity: 40,
    registered: 20,
    speakers: [
      { name: "Mr. Alok Verma", role: "Cybersecurity Lead", bio: "10+ years experience in enterprise security." },
    ],
    materials: ["Cybersecurity Basics Guide", "Security Checklist"],
    prerequisites: "None.",
    agenda: [
      "10:00 AM - 11:00 AM: Introduction to Cyber Threats & Risks",
      "11:00 AM - 12:00 PM: Network Security & Safe Browsing",
      "12:00 PM - 01:00 PM: Data Protection and Privacy (GDPR/Local Laws)",
      "01:00 PM - 02:00 PM: Lunch Break",
      "02:00 PM - 03:00 PM: Incident Response & Reporting",
      "03:00 PM - 04:00 PM: Phishing & Social Engineering Awareness",
    ],
    meetingDetails: {
      link: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_TBD%40thread.v2/0?context=%7b%22Tid%22%3a%22your-tenant-id%22%2c%22Oid%22%3a%22your-object-id%22%7d",
      id: "998 877 6655",
      password: "SafeDigital",
    },
  },
  {
    id: "event-4",
    title: "Effective Communication Skills",
    date: "2025-06-17",
    time: "09:30 AM - 12:30 PM",
    location: "Training Hall 3",
    description:
      "Enhance your verbal and non-verbal communication for professional success. This interactive workshop covers active listening, giving and receiving feedback, presentation skills, and navigating difficult conversations. Improve your ability to convey messages clearly and build stronger professional relationships.",
    category: "Soft Skills",
    capacity: 35,
    registered: 15,
    speakers: [
      { name: "Ms. Smita Rao", role: "Communication Coach", bio: "Specializes in corporate communication training." },
    ],
    materials: ["Communication Workbook", "Presentation Tips"],
    prerequisites: "None.",
    agenda: [
      "09:30 AM - 10:30 AM: Principles of Effective Communication & Active Listening",
      "10:30 AM - 11:30 AM: Giving and Receiving Constructive Feedback",
      "11:30 AM - 12:30 PM: Mastering Presentation Skills & Public Speaking",
    ],
  },
  {
    id: "event-5",
    title: "Project Management Professional (PMP) Prep",
    date: "2025-06-18",
    time: "09:00 AM - 05:00 PM",
    location: "Training Hall 1",
    description:
      "Comprehensive preparation for the PMP certification exam, covering all knowledge areas and process groups as per PMBOK Guide. This intensive course includes practice questions, exam strategies, and expert guidance to help you pass the PMP exam on your first attempt.",
    category: "Management",
    capacity: 25,
    registered: 10,
    speakers: [{ name: "Mr. Vikram Khanna", role: "Certified PMP Trainer", bio: "20+ years in project management." }],
    materials: ["PMP Study Guide", "Practice Exam Questions"],
    prerequisites: "Prior project experience as per PMI guidelines.",
    agenda: [
      "09:00 AM - 11:00 AM: Project Integration & Scope Management",
      "11:00 AM - 11:00 PM: Project Schedule & Cost Management", // Corrected time from 1:00 PM - 2:00 PM to 1:00 PM - 1:00 PM (assuming a typo and it should be a break or a continuous session)
      "01:00 PM - 02:00 PM: Lunch Break",
      "02:00 PM - 04:00 PM: Project Quality & Resource Management",
      "04:00 PM - 05:00 PM: Risk, Procurement & Stakeholder Management",
    ],
  },
  {
    id: "event-6",
    title: "Introduction to Cloud Computing",
    date: "2025-06-19",
    time: "10:00 AM - 01:00 PM",
    location: "IT Lab 1",
    description:
      "Understand the basics of cloud platforms like AWS, Azure, and GCP. This course covers fundamental cloud concepts, service models (IaaS, PaaS, SaaS), deployment models, and key benefits of cloud adoption for businesses. Ideal for IT professionals and business users.",
    category: "Technical",
    capacity: 45,
    registered: 22,
    speakers: [
      { name: "Ms. Neha Gupta", role: "Cloud Solutions Architect", bio: "Expert in multi-cloud environments." },
    ],
    materials: ["Cloud Computing Overview", "Glossary of Cloud Terms"],
    prerequisites: "Basic computer literacy.",
    agenda: [
      "10:00 AM - 11:00 AM: What is Cloud Computing? Key Concepts",
      "11:00 AM - 12:00 PM: Cloud Service Models (IaaS, PaaS, SaaS) Explained",
      "12:00 PM - 01:00 PM: Cloud Deployment Models & Use Cases",
    ],
  },
  {
    id: "event-7",
    title: "Emotional Intelligence for Leaders",
    date: "2025-06-20",
    time: "02:00 PM - 05:00 PM",
    location: "Conference Room A",
    description:
      "Develop emotional intelligence to foster better team dynamics and leadership. This workshop explores self-awareness, self-regulation, empathy, and social skills, providing practical tools to enhance your leadership presence and influence.",
    category: "Soft Skills",
    capacity: 20,
    registered: 18,
    speakers: [
      {
        name: "Dr. Rohan Mehta",
        role: "Leadership Consultant",
        bio: "Focuses on emotional intelligence and team performance.",
      },
    ],
    materials: ["EI Workbook", "Self-Assessment Tools"],
    prerequisites: "None.",
    agenda: [
      "02:00 PM - 02:45 PM: Understanding Emotional Intelligence & Its Importance",
      "02:45 PM - 03:45 PM: Developing Self-Awareness and Self-Regulation",
      "03:45 PM - 04:45 PM: Cultivating Empathy and Social Skills",
      "04:45 PM - 05:00 PM: Action Planning for EI Development",
    ],
  },
  {
    id: "event-8",
    title: "Lean Six Sigma Green Belt Certification",
    date: "2025-06-21",
    time: "09:00 AM - 05:00 PM",
    location: "Training Hall 2",
    description:
      "Become certified in Lean Six Sigma methodologies for process improvement. This course covers the DMAIC (Define, Measure, Analyze, Improve, Control) methodology, statistical tools, and practical application in manufacturing and service industries. Prepare for your Green Belt certification.",
    category: "Quality",
    capacity: 20,
    registered: 8,
    speakers: [
      {
        name: "Mr. Suresh Reddy",
        role: "Master Black Belt",
        bio: "Certified Lean Six Sigma trainer with extensive industry experience.",
      },
    ],
    materials: ["Lean Six Sigma Manual", "Statistical Software Guide"],
    prerequisites: "Basic understanding of statistics.",
    agenda: [
      "09:00 AM - 11:00 AM: Introduction to Lean Six Sigma & Define Phase",
      "11:00 AM - 01:00 PM: Measure Phase: Data Collection & Analysis",
      "01:00 PM - 02:00 PM: Lunch Break",
      "02:00 PM - 04:00 PM: Analyze Phase: Root Cause Analysis & Tools",
      "04:00 PM - 05:00 PM: Improve & Control Phases Overview",
    ],
  },
  {
    id: "event-9",
    title: "Data Privacy and GDPR Compliance",
    date: "2025-06-22",
    time: "10:00 AM - 01:00 PM",
    location: "IT Lab 3",
    description:
      "Understand data privacy regulations and ensure compliance with GDPR. This course provides an overview of key principles, individual rights, data breach notification requirements, and best practices for handling personal data in a compliant manner. Essential for all employees handling customer or employee data.",
    category: "Legal",
    capacity: 30,
    registered: 12,
    speakers: [
      {
        name: "Ms. Anjali Devi",
        role: "Legal Counsel, Data Privacy",
        bio: "Specializes in data protection laws and compliance.",
      },
    ],
    materials: ["GDPR Compliance Guide", "Privacy Policy Template"],
    prerequisites: "None.",
    agenda: [
      "10:00 AM - 11:00 AM: Overview of Data Privacy Laws & Regulations",
      "11:00 AM - 12:00 PM: GDPR Principles, Rights & Obligations",
      "12:00 PM - 01:00 PM: Data Breach Response & Best Practices",
    ],
  },
  {
    id: "event-10",
    title: "Advanced Excel for Data Analysis",
    date: "2025-06-23",
    time: "09:00 AM - 01:00 PM",
    location: "Computer Lab 1",
    description:
      "Master advanced Excel functions for efficient data manipulation and analysis. This hands-on workshop covers complex formulas (e.g., INDEX-MATCH, array formulas), pivot tables, data validation, conditional formatting, and basic VBA for automation. Elevate your Excel skills for robust data insights.",
    category: "Technical",
    capacity: 40,
    registered: 25,
    speakers: [
      { name: "Mr. Deepak Sharma", role: "Financial Modeler", bio: "Expert in advanced Excel for business analytics." },
    ],
    materials: ["Excel Advanced Workbook", "Practice Datasets"],
    prerequisites: "Basic Excel knowledge.",
    agenda: [
      "09:00 AM - 10:30 AM: Advanced Formulas & Functions (INDEX-MATCH, SUMIFS, etc.)",
      "10:30 AM - 12:00 PM: Dynamic Pivot Tables & Charts for Reporting",
      "12:00 PM - 01:00 PM: Data Validation, Conditional Formatting & Basic VBA Macros",
    ],
  },
  {
    id: "event-11",
    title: "Conflict Resolution Skills",
    date: "2025-06-24",
    time: "02:00 PM - 05:00 PM",
    location: "Conference Room C",
    description:
      "Learn strategies to effectively resolve workplace conflicts. This workshop provides tools for understanding conflict styles, mediation techniques, and practicing constructive communication to de-escalate tensions and find mutually beneficial solutions. Essential for team leads and managers.",
    category: "Soft Skills",
    capacity: 25,
    registered: 10,
    speakers: [
      {
        name: "Ms. Kavita Rao",
        role: "HR & Mediation Specialist",
        bio: "Experienced in workplace mediation and conflict coaching.",
      },
    ],
    materials: ["Conflict Resolution Guide", "Role-Play Scenarios"],
    prerequisites: "None.",
    agenda: [
      "02:00 PM - 02:45 PM: Understanding Conflict Styles & Triggers",
      "02:45 PM - 03:45 PM: Effective Mediation Techniques & Active Listening",
      "03:45 PM - 04:45 PM: Practicing Resolution Strategies & Difficult Conversations",
      "04:45 PM - 05:00 PM: Personal Action Plan for Conflict Management",
    ],
  },
  {
    id: "event-12",
    title: "Introduction to Machine Learning",
    date: "2025-06-25",
    time: "09:00 AM - 04:00 PM",
    location: "IT Lab 2",
    description:
      "A beginner-friendly introduction to machine learning concepts and algorithms. Explore supervised and unsupervised learning, model evaluation, and practical applications using Python's scikit-learn library. Ideal for those looking to understand the basics of AI and data science.",
    category: "Technical",
    capacity: 35,
    registered: 18,
    speakers: [
      { name: "Dr. Arjun Singh", role: "AI Research Scientist", bio: "Specializes in applied machine learning." },
    ],
    materials: ["ML Basics Handbook", "Python Code Samples"],
    prerequisites: "Basic programming knowledge (preferably Python).",
    agenda: [
      "09:00 AM - 10:30 AM: What is Machine Learning? Core Concepts",
      "10:30 AM - 12:00 PM: Supervised Learning: Regression & Classification",
      "12:00 PM - 01:00 PM: Unsupervised Learning: Clustering & Dimensionality Reduction",
      "01:00 PM - 02:00 PM: Lunch Break",
      "02:00 PM - 03:00 PM: Model Evaluation & Overfitting",
      "03:00 PM - 04:00 PM: Hands-on with Scikit-learn & Simple Models",
    ],
  },
  {
    id: "event-13",
    title: "Financial Literacy for Employees",
    date: "2025-06-26",
    time: "10:00 AM - 01:00 PM",
    location: "Training Hall 3",
    description:
      "Improve personal financial management skills and investment knowledge. This course covers budgeting, saving, debt management, basic investment principles, and retirement planning. Empower yourself with the knowledge to make informed financial decisions.",
    category: "Finance",
    capacity: 50,
    registered: 30,
    speakers: [
      {
        name: "Mr. Sanjeev Kumar",
        role: "Financial Advisor",
        bio: "Certified financial planner with 15+ years experience.",
      },
    ],
    materials: ["Financial Planning Guide", "Budgeting Templates"],
    prerequisites: "None.",
    agenda: [
      "10:00 AM - 11:00 AM: Budgeting, Saving & Debt Management",
      "11:00 AM - 12:00 PM: Introduction to Investments (Stocks, Bonds, Mutual Funds)",
      "12:00 PM - 01:00 PM: Retirement Planning & Insurance Basics",
    ],
  },
  {
    id: "event-14",
    title: "Digital Marketing Essentials",
    date: "2025-06-27",
    time: "09:00 AM - 05:00 PM",
    location: "Marketing Suite",
    description:
      "Learn the core concepts of digital marketing, including SEO, social media marketing, content marketing, and email marketing. This comprehensive course provides practical strategies to enhance online presence and drive engagement. Ideal for marketing professionals and business owners.",
    category: "Marketing",
    capacity: 30,
    registered: 15,
    speakers: [
      { name: "Ms. Rina Das", role: "Digital Marketing Strategist", bio: "Leads digital campaigns for major brands." },
    ],
    materials: ["Digital Marketing Playbook", "SEO Checklist"],
    prerequisites: "None.",
    agenda: [
      "09:00 AM - 11:00 AM: Introduction to Digital Marketing & Strategy",
      "11:00 AM - 01:00 PM: Search Engine Optimization (SEO) & SEM",
      "01:00 PM - 02:00 PM: Lunch Break",
      "02:00 PM - 04:00 PM: Social Media Marketing & Content Creation",
      "04:00 PM - 05:00 PM: Email Marketing & Analytics",
    ],
  },
  {
    id: "event-15",
    title: "Workplace Wellness Program",
    date: "2025-06-28",
    time: "11:00 AM - 12:30 PM",
    location: "Gymnasium",
    description:
      "A session on maintaining physical and mental well-being at work. Learn stress management techniques, ergonomic tips for office setups, and mindfulness exercises to improve focus and reduce burnout. Prioritize your health for better productivity and quality of life.",
    category: "Wellness",
    capacity: 60,
    registered: 40,
    speakers: [
      { name: "Dr. Preeti Sharma", role: "Wellness Coach", bio: "Promotes holistic well-being in corporate settings." },
    ],
    materials: ["Wellness Tips Handout", "Mindfulness Exercises Guide"],
    prerequisites: "None.",
    agenda: [
      "11:00 AM - 11:45 AM: Stress Management Techniques & Resilience Building",
      "11:45 AM - 12:15 PM: Ergonomics at Work & Physical Well-being",
      "12:15 PM - 12:30 PM: Mindfulness & Short Meditation Practices",
    ],
  },
  {
    id: "event-16",
    title: "Advanced Python for Automation",
    date: "2025-07-05",
    time: "09:00 AM - 05:00 PM",
    location: "IT Lab 1",
    description:
      "This course focuses on using Python for advanced automation tasks, including scripting for system administration, web scraping, and API interactions. Learn to write efficient and robust automation scripts to streamline your workflows and improve productivity.",
    category: "Technical",
    capacity: 30,
    registered: 10,
    speakers: [
      { name: "Mr. Rohan Gupta", role: "DevOps Engineer", bio: "Specializes in Python automation and infrastructure." },
    ],
    materials: ["Python Automation Guide", "Code Snippets"],
    prerequisites: "Intermediate Python programming skills.",
    agenda: [
      "09:00 AM - 11:00 AM: Advanced Python Concepts & Libraries",
      "11:00 AM - 01:00 PM: System Automation & Scripting",
      "01:00 PM - 02:00 PM: Lunch Break",
      "02:00 PM - 04:00 PM: Web Scraping & API Automation",
      "04:00 PM - 05:00 PM: Error Handling & Best Practices in Automation",
    ],
  },
  {
    id: "event-17",
    title: "Effective Negotiation Skills",
    date: "2025-07-10",
    time: "10:00 AM - 01:00 PM",
    location: "Conference Room B",
    description:
      "Develop powerful negotiation skills applicable in various professional contexts. Learn strategies for preparation, active listening, identifying interests, and closing deals effectively. This workshop includes role-playing and feedback sessions.",
    category: "Soft Skills",
    capacity: 25,
    registered: 8,
    speakers: [
      {
        name: "Ms. Leena Kapoor",
        role: "Business Consultant",
        bio: "Expert in negotiation and strategic partnerships.",
      },
    ],
    materials: ["Negotiation Playbook", "Case Studies"],
    prerequisites: "None.",
    agenda: [
      "10:00 AM - 11:00 AM: Principles of Effective Negotiation & Preparation",
      "11:00 AM - 12:00 PM: Active Listening & Identifying Interests",
      "12:00 PM - 01:00 PM: Negotiation Tactics & Closing Strategies",
    ],
  },
  {
    id: "event-18",
    title: "Introduction to Data Visualization with Power BI",
    date: "2025-07-15",
    time: "09:00 AM - 04:00 PM",
    location: "Computer Lab 2",
    description:
      "Learn to create compelling dashboards and reports using Microsoft Power BI. This course covers data import, transformation, modeling, and visualization techniques to turn raw data into actionable insights. Ideal for business analysts and data enthusiasts.",
    category: "Digital Tools",
    capacity: 35,
    registered: 12,
    speakers: [{ name: "Mr. Vivek Singh", role: "BI Developer", bio: "Specializes in Power BI and data warehousing." }],
    materials: ["Power BI Workbook", "Sample Datasets"],
    prerequisites: "Basic Excel knowledge.",
    agenda: [
      "09:00 AM - 10:30 AM: Power BI Interface & Data Import",
      "10:30 AM - 12:00 PM: Data Transformation with Power Query",
      "12:00 PM - 01:00 PM: Data Modeling & DAX Basics",
      "01:00 PM - 02:00 PM: Lunch Break",
      "02:00 PM - 03:00 PM: Creating Visualizations & Dashboards",
      "03:00 PM - 04:00 PM: Publishing & Sharing Reports",
    ],
  },
  {
    id: "event-19",
    title: "Strategic Thinking for Managers",
    date: "2025-07-20",
    time: "09:00 AM - 05:00 PM",
    location: "Executive Training Center",
    description:
      "Develop strategic thinking capabilities to drive organizational growth and innovation. This workshop covers environmental scanning, competitive analysis, strategic planning frameworks, and decision-making under uncertainty. Essential for senior managers and department heads.",
    category: "Leadership",
    capacity: 20,
    registered: 7,
    speakers: [
      { name: "Dr. Ananya Bose", role: "Strategy Consultant", bio: "Former CEO with expertise in corporate strategy." },
    ],
    materials: ["Strategic Planning Guide", "Case Studies"],
    prerequisites: "Managerial experience.",
    agenda: [
      "09:00 AM - 11:00 AM: Understanding Strategic Thinking & Its Importance",
      "11:00 AM - 01:00 PM: Environmental Analysis & Competitive Advantage",
      "01:00 PM - 02:00 PM: Lunch Break",
      "02:00 PM - 04:00 PM: Strategic Planning Frameworks & Implementation",
      "04:00 PM - 05:00 PM: Measuring & Adapting Strategy",
    ],
  },
  {
    id: "event-20",
    title: "Effective Time Management & Productivity",
    date: "2025-07-25",
    time: "02:00 PM - 05:00 PM",
    location: "Training Hall 3",
    description:
      "Master techniques for effective time management and boosting personal productivity. Learn about prioritization, goal setting, overcoming procrastination, and leveraging tools to manage your workload efficiently. Improve your work-life balance and achieve more.",
    category: "Soft Skills",
    capacity: 40,
    registered: 20,
    speakers: [
      { name: "Mr. Karan Sharma", role: "Productivity Expert", bio: "Author of 'The Productive Professional'." },
    ],
    materials: ["Time Management Workbook", "Productivity Planner"],
    prerequisites: "None.",
    agenda: [
      "02:00 PM - 02:45 PM: Understanding Your Time & Productivity Habits",
      "02:45 PM - 03:45 PM: Prioritization Techniques & Goal Setting",
      "03:45 PM - 04:45 PM: Overcoming Procrastination & Building Focus",
      "04:40 PM - 05:00 PM: Tools & Technologies for Productivity",
    ],
  },
  {
    id: "event-21",
    title: "Introduction to IoT for Industrial Applications",
    date: "2025-08-01",
    time: "09:00 AM - 05:00 PM",
    location: "Innovation Lab",
    description:
      "Explore the fundamentals of Industrial Internet of Things (IIoT) and its applications in manufacturing. Learn about sensors, connectivity, data processing, and how IIoT can optimize plant operations, predictive maintenance, and supply chain efficiency.",
    category: "Technical",
    capacity: 25,
    registered: 5,
    speakers: [
      {
        name: "Dr. Vikram Rao",
        role: "IoT Solutions Architect",
        bio: "Leads IIoT implementations for large enterprises.",
      },
    ],
    materials: ["IIoT Handbook", "Case Studies"],
    prerequisites: "Basic understanding of industrial processes.",
    agenda: [
      "09:00 AM - 11:00 AM: Introduction to IoT & IIoT Concepts",
      "11:00 AM - 01:00 PM: Sensors, Actuators & Connectivity Protocols",
      "01:00 PM - 02:00 PM: Lunch Break",
      "02:00 PM - 04:00 PM: Data Processing & Cloud Platforms for IIoT",
      "04:00 PM - 05:00 PM: IIoT Applications in Manufacturing & Predictive Maintenance",
    ],
  },
  {
    id: "event-22",
    title: "Advanced Leadership Coaching",
    date: "2025-08-08",
    time: "10:00 AM - 04:00 PM",
    location: "Executive Training Center",
    description:
      "This advanced workshop is designed for experienced leaders looking to enhance their coaching skills. Learn advanced coaching models, active listening techniques, and how to empower your team members for peak performance and professional growth. Includes peer coaching sessions.",
    category: "Leadership",
    capacity: 15,
    registered: 3,
    speakers: [
      { name: "Ms. Ritu Sharma", role: "Executive Coach", bio: "Certified professional coach with global experience." },
    ],
    materials: ["Advanced Coaching Manual", "Coaching Frameworks"],
    prerequisites: "Prior leadership experience and basic coaching knowledge.",
    agenda: [
      "10:00 AM - 11:30 AM: Advanced Coaching Models & Principles",
      "11:30 AM - 01:00 PM: Deep Listening & Powerful Questioning",
      "01:00 PM - 02:00 PM: Lunch Break",
      "02:00 PM - 03:30 PM: Peer Coaching Sessions & Feedback",
      "03:30 PM - 04:00 PM: Developing a Coaching Culture",
    ],
  },
  {
    id: "event-23",
    title: "Sustainable Manufacturing Practices",
    date: "2025-08-15",
    time: "09:00 AM - 01:00 PM",
    location: "Environmental Center",
    description:
      "Learn about sustainable manufacturing practices, including waste reduction, energy efficiency, and circular economy principles. This course highlights how Tata Steel can integrate environmental responsibility into its operations for long-term sustainability and compliance.",
    category: "Operations",
    capacity: 30,
    registered: 10,
    speakers: [
      { name: "Dr. Sanjay Mehta", role: "Environmental Scientist", bio: "Specializes in industrial sustainability." },
    ],
    materials: ["Sustainability Report", "Best Practices Guide"],
    prerequisites: "None.",
    agenda: [
      "09:00 AM - 10:00 AM: Introduction to Sustainable Manufacturing",
      "10:00 AM - 11:00 AM: Waste Reduction & Resource Efficiency",
      "11:00 AM - 12:00 PM: Energy Management & Renewable Solutions",
      "12:00 PM - 01:00 PM: Circular Economy & Green Supply Chain",
    ],
  },
  {
    id: "event-24",
    title: "Blockchain for Business",
    date: "2025-08-22",
    time: "02:00 PM - 05:00 PM",
    location: "IT Lab 3",
    description:
      "An introduction to blockchain technology and its potential applications in business, beyond cryptocurrencies. Explore concepts like distributed ledgers, smart contracts, and use cases in supply chain, finance, and data security. Understand how blockchain can transform industries.",
    category: "Emerging Tech",
    capacity: 40,
    registered: 15,
    speakers: [
      { name: "Mr. Akash Singh", role: "Blockchain Consultant", bio: "Advises companies on blockchain adoption." },
    ],
    materials: ["Blockchain Basics", "Use Case Examples"],
    prerequisites: "None.",
    agenda: [
      "02:00 PM - 02:45 PM: What is Blockchain? Core Concepts",
      "02:45 PM - 03:45 PM: Smart Contracts & Decentralized Applications",
      "03:45 PM - 04:45 PM: Business Use Cases of Blockchain",
      "04:45 PM - 05:00 PM: Future Trends & Q&A",
    ],
  },
]

export const techNews: TechNews[] = [
  {
    id: "news-1",
    title: "Tata Steel Launches AI-Powered Predictive Maintenance System",
    source: "Tata Steel Newsroom",
    url: "https://www.tatasteel.com/media/newsroom/tata-steel-lunches-ai-powered-predictive-maintenance-system",
    content:
      "Tata Steel has successfully implemented an advanced AI-powered predictive maintenance system across its major plants. This new system leverages machine learning algorithms to analyze real-time data from machinery, predicting potential failures before they occur. Early results show a significant reduction in unplanned downtime and maintenance costs, enhancing operational efficiency and safety. This initiative is part of Tata Steel's broader digital transformation strategy to integrate cutting-edge technologies into its core operations.",
    category: "Company News",
    date: new Date("2025-06-20T10:00:00"),
  },
  {
    id: "news-2",
    title: "Breakthrough in Green Hydrogen Production for Steelmaking",
    source: "Renewable Energy World",
    url: "https://www.renewableenergyworld.com/hydrogen/breakthrough-in-green-hydrogen-production-for-steelmaking/",
    content:
      "Scientists have announced a significant breakthrough in the cost-effective production of green hydrogen, a crucial element for decarbonizing heavy industries like steelmaking. New electrolysis methods promise to lower the price of green hydrogen, making it a more viable alternative to fossil fuels in blast furnaces. This development is a game-changer for the steel industry's efforts to achieve net-zero emissions and aligns with Tata Steel's commitment to sustainable practices and exploring alternative energy sources.",
    category: "Sustainability",
    date: new Date("2025-06-19T14:30:00"),
  },
  {
    id: "news-3",
    title: "Industry 4.0: Smart Factories Drive Productivity Gains",
    source: "Manufacturing Today",
    url: "https://www.manufacturingtoday.com/industry-4-0-smart-factories-drive-productivity-gains",
    content:
      "The adoption of Industry 4.0 principles, including IoT, AI, and automation, is leading to unprecedented productivity gains in manufacturing sectors worldwide. Smart factories, characterized by interconnected systems and data-driven decision-making, are optimizing production lines, improving quality control, and enabling more agile responses to market demands. This trend is particularly relevant for steel manufacturers looking to enhance competitiveness and operational excellence through digital integration.",
    category: "Technology",
    date: new Date("2025-06-18T09:00:00"),
  },
  {
    id: "news-4",
    title: "Cybersecurity in OT: Protecting Industrial Control Systems",
    source: "Industrial Cyber",
    url: "https://www.industrialcyber.com/cybersecurity-in-ot-protecting-industrial-control-systems",
    content:
      "As industrial operations become increasingly digitized, the cybersecurity of Operational Technology (OT) systems is paramount. New strategies and technologies are emerging to protect critical infrastructure, including steel plants, from cyber threats. This involves robust network segmentation, continuous monitoring, and specialized threat intelligence tailored for industrial control systems. Ensuring the resilience of OT environments is crucial for maintaining uninterrupted production and safeguarding against potential disruptions.",
    category: "Cybersecurity",
    date: new Date("2025-06-17T11:45:00"),
  },
  {
    id: "news-5",
    title: "Advancements in Material Science: Self-Healing Alloys",
    source: "Science Daily",
    url: "https://www.sciencedaily.com/releases/2025/06/250616100000.htm",
    content:
      "Researchers have made significant strides in developing self-healing metal alloys that can repair microscopic cracks and damage autonomously. This breakthrough has immense implications for industries relying on durable materials, such as steel manufacturing. Self-healing properties could extend the lifespan of machinery, reduce maintenance needs, and enhance the safety of critical components, leading to more resilient and sustainable industrial operations.",
    category: "Innovation",
    date: new Date("2025-06-16T16:00:00"),
  },
  {
    id: "news-6",
    title: "Digital Twins Revolutionize Plant Design and Optimization",
    source: "Engineering News-Record",
    url: "https://www.enr.com/articles/digital-twins-revolutionize-plant-design-and-optimization",
    content:
      "Digital twin technology is transforming how industrial plants are designed, operated, and optimized. By creating virtual replicas of physical assets and processes, engineers can simulate scenarios, predict performance, and identify inefficiencies before they impact real-world operations. This technology enables predictive maintenance, process optimization, and enhanced training, offering significant benefits for complex facilities like steel plants in improving efficiency and reducing operational risks.",
    category: "Technology",
    date: new Date("2025-06-15T08:30:00"),
  },
]

export const testimonials: Testimonial[] = [
  {
    name: "Rajesh Kumar",
    role: "Plant Manager",
    text: "The SAP PM training transformed how we handle maintenance operations. Our efficiency improved by 30%.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Data Analyst",
    text: "The Data Analytics course gave me the skills to make data-driven decisions that impact our bottom line. Highly recommended!",
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "Safety Officer",
    text: "Safety training modules are comprehensive and practical. They've helped reduce incidents significantly across our facility.",
    rating: 5,
  },
  {
    name: "Deepa Singh",
    role: "HR Business Partner",
    text: "The soft skills training, especially on communication, has greatly enhanced our team's collaboration. It's been a game changer for internal projects.",
    rating: 4,
  },
  {
    name: "Suresh Rao",
    role: "Production Engineer",
    text: "The advanced Excel course was incredibly useful. I can now automate reports that used to take hours, saving valuable time.",
    rating: 5,
  },
  {
    name: "Anjali Devi",
    role: "Logistics Coordinator",
    text: "Understanding supply chain optimization through the technical courses has made my work much more efficient. Truly impactful learning.",
    rating: 4,
  },
  {
    name: "Karan Johar",
    role: "IT Specialist",
    text: "The cybersecurity fundamentals training provided crucial insights and practices that help us protect sensitive company data daily.",
    rating: 5,
  },
  {
    name: "Meena Gupta",
    role: "Marketing Executive",
    text: "The Generative AI & Creativity module opened my eyes to new possibilities for content creation and strategic thinking.",
    rating: 4,
  },
]

export const discussionPosts: DiscussionPost[] = [
  {
    id: "1",
    author: "Priya Sharma",
    timestamp: "2025-06-10T10:30:00Z",
    content:
      "Just finished the first module on 'Advanced Steel Metallurgy'. Very insightful! Anyone else finding the phase transformations section challenging?",
    replies: [
      {
        id: "1-1",
        author: "Rajesh Kumar",
        timestamp: "2025-06-10T11:00:00Z",
        content:
          "Yes, Priya! I found it a bit dense too. The diagrams helped, but I'm planning to re-watch that lecture.",
        replies: [],
      },
      {
        id: "1-2",
        author: "Anjali Singh",
        timestamp: "2025-06-10T14:15:00Z",
        content: "Try looking at the supplementary materials. There's a great animation that clarifies the concepts.",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    author: "Vikram Reddy",
    timestamp: "2025-06-08T09:00:00Z",
    content:
      "The 'Industrial Safety & Risk Management' course is excellent. The real-world case studies are particularly impactful. Highly recommend it for all plant personnel.",
    replies: [],
  },
  {
    id: "3",
    author: "Sneha Gupta",
    timestamp: "2025-06-05T16:45:00Z",
    content:
      "Has anyone applied the 'Lean Principles' from the Supply Chain Optimization course to their daily work? I'm looking for practical examples.",
    replies: [
      {
        id: "3-1",
        author: "Arjun Das",
        timestamp: "2025-06-06T09:30:00Z",
        content:
          "Yes, Sneha! We used it to optimize our raw material handling process. Saw a 15% reduction in waste. Happy to share more details if you want to connect offline.",
        replies: [],
      },
    ],
  },
  {
    id: "d1",
    author: "Alice Johnson",
    timestamp: "2024-05-10T10:00:00Z",
    module: "Introduction to AI in Manufacturing",
    content: "What are the most common challenges when implementing AI in legacy manufacturing systems?",
    replies: 5,
  },
  {
    id: "d2",
    author: "Bob Williams",
    timestamp: "2024-05-09T14:30:00Z",
    module: "Advanced Robotics for Automation",
    content: "Has anyone used ROS (Robot Operating System) for industrial robot control? Any tips?",
    replies: 2,
  },
  {
    id: "d3",
    author: "Charlie Brown",
    timestamp: "2024-05-08T09:15:00Z",
    module: "Sustainable Manufacturing Practices",
    content: "Looking for examples of successful waste-to-energy initiatives in steel production.",
    replies: 1,
  },
]

// Dummy data for charts
export const chartData: ChartData = {
  barChartData: [
    { name: "Module A", value: 75 },
    { name: "Module B", value: 80 },
    { name: "Module C", value: 60 },
    { name: "Module D", value: 90 },
  ],
  lineChartData: [
    { name: "Week 1", progress: 10 },
    { name: "Week 2", progress: 25 },
    { name: "Week 3", progress: 40 },
    { name: "Week 4", progress: 60 },
    { name: "Week 5", progress: 75 },
  ],
  pieChartData: [
    { name: "Completed", value: 70 },
    { name: "In Progress", value: 20 },
    { name: "Not Started", value: 10 },
  ],
}

// Dummy data for Training Reports Dashboard
export const learnerProgressData: LearnerProgress[] = [
  {
    name: "Rahul Sharma",
    course: "Microsoft Excel - Basic",
    progress: 85,
    timeSpent: 28,
    quizScore: 92,
    completed: false,
    department: "Finance",
  },
  {
    name: "Priya Singh",
    course: "React JS",
    progress: 100,
    timeSpent: 60,
    quizScore: 95,
    completed: true,
    department: "IT",
  },
  {
    name: "Amit Kumar",
    course: "SAP PM (Plant Maintenance)",
    progress: 70,
    timeSpent: 56,
    quizScore: 88,
    completed: false,
    department: "Operations",
  },
  {
    name: "Deepa Mehta",
    course: "Generative AI & Creativity",
    progress: 100,
    timeSpent: 24,
    quizScore: 98,
    completed: true,
    department: "R&D",
  },
  {
    name: "Rajeshwari Devi",
    course: "Data Analytics & Data Science",
    progress: 45,
    timeSpent: 40,
    quizScore: 75,
    completed: false,
    department: "Analytics",
  },
  {
    name: "Rahul Sharma",
    course: "Digital Transformation",
    progress: 60,
    timeSpent: 30,
    quizScore: 80,
    completed: false,
    department: "Finance",
  },
  {
    name: "Priya Singh",
    course: "Leadership Development",
    progress: 100,
    timeSpent: 50,
    quizScore: 90,
    completed: true,
    department: "IT",
  },
  {
    name: "Amit Kumar",
    course: "Technical Excellence",
    progress: 90,
    timeSpent: 70,
    quizScore: 85,
    completed: false,
    department: "Operations",
  },
]

export const teamReportData: TeamReport[] = [
  {
    department: "Finance",
    avgCompletionRate: 75,
    mostCompletedPath: "Digital Transformation",
    members: 120,
  },
  {
    department: "IT",
    avgCompletionRate: 88,
    mostCompletedPath: "Technical Excellence",
    members: 85,
  },
  {
    department: "Operations",
    avgCompletionRate: 65,
    mostCompletedPath: "Safety & Compliance",
    members: 300,
  },
  {
    department: "R&D",
    avgCompletionRate: 92,
    mostCompletedPath: "Emerging Technologies",
    members: 50,
  },
  {
    department: "HR",
    avgCompletionRate: 80,
    mostCompletedPath: "Leadership Development",
    members: 60,
  },
]

export const moduleEngagementData: ModuleEngagement[] = [
  {
    module: "Communication",
    enrollments: 250,
    dropOffRate: 15,
    feedbackScore: 4.5,
  },
  {
    module: "Team Building",
    enrollments: 180,
    dropOffRate: 10,
    feedbackScore: 4.7,
  },
  {
    module: "SAP Systems",
    enrollments: 120,
    dropOffRate: 20,
    feedbackScore: 4.2,
  },
  {
    module: "Workplace Safety",
    enrollments: 300,
    dropOffRate: 5,
    feedbackScore: 4.8,
  },
  {
    module: "Generative AI & Creativity",
    enrollments: 90,
    dropOffRate: 25,
    feedbackScore: 4.6,
  },
  {
    module: "Microsoft Excel - Basic",
    enrollments: 200,
    dropOffRate: 12,
    feedbackScore: 4.4,
  },
]

export const certificateTrackingData: CertificateTracking[] = [
  {
    learner: "Priya Singh",
    path: "Digital Transformation",
    dateIssued: "2025-05-20T00:00:00Z",
    validity: "Lifetime",
  },
  {
    learner: "Deepa Mehta",
    path: "Emerging Technologies",
    dateIssued: "2025-06-10T00:00:00Z",
    validity: "Lifetime",
  },
  {
    learner: "Rajesh Kumar",
    path: "Leadership Development",
    dateIssued: "2025-04-15T00:00:00Z",
    validity: "3 years",
  },
  {
    learner: "Suresh Rao",
    path: "Technical Excellence",
    dateIssued: "2025-03-01T00:00:00Z",
    validity: "5 years",
  },
  {
    learner: "Anjali Devi",
    path: "Digital Transformation",
    dateIssued: "2025-05-25T00:00:00Z",
    validity: "Lifetime",
  },
  {
    learner: "Karan Johar",
    path: "Technical Excellence",
    dateIssued: "2025-06-05T00:00:00Z",
    validity: "5 years",
  },
]
