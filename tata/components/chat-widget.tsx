"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2 } from "lucide-react"
import { chatResponses } from "../lib/chat-responses"
import { Configuration, OpenAIApi } from "openai"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  actions?: Array<{
    label: string
    action: () => void
    variant?: "primary" | "secondary"
  }>
}

// Add FAQ and resource data
const FAQS = [
  { q: "What is the leave policy?", a: "Tata Steel provides annual, casual, sick, and special leaves. Please refer to the Employee Handbook or HR portal for detailed leave entitlements and procedures." },
  { q: "When is the salary credited?", a: "Salary is usually credited to employees' bank accounts on the last working day of each month." },
  { q: "What medical benefits are available?", a: "Employees and their dependents are eligible for comprehensive medical coverage, including hospitalization, outpatient care, and post-retirement benefits as per company policy." },
  { q: "Where can I find the list of company holidays?", a: "The list of company holidays is published annually on the HR portal and is also available in the Employee Handbook." },
  { q: "How do I raise a grievance?", a: "You can raise grievances through the 'Samadhan' platform, your HR representative, or the formal grievance redressal channels outlined in the Employee Handbook." },
  { q: "Who do I contact in case of an emergency?", a: "In case of emergency, contact the site security or the emergency helpline number listed on the HR portal and displayed at all major locations." },
  // Additional FAQs
  { q: "What is the probation period for new employees?", a: "The standard probation period is 6 months, after which performance is reviewed for confirmation." },
  { q: "How does the promotion policy work?", a: "Promotions are based on performance, experience, and available opportunities. Details are available in the HR policy documents." },
  { q: "What is the transfer policy?", a: "Transfers may be initiated based on business needs or employee requests, subject to management approval and company policy." },
  { q: "Are canteen facilities available?", a: "Yes, canteen facilities are available at all major locations, offering subsidized meals to employees." },
  { q: "Are transport facilities provided?", a: "Transport facilities are provided on select routes. Please check with the admin department for route details and eligibility." },
  { q: "What is the policy on maternity and paternity leave?", a: "Maternity and paternity leave are provided as per statutory requirements and company policy. Please refer to the Employee Handbook or HR portal for details." },
]

const RESOURCES = [
  { name: "Safety Guidelines PDF", url: "https://swp.dddgov.in/assets/pdf/Safety_Guidelines_For_Iron_Steel_Sector.pdf" },
  { name: "Onboarding Handbook", url: "https://www.tatasteel.com/corporate/our-organisation/policies/" },
]

