"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoadingScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="fixed inset-0 w-full h-full bg-[#4CD137] z-50">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex space-x-2 mb-4">
          <div className="w-3 h-3 bg-white rounded-full animate-[bounce_1s_infinite_-0.3s]"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-[bounce_1s_infinite_-0.15s]"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
        </div>
        <p className="text-white text-xl">Hold tight! We're setting things up for you...</p>
      </div>
    </div>
  )
}

