import { db } from "@/lib/db"
import { userIssues } from "@/lib/db/schema"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      title,
      description,
      category,
      type,
      priority,
      email,
      attachments,
    } = body

    // Validation
    if (!title || !description || !category || !type) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: [
            "title",
            "description",
            "category",
            "type",
          ],
        },
        { status: 400 }
      )
    }

    // Validate category and type
    const validCategories = ["bug", "feature", "suggestion"]
    const validTypes = [
      "critical",
      "high",
      "normal",
      "low",
    ]

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(", ")}` },
        { status: 400 }
      )
    }

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    // Insert issue
    const result = await db
      .insert(userIssues)
      .values({
        id: `issue-${Date.now()}`,
        title: title.substring(0, 255),
        description,
        category,
        type,
        email: email ? email.substring(0, 255) : "",
        attachments: attachments ? JSON.stringify(attachments) : null,
        status: "open",
      })
      .returning({ id: userIssues.id })

    return NextResponse.json(
      {
        success: true,
        message: "Issue submitted successfully",
        issueId: result[0].id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[Issues API] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit issue", message: String(error) },
      { status: 500 }
    )
  }
}