const TSK_DETAIL = `**Tata Steel Kalinganagar (TSK) - Detailed Overview**\n\nThe Kalinganagar project’s foundation was laid with a Memorandum of Understanding (MoU) signed with the Government of Odisha on November 17, 2004, securing 3,471.808 acres of land, with 2,500 acres allotted by the Industrial Development Corporation of Odisha (IDCO) in 2005. A technical collaboration MoU with Nippon Steel Corporation on August 28, 2005, ensured global expertise, while the Odisha Government committed to allocating an iron ore mine upon 25% project completion.\n\nThe project’s journey included challenges, such as a 2006 incident of police firing and a subsequent road blockade by villagers, prompting Tata Steel to launch the “Tata Steel Parivar” Rehabilitation and Resettlement (R&R) initiative. This community-focused program, started in 2006, fostered trust, leading to the blockade’s withdrawal in 2008 and over 50% voluntary land contributions by 2009. Construction resumed with boundary wall work in 2010, and the Tata Steel Board approved a revised scheme in 2011, marking the start of site development.\n\n**Key Data Points**\n- **Founded:** 1907, Asia’s first integrated private sector steel company.\n- **Global Reach:** Operations in 26 countries, commercial presence in 50+ countries, 78,000+ employees.\n- **Capacity:** 35 MTPA crude steel globally; Kalinganagar: 8 MTPA (expanded from 3 MTPA in Phase II).\n- **FY25 Performance:** US$26 billion turnover.\n- **Kalinganagar Investment:** Rs 27,000 crore (Phase II).\n- **Land:** 3,471.808 acres (2,500 acres allotted in 2005).\n- **MoUs:** Odisha Government (Nov 17, 2004), Nippon Steel (Aug 28, 2005).\n\n**Major Facilities**\n- **Blast Furnace:** 5,870 m³, 3.2 MTPA.\n- **SMS:** 3 MTPA.\n- **HSM:** 5.5 MTPA (supports 8 MTPA).\n- **Coke Oven:** 1.5 MTPA (2 x 88 ovens).\n- **Sinter Plant:** 5.75 MTPA (496 m²).\n- **Lime Plant:** 0.4 MTPA (2 x 600 TPD).\n- **Coke Plant, Cold Rolling Mill:** Phase II additions.\n- **Power Plant:** 202.5 MW (3 x 67.5 MW).\n\nThese facilities, complemented by a new 5,870 m³ Blast Furnace with eco-friendly design and long campaign life, enable maximum steel output with a minimal carbon footprint, embodying Tata Steel’s tribute to a sustainable new India. The plant’s strategic location and connectivity enhance its ability to exceed expectations, delivering advanced high-strength steels for diverse applications.\n\n**Innovations**\n- **Going Digital:** A customized in-house e-auction tool for securing metallurgical coal supplies digitally.\n- **S4 Hana:** First integrated steel plant in India to implement this platform, featuring a “Universal Journal” architecture for enhanced stakeholder mobility.\n- **Re-engineering Procurement:** A digital catalogue-based buying platform with commodity price prediction, analytics-powered negotiation tools, and end-to-end contract lifecycle management.\n- **On A Roll:** During the India lockdown, supplied over 140 isolation and quarantine cabins across the country within three months.\n- **Green Tech:** The CRM Bara pond in Jamshedpur harvested 82,320 m³ of rainwater in FY20, promoting sustainability.\n- **No Wasting Waste:** The Iron & Steel Making Division (IBMD) developed paver blocks from LD slag, enabling waste utilization and environmental protection.\n- **Alternative Materials:** Exploration of Fiber Reinforced Polymers and Graphene for extraordinary strength, lightweight properties, and corrosion resistance in electric vehicles and medical equipment.\n- **Hyperform® Automotive Steel:** 800 MPa strength, 20% lighter, designed to reduce vehicular CO2 emissions while ensuring safety, developed in collaboration with partners.\n\nThese innovations underscore Tata Steel’s leadership in digital steelmaking, earning Global Lighthouse recognition from the World Economic Forum for its Jamshedpur, Kalinganagar, and IJmuiden plants, and the 2024 “Digital Enterprise of India – Steel” Award from Economic Times CIO.\n\n**Community Development**\n- **Training Farmers:** Enhancing agricultural productivity and livelihoods.\n- **Skill Development Centers:** Establishing facilities for vocational training.\n- **Skill Development Training:** Imparting employable skills to local youth.\n- **Entrepreneurship Development:** Supporting local entrepreneurs with resources and guidance.\n- **'1000 Schools' Project:** Improving educational infrastructure across the region.\n- **Tata Steel - Medica Super Specialty Hospital:** Providing advanced healthcare services.\n- **Construction of Model Schools:** Building modern educational facilities.\n- **Jyoti Fellowship:** Offering educational scholarships to deserving students.\n\nThese initiatives, part of the Tata Steel Parivar program, have strengthened community ties and supported regional development.\n\n**Global Impact**\nTata Steel Kalinganagar’s global impact is evident in iconic projects like the Burj Khalifa (using ComFlor® 80 decking), Bandra-Worli Sea Link (with LRPC strands), and contributions to 8 metro rail networks and 32 modern airports with Tiscon ReadyBuild and Tata Structura steel sections. The plant also produces Tata Pravesh doors and windows, crafted for durability and sustainability, addressing environmentally-conscious customer needs.\n\n**Sustainability**\nSustainability is a core focus, with Kalinganagar designed for minimal carbon footprint, supported by certifications like ResponsibleSteel™ for over 90% of India’s steel production. The plant has received the 2025 Steel Sustainability Champion award from worldsteel for eight consecutive years, the 2023 Climate Change Leadership Award from CDP, and rankings among the top 10 in the DJSI Corporate Sustainability Assessment since 2016. Additionally, the Gopalpur Industrial Park (GIP), set up by Tata Steel Special Economic Zone Limited, is driving green industrial transformation, with foundation stones laid by Hon’ble CM Shri Mohan Charan Majhi on June 5, 2025, for projects worth over ₹20,500 crore in green hydrogen, solar manufacturing, and specialty chemicals.\n\n**Leadership & Awards**\nUnder the leadership of CEO & Managing Director T. V. Narendran, the Phase II expansion, inaugurated on May 22, 2025, marks a landmark moment for Odisha and India’s steel industry. This expansion, featuring India’s largest Blast Furnace and advanced technologies, reinforces Kalinganagar’s role in building a self-reliant India. Tata Steel’s accolades include the Prime Minister’s Trophy for 2016-17, “Most Ethical Company” 2021 from Ethisphere Institute, and “Best Corporate for Promotion of Sports” 2024 at Sportstar Aces Awards, reflecting its commitment to excellence and social impact.\n\nIn essence, Tata Steel Limited, Kalinganagar, is more than a steel plant—it is a symbol of innovation, sustainability, and inclusive growth. With its state-of-the-art facilities, digital transformation, and community-centric approach, it embodies the spirit of #WeAlsoMakeTomorrow, shaping a future-ready industrial hub in Odisha and beyond.\n\n**Kalinganagar Milestones**\n- **2004:** MoU signed with the Government of Odisha on November 17, 2004, for a 6 MTPA integrated steel plant at Kalinganagar Industrial Complex, Duburi, Jajpur district.\n- **2005:** 2,500 acres of land allotted by IDCO to Tata Steel, laying the groundwork for site development.\n- **2006:** Tata Steel Parivar Rehabilitation and Resettlement (R&R) initiative launched to support displaced families.\n- **2008:** Road blockade withdrawn by villagers, signaling a restoration of trust.\n- **2009:** Over 50% of affected land acquired voluntarily.\n- **2010:** Boundary wall construction resumed.\n- **2011:** Site construction began.\n- **2015:** First phase of the steel plant commissioned on November 18, 2015.\n- **2016:** Commercial production commenced in May 2016.\n- **2018:** Groundbreaking ceremony for Phase II expansion held on November 12, 2018.\n- **2019:** Adivasi protest march held on January 2, 2019.\n- **2021:** Supply of Liquid Medical Oxygen (LMO) via Oxygen Express started on May 9, 2021.\n- **2022:** 12 transgender individuals onboarded as Crane Operator Trainees on February 21, 2022.\n- **2024:** India’s largest blast furnace (5,870 m³) commissioned on September 20, 2024.\n- **2025 (May 22):** Phase II inaugurated by Hon’ble Chief Minister Shri Mohan Charan Majhi, increasing capacity from 3 MTPA to 8 MTPA.\n- **Ongoing:** Commitment to Net Zero by 2045, with Kalinganagar designed for minimal carbon footprint.\n\n[Read the full press release](https://www.tatasteel.com/newsroom/press-releases/india/2025/tata-steel-inaugurates-phase-ii-expansion-of-kalinganagar-operations/)\n`;

