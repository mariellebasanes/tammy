import { NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]

    console.log("Received message:", lastMessage.content)

    const pythonProcess = spawn("python", [path.join(process.cwd(), "services/nlp_processor.py"), lastMessage.content])

    return new Promise((resolve, reject) => {
      let output = ""
      let errorOutput = ""

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString()
      })

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString()
      })

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error("Python script error:", errorOutput)
          return reject(new Error(`Python script exited with code ${code}`))
        }

        try {
          const nlpResult = JSON.parse(output)
          console.log("Parsed NLP result:", nlpResult)

          if (nlpResult.error) {
            console.error("NLP processing error:", nlpResult.error)
            return resolve(NextResponse.json({ role: "assistant", content: nlpResult.error }, { status: 500 }))
          }

          return resolve(NextResponse.json({
            role: "assistant",
            content: nlpResult.response_message,
            schedules: nlpResult.schedules || []  // Include schedules in the response
          }))
        } catch (error) {
          console.error("Failed to parse NLP result:", error)
          return resolve(NextResponse.json({ role: "assistant", content: "I'm sorry, I couldn't process your request due to a technical issue. Please try again later." }, { status: 500 }))
        }
      })
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

