import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        {
          message: "Name is required",
        },
        { status: 400 },
      )
    }

    // Here you would typically save the profile data to your database
    return NextResponse.json(
      {
        message: "Profile created successfully",
        redirect: "/program", // Next step in the setup process
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