const MOCK_PROGRESS = [
  { course: "Leadership Essentials", progress: 80 },
  { course: "Safety Training", progress: 100 },
  { course: "Digital Skills", progress: 45 },
]

const EMPLOYEE_HANDBOOK = {
  name: "Employee Handbook PDF",
  url: "https://www.tatasteel.com/media/13915/tsl_ir21_final.pdf",
  description: "Click below to download the Employee Handbook PDF."
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your Tata Steel Learning Assistant. I can help you with course registrations, certificate downloads, training events, tech news, and accessing learning resources. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [file, setFile] = useState<File | null>(null)

  // Persistent chat history
  useEffect(() => {
    const saved = localStorage.getItem("chat-messages")
    if (saved) setMessages(JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })))
  }, [])
  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages))
  }, [messages])

  // Event reminders (mocked)
  const setEventReminder = (eventTitle: string) => {
    localStorage.setItem("event-reminder", JSON.stringify({ eventTitle, time: Date.now() }))
    alert(`Reminder set for: ${eventTitle}`)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true)
    }
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false)
    }
  }, [isOpen])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // FAQ quick action: show all FAQs if user asks for FAQ
    if (text.toLowerCase().includes("faq")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: FAQS.map(faq => `Q: ${faq.q}\nA: ${faq.a}`).join("\n\n"),
            sender: "bot",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 800)
      return
    }
    // FAQ quick answers
    const faq = FAQS.find(f => text.toLowerCase().includes(f.q.toLowerCase()))
    if (faq) {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: faq.a,
          sender: "bot",
          timestamp: new Date(),
        }])
        setIsTyping(false)
      }, 800)
      return
    }
    // Resource download links
    if (text.toLowerCase().includes("download resource") || text.toLowerCase().includes("resource")) {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: `Here are some resources you can download:\n` + RESOURCES.map(r => `• [${r.name}](${r.url})`).join("\n"),
          sender: "bot",
          timestamp: new Date(),
          actions: RESOURCES.map(r => ({ label: r.name, action: () => {
            const link = document.createElement('a');
            link.href = r.url;
            link.download = r.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, variant: "primary" })),
        }])
        setIsTyping(false)
      }, 800)
      return
    }
    // About Tata Steel Kalinganagar (detailed)
    if (text.toLowerCase().includes("about tata steel kalinganagar") || text.toLowerCase().includes("about tsk")) {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: TSK_DETAIL,
          sender: "bot",
          timestamp: new Date(),
        }])
        setIsTyping(false)
      }, 800)
      return
    }
    // Course progress tracking
    if (text.toLowerCase().includes("my progress") || text.toLowerCase().includes("course progress")) {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: `Here is your course progress:\n` + MOCK_PROGRESS.map(p => `${p.course}: ${p.progress}%`).join("\n"),
          sender: "bot",
          timestamp: new Date(),
        }])
        setIsTyping(false)
      }, 800)
      return
    }
    // Feedback collection
    if (text.toLowerCase().includes("feedback")) {
      setShowFeedback(true)
      setIsTyping(false)
      return
    }
    // Employee Handbook
    if (text.toLowerCase().includes("employee handbook")) {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          text: EMPLOYEE_HANDBOOK.description,
          sender: "bot",
          timestamp: new Date(),
          actions: [
            {
              label: EMPLOYEE_HANDBOOK.name,
              action: () => {
                const link = document.createElement('a');
                link.href = EMPLOYEE_HANDBOOK.url;
                link.download = EMPLOYEE_HANDBOOK.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              },
              variant: "primary"
            }
          ]
        }])
        setIsTyping(false)
      }, 800)
      return
    }

    let response = chatResponses.getResponse(text.toLowerCase())

