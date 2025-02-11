import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { completedCourses } = await request.json()

    if (!Array.isArray(completedCourses)) {
      return NextResponse.json(
        {
          message: "Invalid data format",
        },
        { status: 400 },
      )
    }

    // Here you would typically save the completed courses to your database
    return NextResponse.json(
      {
        message: "Prerequisites saved successfully",
      },
      { status: 200 },
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

