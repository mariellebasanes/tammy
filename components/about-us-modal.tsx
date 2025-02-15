import type React from "react"
import { X } from "lucide-react"

interface AboutUsModalProps {
  onClose: () => void
}

const AboutUsModal: React.FC<AboutUsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">About TamSched</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p>
            TamSched is an innovative class scheduling assistant designed to help students at Tam University efficiently
            plan their academic journey. Our AI-powered system takes into account your preferences, course requirements,
            and available time slots to generate optimized class schedules.
          </p>
          <p>
            With TamSched, you can easily explore course offerings, set your preferences, and receive personalized
            schedule recommendations tailored to your academic goals. Our user-friendly interface and intelligent
            chatbot make the process of creating your ideal class schedule easier than ever before.
          </p>
          <p>
            At TamSched, we're committed to enhancing the student experience by simplifying the often complex task of
            course planning. Whether you're a freshman just starting your college journey or a senior finalizing your
            last semester, TamSched is here to help you make the most of your academic career.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUsModal

