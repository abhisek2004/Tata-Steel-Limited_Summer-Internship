"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2 } from "lucide-react"
import { chatResponses } from "../lib/chat-responses" // Corrected import path

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

    // Simulate typing delay
    setTimeout(
      () => {
        const response = chatResponses.getResponse(text.toLowerCase())
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: "bot",
          timestamp: new Date(),
          actions: response.actions?.map((action) => ({
            ...action,
            action: () => {
              // Handle different action types
              if (action.type === "course-register") {
                alert(`Registration initiated for: ${action.data?.title || "Course"}`)
              } else if (action.type === "tech-news") {
                handleSendMessage("tech news")
              } else if (action.type === "browse-courses") {
                handleSendMessage("show me available courses")
              } else if (action.type === "about-snti") {
                handleSendMessage("about snti")
              } else if (action.type === "events") {
                // Added handler for 'events' action
                handleSendMessage("What training events are coming up?")
              } else if (action.type === "certificate") {
                // Added handler for 'certificate' action
                handleSendMessage("How can I download my certificate?")
              } else {
                alert(`Action: ${action.label}`)
              }
            },
          })),
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const quickActions = [
    { label: "Courses", text: "Show me available courses" },
    { label: "Tech News", text: "Latest tech news" },
    { label: "Events", text: "What training events are coming up?" },
    { label: "Certificate", text: "How can I download my certificate?" },
  ]

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-20 z-50">
        {" "}
        {/* Changed right-6 to right-20 */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
        >
          <MessageCircle size={24} />
          {hasNewMessage && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Tata Steel Learning Assistant
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div
      className={`fixed bottom-6 right-20 z-50 transition-all duration-300 ${
        // Changed right-6 to right-20
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
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
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/80 hover:text-white p-1 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            <div className="p-3 bg-gray-50 border-b">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(action.text)}
                    className="flex items-center justify-center p-2 rounded-lg transition-all duration-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                      message.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    {message.actions && (
                      <div className="mt-2 space-y-1">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={action.action}
                            className={`w-full px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                              action.variant === "primary"
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
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
                  <div className="bg-white px-3 py-2 rounded-2xl shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => handleSendMessage(inputText)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={!inputText.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ChatWidget
