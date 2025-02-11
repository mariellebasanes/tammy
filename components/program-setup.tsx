"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

type Program = "IT" | "CS" | "MA"
type Specialization = "AI" | "DS" | "CN" | "SD"

const specializations: Record<Program, Specialization[]> = {
  IT: ["CN", "SD"],
  CS: ["AI", "DS"],
  MA: [], // Multimedia Arts might have different specializations
}

const specializationLabels: Record<Specialization, string> = {
  AI: "Artificial Intelligence",
  DS: "Data Science",
  CN: "Computer Networks",
  SD: "Software Development",
}

export default function ProgramSetup() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null)
  const router = useRouter()

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program)
    setSelectedSpecialization(null) // Reset specialization when program changes
  }

  const handleNext = async () => {
    if (!selectedProgram || (specializations[selectedProgram].length > 0 && !selectedSpecialization)) return

    try {
      const response = await fetch("/api/program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          program: selectedProgram,
          specialization: selectedSpecialization,
        }),
      })

      if (response.ok) {
        router.push("/prerequisites")
      }
    } catch (error) {
      console.error("Failed to save program selection:", error)
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
              2
            </div>
            <span className="text-[#4CD137] text-sm">Program</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-2">
              3
            </div>
            <span className="text-gray-400 text-sm">Prerequisites</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">What Program Are You Taking?</h1>
          <p className="text-gray-400">Let's Personalize Based on Your Program</p>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => handleProgramSelect("IT")}
            className={`p-6 rounded-2xl text-white text-lg font-medium ${
              selectedProgram === "IT" ? "bg-[#8B5CF6] ring-4 ring-[#8B5CF6]/50" : "bg-[#8B5CF6]/90 hover:bg-[#8B5CF6]"
            } transition-all`}
          >
            Information Technology
          </button>
          <button
            onClick={() => handleProgramSelect("CS")}
            className={`p-6 rounded-2xl text-white text-lg font-medium ${
              selectedProgram === "CS" ? "bg-[#0EA5E9] ring-4 ring-[#0EA5E9]/50" : "bg-[#0EA5E9]/90 hover:bg-[#0EA5E9]"
            } transition-all`}
          >
            Computer Science
          </button>
          <button
            onClick={() => handleProgramSelect("MA")}
            className={`p-6 rounded-2xl text-white text-lg font-medium ${
              selectedProgram === "MA" ? "bg-[#EC4899] ring-4 ring-[#EC4899]/50" : "bg-[#EC4899]/90 hover:bg-[#EC4899]"
            } transition-all`}
          >
            Multimedia Arts
          </button>
        </div>

        {/* Specialization Section - Only show if a program is selected */}
        {selectedProgram && specializations[selectedProgram].length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Choose your specialization:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specializations[selectedProgram].map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`p-4 rounded-xl text-left ${
                    selectedSpecialization === spec
                      ? "border-[#4CD137] border-2 text-[#4CD137]"
                      : "border border-gray-200 hover:border-[#4CD137] hover:text-[#4CD137]"
                  } transition-all`}
                >
                  {specializationLabels[spec]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button onClick={() => router.back()} className="px-6 py-2 text-gray-600 hover:text-gray-800">
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedProgram || (specializations[selectedProgram].length > 0 && !selectedSpecialization)}
            className="px-6 py-2 bg-[#4CD137] text-white rounded-xl hover:bg-[#45BD32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

