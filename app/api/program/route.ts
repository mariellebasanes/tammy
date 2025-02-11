import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { program, specialization } = await request.json()

    if (!program || !specialization) {
      return NextResponse.json(
        {
          message: "Program and specialization are required",
        },
        { status: 400 },
      )
    }

    // Here you would typically save the program data to your database
    return NextResponse.json(
      {
        message: "Program selection saved successfully",
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

