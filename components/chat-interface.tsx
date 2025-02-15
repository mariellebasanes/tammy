"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send, User, Settings, Info, LogOut } from "lucide-react"
import { useChat } from "ai/react"
import ScheduleOptions from "./schedule-options"
import SettingsModal from "./settings-modal"
import AboutUsModal from "./about-us-modal"
import type React from "react"
import type { Schedule } from "@/data/dummyScheduleData"
import ScheduleDisplay from "./schedule-display"

interface SuggestionCard {
  title: string
  subtitle: string
}

const suggestions: SuggestionCard[] = [
  {
    title: "Available Subjects",
    subtitle: "What subjects can I take this term?",
  },
  {
    title: "Course Offerings",
    subtitle: "Is there a list of updated course offerings right now?",
  },
  {
    title: "Schedule Planning",
    subtitle: "Help me plan my class schedule",
  },
]

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, setMessages, isLoading } = useChat()
  const [chatStarted, setChatStarted] = useState(false)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showScheduleOptions, setShowScheduleOptions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      setChatStarted(true)
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  const handleSuggestionClick = (suggestion: SuggestionCard) => {
    handleInputChange({ target: { value: suggestion.subtitle } } as React.ChangeEvent<HTMLInputElement>)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { id: Date.now().toString(), role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setError(null)
    setSchedules([])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: data.content,
        },
      ])

      if (data.schedules && data.schedules.length > 0) {
        setSchedules(data.schedules)
        setShowScheduleOptions(true)
      }
    } catch (error) {
      console.error("Error in onSubmit:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        },
      ])
    }

    handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)
  }

  const handleLogout = () => {
    // Implement logout functionality here
    console.log("Logging out...")
    // For now, we'll just close the profile dropdown
    setIsProfileOpen(false)
  }

  const handleScheduleSelect = (schedule: Schedule) => {
    console.log("Schedule selected:", schedule)
    if (!schedule) {
      console.error("No schedule provided to handleScheduleSelect")
      return
    }
    setSelectedSchedule(schedule)
    setShowScheduleOptions(false)
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: `Here's the detailed view of Option ${schedules.indexOf(schedule) + 1}:`,
      },
    ])
    // Ensure the schedule display is visible
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FDF5]">
      <header className="bg-[#4CD137] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full"></div>
          <span className="text-white text-lg font-medium">TamSched</span>
        </div>
        <div className="relative">
          <button className="text-white flex items-center space-x-2" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <User className="w-6 h-6" />
            <span>Profile</span>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  setIsSettingsOpen(true)
                  setIsProfileOpen(false)
                }}
              >
                <Settings className="inline-block w-4 h-4 mr-2" />
                Settings
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  setIsAboutUsOpen(true)
                  setIsProfileOpen(false)
                }}
              >
                <Info className="inline-block w-4 h-4 mr-2" />
                About Us
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleLogout}
              >
                <LogOut className="inline-block w-4 h-4 mr-2" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        {!chatStarted ? (
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-8">How can I help you today?</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-6 rounded-2xl border border-gray-100 hover:border-[#4CD137] transition-colors text-left bg-white shadow-sm"
                >
                  <h3 className="font-medium text-gray-900 mb-2">{suggestion.title}</h3>
                  <p className="text-sm text-gray-400">{suggestion.subtitle}</p>
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your question here..."
                className="w-full px-4 py-3 pr-12 rounded-full border border-gray-200 focus:outline-none focus:border-[#4CD137] text-gray-600 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#4CD137] text-white"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-3xl h-[80vh] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "items-start space-x-2"} mb-4`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded bg-[#4CD137] flex items-center justify-center text-white text-xs">
                      ds
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === "user" ? "bg-[#4CD137] text-white" : "bg-white shadow-md"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start space-x-2 mb-4">
                  <div className="w-8 h-8 rounded bg-[#4CD137] flex items-center justify-center text-white text-xs">
                    ds
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-white shadow-md">
                    <div className="typing-animation">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              {showScheduleOptions && schedules.length > 0 && (
                <div className="mb-4">
                  <ScheduleOptions options={schedules} onSelect={handleScheduleSelect} />
                </div>
              )}
              {selectedSchedule && (
                <div className="mt-4">
                  <ScheduleDisplay schedule={selectedSchedule} />
                </div>
              )}
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">Error: {error}</div>}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={onSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Message TamSched"
                className="w-full px-4 py-3 pr-12 rounded-full border border-gray-200 focus:outline-none focus:border-[#4CD137] text-gray-600 placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#4CD137] text-white disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isAboutUsOpen && <AboutUsModal onClose={() => setIsAboutUsOpen(false)} />}
    </div>
  )
}

