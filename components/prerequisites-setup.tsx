"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

type YearCourses = {
  [key: string]: string[]
}

const courses: YearCourses = {
  "First Year": [
    "Introduction to Programming",
    "Computer Hardware",
    "Mathematics I",
    "Digital Logic",
    "Communication Skills",
    "Physics",
    "Critical Thinking",
  ],
  "Second Year": [
    "Data Structures",
    "Object-Oriented Programming",
    "Database Systems",
    "Web Development",
    "Mathematics II",
    "Operating Systems",
    "Network Fundamentals",
  ],
  "Third Year": [
    "Software Engineering",
    "Mobile Development",
    "System Analysis",
    "Cloud Computing",
    "Cybersecurity",
    "Project Management",
    "AI Fundamentals",
  ],
  "Fourth Year": [
    "Capstone Project",
    "Advanced Programming",
    "IT Ethics",
    "Enterprise Systems",
    "Data Analytics",
    "IT Governance",
    "Industry Practicum",
  ],
}

export default function PrerequisitesSetup() {
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
  const router = useRouter()

  const toggleCourse = (course: string) => {
    const newSelected = new Set(selectedCourses)
    if (newSelected.has(course)) {
      newSelected.delete(course)
    } else {
      newSelected.add(course)
    }
    setSelectedCourses(newSelected)
  }

  const handleNext = async () => {
    try {
      const response = await fetch("/api/prerequisites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completedCourses: Array.from(selectedCourses),
        }),
      })

      if (response.ok) {
        // Use replace instead of push to prevent going back to prerequisites
        router.replace("/loading")
      }
    } catch (error) {
      console.error("Failed to save prerequisites:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl p-12 bg-white rounded-3xl shadow-lg">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12 px-12">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#4CD137] text-white flex items-center justify-center mb-2">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-[#4CD137] text-sm">Profile</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#4CD137] text-white flex items-center justify-center mb-2">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-[#4CD137] text-sm">Program</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#4CD137] text-white flex items-center justify-center mb-2">
              3
            </div>
            <span className="text-[#4CD137] text-sm">Prerequisites</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Which courses have you completed?</h1>
          <p className="text-gray-400">You can always change them later</p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(courses).map(([year, yearCourses]) => (
            <div key={year} className="space-y-4">
              <h2 className="text-lg font-medium text-[#4CD137] mb-4">{year}</h2>
              {yearCourses.map((course) => (
                <button
                  key={course}
                  onClick={() => toggleCourse(course)}
                  className={`w-full text-left px-4 py-3 rounded-full border-2 transition-colors ${
                    selectedCourses.has(course)
                      ? "bg-[#4CD137] border-[#4CD137] text-white"
                      : "border-gray-200 hover:border-[#4CD137] hover:text-[#4CD137]"
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button onClick={() => router.back()} className="px-6 py-2 text-gray-600 hover:text-gray-800">
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-[#4CD137] text-white rounded-xl hover:bg-[#45BD32] transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

