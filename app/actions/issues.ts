"use server"

import { getDb } from "@/lib/db"
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
  appVersion?: string
  androidVersion?: string
  deviceModel?: string
  screenshots?: string[]
}

const VALID_CATEGORIES = ["bug", "feature", "suggestion"] as const
const VALID_TYPES = ["critical", "high", "normal", "low"] as const

async function postToGitHubIssues(data: IssueData) {
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN
  if (!token) return null

  try {
    const categoryLabel = data.category.toUpperCase()
    const priorityLabel = (data.priority || data.type || "normal").toUpperCase()
    const title = `[${categoryLabel}] [${priorityLabel}] ${data.title}`

    const sysInfo = [
      data.appVersion ? `**NevPlay Version**: \`${data.appVersion}\`` : null,
      data.androidVersion ? `**Android OS**: \`${data.androidVersion}\`` : null,
      data.deviceModel ? `**Device Model**: \`${data.deviceModel}\`` : null,
    ]
      .filter(Boolean)
      .join("  \n")

    let body = `### ${data.title}

**Category**: \`${data.category}\`  
**Priority**: \`${priorityLabel}\`  
**Submitter Contact**: ${data.email ? `\`${data.email}\`` : "*No email provided*"}  
${sysInfo ? `${sysInfo}  \n` : ""}**Submitted via**: NevPlay Website Issue Form  

---

### Description
${data.description}
`

    if (data.screenshots && data.screenshots.length > 0) {
      body += `\n\n---\n### Screenshots & Attachments\n`
      data.screenshots.forEach((src, idx) => {
        body += `\n![Screenshot ${idx + 1}](${src})\n`
      })
    }

    const res = await fetch("https://api.github.com/repos/nevanstudio/nevplay_releases/issues", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `token ${token}`,
        "User-Agent": "NevPlaySite",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body,
        labels: [data.category],
      }),
    })

    if (!res.ok) {
      console.error("[GitHub Issues] API response not OK:", res.status, await res.text())
      return null
    }

    const issueObj = await res.json()
    return issueObj.html_url as string
  } catch (err) {
    console.error("[GitHub Issues] Failed to post:", err)
    return null
  }
}

export type GitHubIssueStats = {
  open: number
  closed: number
  total: number
}

/** Fetch open/closed issue counts from GitHub (1 hour cache) */
export async function getGitHubIssueStats(): Promise<GitHubIssueStats> {
  const token = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "NevPlaySite",
  }
  if (token) headers["Authorization"] = `token ${token}`

  try {
    const res = await fetch(
      "https://api.github.com/repos/nevanstudio/nevplay_releases/issues?state=all&per_page=100",
      {
        headers,
        next: { revalidate: 3600 },
      }
    )

    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        const issuesOnly = data.filter((item: any) => !item.pull_request)
        const open = issuesOnly.filter((item: any) => item.state === "open").length
        const closed = issuesOnly.filter((item: any) => item.state === "closed").length
        return { open, closed, total: open + closed }
      }
    }
  } catch (err) {
    console.error("[getGitHubIssueStats] Error:", err)
  }

  // Fallback to database count if GitHub API fails
  try {
    const db = await getDb()
    if (db) {
      const all = await db.select({ id: userIssues.id, status: userIssues.status }).from(userIssues)
      const open = all.filter((i: any) => i.status === "open").length
      const closed = all.filter((i: any) => i.status === "closed" || i.status === "resolved").length
      return { open, closed, total: all.length }
    }
  } catch {
    // Ignore fallback error
  }

  return { open: 0, closed: 0, total: 0 }
}

export async function submitIssue(data: IssueData) {
  try {
    if (!data.title || !data.description) {
      return { success: false, error: "Title and description are required" }
    }
    if (data.title.length > 255) {
      return { success: false, error: "Title must be less than 255 characters" }
    }
    if (data.description.length > 5000) {
      return { success: false, error: "Description must be less than 5000 characters" }
    }
    if (!VALID_CATEGORIES.includes(data.category)) {
      return { success: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}` }
    }
    if (!VALID_TYPES.includes(data.type)) {
      return { success: false, error: `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}` }
    }

    // 1. Post to GitHub Issues
    const githubIssueUrl = await postToGitHubIssues(data)

    // 2. Save to database if available
    let issueId = `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const db = await getDb()
    if (db) {
      try {
        const result = await db
          .insert(userIssues)
          .values({
            id: issueId,
            title: data.title,
            description: data.description,
            category: data.category,
            type: data.type || "normal",
            email: data.email || "",
            attachments: data.screenshots ? JSON.stringify(data.screenshots) : null,
            status: "open",
          })
          .returning({ id: userIssues.id })
        if (result[0]?.id) issueId = result[0].id
      } catch (dbErr) {
        console.warn("[Issues Action] DB insert warning:", dbErr)
      }
    }

    revalidatePath("/issues")

    return {
      success: true,
      issueId,
      githubUrl: githubIssueUrl,
      message: githubIssueUrl
        ? "Your report was received and logged to our tracker! We'll review it shortly."
        : "Issue submitted successfully. Thank you for your feedback!",
    }
  } catch (error) {
    console.error("[Issues Action] Error:", error)
    return { success: false, error: "Failed to submit issue. Please try again." }
  }
}

export async function getRecentIssues(limit = 10) {
  try {
    const db = await getDb()
    if (!db) return []

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
