"use client"

import { useState } from "react"
import { User, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"

export default function LoginForm() {
  const [studentId, setStudentId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/profile")
      } else {
        setError(data.message || "Invalid credentials")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
        <h1 className="text-center text-[#4CD137] text-3xl font-bold mb-8">TAMSCHED</h1>

        {error && <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="STUDENT ID"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CD137] placeholder:text-gray-400 placeholder:text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4CD137] placeholder:text-gray-400 placeholder:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4CD137] text-white py-3 rounded-xl hover:bg-[#45BD32] transition-colors"
          >
            LOG IN
          </button>

          <div className="text-center">
            <a href="#" className="text-gray-400 text-sm hover:text-gray-500">
              FORGOT PASSWORD?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

