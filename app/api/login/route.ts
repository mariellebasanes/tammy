import { NextResponse } from "next/server"

// Demo credentials - in a real app, these would be in a database
const DEMO_CREDENTIALS = {
  studentId: "student123",
  password: "password123",
}

export async function POST(request: Request) {
  try {
    const { studentId, password } = await request.json()

    if (!studentId || !password) {
      return NextResponse.json(
        {
          message: "Student ID and password are required",
        },
        { status: 400 },
      )
    }

    if (studentId === DEMO_CREDENTIALS.studentId && password === DEMO_CREDENTIALS.password) {
      return NextResponse.json(
        {
          message: "Login successful",
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        message: "Invalid student ID or password",
      },
      { status: 401 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred. Please try again.",
      },
      { status: 500 },
    )
  }
}

