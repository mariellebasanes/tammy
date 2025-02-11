"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"

export default function ProfileSetup() {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(data.redirect)
      } else {
        setError(data.message || "Something went wrong")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl p-12 bg-white rounded-3xl shadow-lg">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12 px-12">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#4CD137] text-white flex items-center justify-center mb-2">
              1
            </div>
            <span className="text-[#4CD137] text-sm">Profile</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-2">
              2
            </div>
            <span className="text-gray-400 text-sm">Program</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-2">
              3
            </div>
            <span className="text-gray-400 text-sm">Prerequisites</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">What should we call you?</h1>
            <p className="text-gray-400">Create your profile</p>
          </div>

          {error && <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name or nickname"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CD137] placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="w-full bg-[#4CD137] text-white py-3 rounded-xl hover:bg-[#45BD32] transition-colors"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