if (text.toLowerCase().includes("tech news")) {
  try {
    const newsRes = await fetch(
      "https://newsdata.io/api/1/latest?apikey=pub_435a52c41f174309b4357800e29821d0&category=technology,business&language=en&country=in"
    )
    const newsJson = await newsRes.json()
    const articles = newsJson.results || []

    if (articles.length > 0) {
      const topNews = articles
        .slice(0, 3)
        .map(
          (article: any, index: number) =>
            `📰 *${index + 1}. ${article.title}*\n🔗 ${article.link}`
        )
        .join("\n\n")

      response = {
        text: `🗞️ Here are the latest tech news updates:\n\n${topNews}`,
        actions: [],
      }
    } else {
      response = {
        text: "😕 Sorry, I couldn't find any recent tech news right now. Please check again soon.",
        actions: [],
      }
    }
  } catch (error) {
    console.error("❌ Error fetching tech news:", error)
    response = {
      text: "⚠️ Oops! Couldn't fetch news due to a network issue.",
      actions: [],
    }
  }
}


    if (response.text !== "fallback-llm") {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
        actions: response.actions?.map((action) => ({
          ...action,
          action: () => {
            if (action.type === "course-register") {
              alert(`Registration initiated for: ${action.data?.title || "Course"}`)
            } else if (action.type === "tech-news") {
              handleSendMessage("tech news")
            } else if (action.type === "browse-courses") {
              handleSendMessage("show me available courses")
            } else if (action.type === "about-snti") {
              handleSendMessage("about snti")
            } else if (action.type === "events") {
              handleSendMessage("What training events are coming up?")
            } else if (action.type === "certificate") {
              handleSendMessage("How can I download my certificate?")
            } else if (action.type === "event-reminder") {
              setEventReminder(action.data?.title || "Event")
            } else {
              alert(`Action: ${action.label}`)
            }
          },
        })),
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      }, 1000)
    } else {
      // 🔍 Handle unknown queries with LLM or News
      if (text.toLowerCase().includes("tech news") || text.toLowerCase().includes("latest news")) {
        const news = await fetch(
          "https://newsdata.io/api/1/latest?apikey=pub_435a52c41f174309b4357800e29821d0&category=technology,business&language=en&country=in"
        )
        const data = await news.json()
        const articles = data.results?.slice(0, 3)?.map((a: any) => `📰 ${a.title} - ${a.link}`).join("\n\n") || "No news available."
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: articles,
            sender: "bot",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      } else {
        const llmText = await fetchLLMResponse(text)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: llmText,
            sender: "bot",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }
    }
  }

  // 🔑 OpenAI LLM
  const fetchLLMResponse = async (userPrompt: string) => {
    try {
      const configuration = new Configuration({
        apiKey: "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",
      })
      const openai = new OpenAIApi(configuration)

      const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.7,
      })

      return res.data.choices[0]?.message?.content?.trim() || "I'm not sure, can you please rephrase?"
    } catch (error) {
      return "⚠️ Sorry, there was an error contacting the AI server."
    }
  }

  const quickActions = [
    { label: "Courses", text: "Show me available courses" },
    { label: "Tech News", text: "Latest tech news" },
    { label: "Events", text: "What training events are coming up?" },
    { label: "Certificate", text: "How can I download my certificate?" },
    { label: "FAQ", text: "What is SNTI?" },
    { label: "Resources", text: "Download resource" },
    { label: "My Progress", text: "My progress" },
    { label: "Feedback", text: "Feedback" },
    { label: "About TSK", text: "About Tata Steel Kalinganagar" },
    { label: "Employee Handbook", text: "Show me the Employee Handbook" },
  ]

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-20 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
        >
          <MessageCircle size={24} />
          {hasNewMessage && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Tata Steel Learning Assistant
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-20 z-50 transition-all duration-300 ${isMinimized ? "w-80 h-16" : "w-96 h-[600px]"} ${darkMode ? "bg-gray-900" : ""}`}>
      <div className={`bg-white ${darkMode ? "bg-gray-900 text-white" : ""} rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col`}>
        <div className={`bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between ${darkMode ? "from-gray-800 to-gray-900" : ""}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={16} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Tata Steel Learning Assistant</h3>
              <p className="text-blue-100 text-xs">Online • Ready to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setDarkMode((d) => !d)} className="text-white/80 hover:text-white p-1 rounded transition-colors" title="Toggle dark mode">
              {darkMode ? "🌙" : "☀️"}
            </button>
            <button onClick={() => setIsMinimized(!isMinimized)} className="text-white/80 hover:text-white p-1 rounded transition-colors">
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1 rounded transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className={`p-3 border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50"}`}>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(action.text)}
                    className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-blue-50 text-blue-700 hover:bg-blue-100"} text-xs font-medium`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${message.sender === "user" ? (darkMode ? "bg-blue-800 text-white" : "bg-blue-600 text-white") : (darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800 shadow-sm")}`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    {message.actions && (
                      <div className="mt-2 space-y-1">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={action.action}
                            className={`w-full px-2 py-1 rounded-lg text-xs font-medium transition-colors ${action.variant === "primary" ? (darkMode ? "bg-blue-800 text-white hover:bg-blue-900" : "bg-blue-600 text-white hover:bg-blue-700") : (darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className={darkMode ? "bg-gray-800 px-3 py-2 rounded-2xl shadow-sm" : "bg-white px-3 py-2 rounded-2xl shadow-sm"}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={`p-4 border-t ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <div className="flex space-x-2 items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                  placeholder="Type your message..."
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${darkMode ? "bg-gray-900 border-gray-700 text-white focus:ring-blue-900" : "border-gray-300 focus:ring-blue-500 focus:border-transparent"}`}
                />
                <input
                  type="file"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="chat-file-upload"
                />
                <label htmlFor="chat-file-upload" className={`px-2 py-2 rounded-lg cursor-pointer ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>📎</label>
                <button
                  onClick={() => handleSendMessage(inputText)}
                  className={`px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${darkMode ? "bg-blue-800 text-white hover:bg-blue-900" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                  disabled={!inputText.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
              {file && (
                <div className="mt-2 text-xs text-gray-500">Attached: {file.name}</div>
              )}
            </div>
            {showFeedback && (
              <div className={`absolute left-0 top-0 w-full h-full flex items-center justify-center bg-black/40 z-50`}>
                <div className={`bg-white p-6 rounded-xl shadow-xl w-80 ${darkMode ? "bg-gray-900 text-white" : ""}`}>
                  <h4 className="font-semibold mb-2">Feedback</h4>
                  <textarea
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    className={`w-full p-2 rounded border text-sm ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "border-gray-300"}`}
                    rows={3}
                    placeholder="Your feedback..."
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button onClick={() => setShowFeedback(false)} className={`px-3 py-1 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"}`}>Cancel</button>
                    <button onClick={() => { setShowFeedback(false); setFeedbackText(""); alert("Thank you for your feedback!") }} className={`px-3 py-1 rounded ${darkMode ? "bg-blue-800 text-white" : "bg-blue-600 text-white"}`}>Submit</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ChatWidget
