import { db } from "@/lib/db"
import { issues } from "@/lib/db/schema"
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
    if (!title || !description || !category || !type || !priority) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: [
            "title",
            "description",
            "category",
            "type",
            "priority",
          ],
        },
        { status: 400 }
      )
    }

    // Validate category, type, and priority
    const validCategories = ["bug", "feature", "suggestion"]
    const validTypes = [
      "critical",
      "high",
      "normal",
      "low",
    ]
    const validPriorities = [
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

    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(", ")}` },
        { status: 400 }
      )
    }

    // Insert issue
    const result = await db
      .insert(issues)
      .values({
        title: title.substring(0, 255),
        description,
        category,
        type,
        priority,
        email: email ? email.substring(0, 255) : null,
        attachments: attachments ? JSON.stringify(attachments) : null,
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: issues.id })

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
