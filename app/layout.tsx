import "./globals.css"
import { Space_Grotesk } from "next/font/google"
import type React from "react" // Import React

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata = {
  title: "TAMSCHED - Login",
  description: "TAMSCHED Student Login",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>{children}</body>
    </html>
  )
}



import './globals.css'