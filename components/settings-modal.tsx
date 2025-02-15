"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface SettingsModalProps {
  onClose: () => void
}

interface YearCourses {
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

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [name, setName] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())

  // Fetch user data when component mounts
  useEffect(() => {
    // This should be replaced with an actual API call to get user data
    const fetchUserData = async () => {
      // Simulating API call
      const userData = {
        name: "John Doe",
        completedCourses: ["Introduction to Programming", "Mathematics I"],
      }
      setName(userData.name)
      setSelectedCourses(new Set(userData.completedCourses))
    }
    fetchUserData()
  }, [])

  const toggleCourse = (course: string) => {
    setSelectedCourses((prev) => {
      const newSelected = new Set(prev)
      if (newSelected.has(course)) {
        newSelected.delete(course)
      } else {
        newSelected.add(course)
      }
      return newSelected
    })
  }

  const handleSave = () => {
    // Implement save functionality here
    console.log("Saving settings:", { name, completedCourses: Array.from(selectedCourses) })
    // This should be replaced with an actual API call to update user data
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4CD137] focus:ring focus:ring-[#4CD137] focus:ring-opacity-50"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Update Completed Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Object.entries(courses).map(([year, yearCourses]) => (
                <div key={year} className="space-y-4">
                  <h4 className="text-md font-medium text-[#4CD137]">{year}</h4>
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
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#4CD137] text-white rounded-md hover:bg-[#45BD32] focus:outline-none focus:ring-2 focus:ring-[#4CD137] focus:ring-opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal

