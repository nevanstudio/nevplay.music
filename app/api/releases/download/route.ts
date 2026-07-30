import { db } from "@/lib/db"
import { releases, betaReleases, downloadLogs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { releaseId, releaseType = "stable", appName = "NevPlay" } = body

    if (!releaseId || !releaseType) {
      return NextResponse.json(
        { error: "Missing required fields: releaseId, releaseType" },
        { status: 400 }
      )
    }

    // Get client IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown"

    // Log the download
    await db.insert(downloadLogs).values({
      releaseId: parseInt(releaseId),
      releaseType,
      appName,
      ipAddress: ip,
      downloadedAt: new Date(),
    })

    // Update download count
    const table = releaseType === "beta" ? betaReleases : releases
    const releaseRecord = await db
      .select()
      .from(table)
      .where(eq(table.id, parseInt(releaseId)))
      .limit(1)

    if (releaseRecord.length > 0) {
      const currentCount = releaseRecord[0].downloadCount || 0
      await db
        .update(table)
        .set({ downloadCount: currentCount + 1 })
        .where(eq(table.id, parseInt(releaseId)))
    }

    return NextResponse.json({
      success: true,
      message: "Download tracked successfully",
    })
  } catch (error) {
    console.error("[Download Tracking] Error:", error)
    return NextResponse.json(
      { error: "Failed to track download", message: String(error) },
      { status: 500 }
    )
  }
}
