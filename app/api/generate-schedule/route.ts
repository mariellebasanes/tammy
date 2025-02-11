import { NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(req: Request) {
  try {
    const { preferences } = await req.json()

    const pythonProcess = spawn("python", [
      path.join(process.cwd(), "services/scheduler.py"),
      JSON.stringify(preferences),
    ])

    return new Promise((resolve, reject) => {
      let result = ""
      let error = ""

      pythonProcess.stdout.on("data", (data) => {
        result += data.toString()
      })

      pythonProcess.stderr.on("data", (data) => {
        error += data.toString()
      })

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          resolve(
            NextResponse.json(
              {
                error: "Failed to generate schedule",
              },
              { status: 500 },
            ),
          )
        } else {
          try {
            const schedules = JSON.parse(result)
            resolve(NextResponse.json({ schedules }, { status: 200 }))
          } catch (e) {
            resolve(
              NextResponse.json(
                {
                  error: "Invalid schedule data",
                },
                { status: 500 },
              ),
            )
          }
        }
      })
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

