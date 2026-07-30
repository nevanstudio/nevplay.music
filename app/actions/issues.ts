"use server"

import { db } from "@/lib/db"
import { userIssues } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type IssueData = {
  title: string
  description: string
  category: "bug" | "feature" | "suggestion"
  type: "critical" | "high" | "normal" | "low"
  priority: "critical" | "high" | "normal" | "low"
  email?: string
  attachments?: string[]
}

const VALID_CATEGORIES = ["bug", "feature", "suggestion"] as const
const VALID_TYPES = ["critical", "high", "normal", "low"] as const
const VALID_PRIORITIES = ["critical", "high", "normal", "low"] as const

export async function submitIssue(data: IssueData) {
  try {
    // Validation
    if (!data.title || !data.description) {
      return {
        success: false,
        error: "Title and description are required",
      }
    }

    if (data.title.length > 255) {
      return {
        success: false,
        error: "Title must be less than 255 characters",
      }
    }

    if (data.description.length > 5000) {
      return {
        success: false,
        error: "Description must be less than 5000 characters",
      }
    }

    if (!VALID_CATEGORIES.includes(data.category)) {
      return {
        success: false,
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
      }
    }

    if (!VALID_TYPES.includes(data.type)) {
      return {
        success: false,
        error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`,
      }
    }

    if (!VALID_PRIORITIES.includes(data.priority)) {
      return {
        success: false,
        error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}`,
      }
    }

    if (data.email && data.email.length > 255) {
      return {
        success: false,
        error: "Email must be less than 255 characters",
      }
    }

    // Insert issue
    const result = await db
      .insert(userIssues)
      .values({
        id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: data.title,
        description: data.description,
        category: data.category,
        type: data.type,
        email: data.email || "",
        attachments: data.attachments
          ? JSON.stringify(data.attachments)
          : null,
        status: "open",
      })
      .returning({ id: userIssues.id })

    revalidatePath("/issues")

    return {
      success: true,
      issueId: result[0].id,
      message: "Issue submitted successfully. Thank you for your feedback!",
    }
  } catch (error) {
    console.error("[Issues Action] Error:", error)
    return {
      success: false,
      error: "Failed to submit issue. Please try again.",
    }
  }
}

export async function getRecentIssues(limit = 10) {
  try {
    const data = await db
      .select()
      .from(userIssues)
      .orderBy(desc(userIssues.createdAt))
      .limit(limit)
    return data
  } catch (error) {
    console.error("[Issues Action] Error fetching issues:", error)
    return []
  }
}
