"use server"

import { db } from "@/lib/db"
import { releases, betaReleases, downloadLogs } from "@/lib/db/schema"
import { desc, sql } from "drizzle-orm"

export async function getStableReleases() {
  try {
    const data = await db
      .select()
      .from(releases)
      .orderBy(desc(releases.createdAt))
      .limit(20)
    return data
  } catch (error) {
    console.error("[Releases Action] Error fetching stable releases:", error)
    return []
  }
}

export async function getBetaReleases() {
  try {
    const data = await db
      .select()
      .from(betaReleases)
      .orderBy(desc(betaReleases.createdAt))
      .limit(10)
    return data
  } catch (error) {
    console.error("[Releases Action] Error fetching beta releases:", error)
    return []
  }
}

export async function getLatestStableRelease() {
  try {
    const data = await db
      .select()
      .from(releases)
      .orderBy(desc(releases.createdAt))
      .limit(1)
    return data[0] || null
  } catch (error) {
    console.error("[Releases Action] Error fetching latest release:", error)
    return null
  }
}

export async function getLatestBetaRelease() {
  try {
    const data = await db
      .select()
      .from(betaReleases)
      .orderBy(desc(betaReleases.createdAt))
      .limit(1)
    return data[0] || null
  } catch (error) {
    console.error("[Releases Action] Error fetching latest beta:", error)
    return null
  }
}

export async function getTotalDownloads() {
  try {
    const stableSum = await db
      .select({
        total: sql`SUM(${releases.downloadCount})`,
      })
      .from(releases)

    const betaSum = await db
      .select({
        total: sql`SUM(${betaReleases.downloadCount})`,
      })
      .from(betaReleases)

    const stableTotal = stableSum[0]?.total ? Number(stableSum[0].total) : 0
    const betaTotal = betaSum[0]?.total ? Number(betaSum[0].total) : 0

    return stableTotal + betaTotal
  } catch (error) {
    console.error("[Releases Action] Error calculating total downloads:", error)
    return 0
  }
}

export async function trackDownload(
  releaseId: number,
  releaseType: "stable" | "beta"
) {
  try {
    const ip = "unknown"

    // Log download
    await db.insert(downloadLogs).values({
      releaseId,
      releaseType,
      appName: "NevPlay",
      ipAddress: ip,
      downloadedAt: new Date(),
    })

    // Update count
    const table = releaseType === "beta" ? betaReleases : releases
    const record = await db
      .select()
      .from(table)
      .where(sql`id = ${releaseId}`)
      .limit(1)

    if (record.length > 0) {
      const newCount = (record[0].downloadCount || 0) + 1
      await db
        .update(table)
        .set({ downloadCount: newCount })
        .where(sql`id = ${releaseId}`)
    }

    return { success: true }
  } catch (error) {
    console.error("[Releases Action] Error tracking download:", error)
    return { success: false, error: String(error) }
  }
}
