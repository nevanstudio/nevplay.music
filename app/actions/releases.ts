"use server"

import { getDb } from "@/lib/db"
import { stableReleases, betaReleases, downloadLogs } from "@/lib/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import { getReleases, findApkAsset, extractImageUrl, renderReleaseBody } from "@/lib/github"

export async function getStableReleases() {
  const db = await getDb()
  if (!db) {
    const releases = await getReleases()
    return releases.filter((r) => !r.prerelease).map(r => {
        const apkAsset = findApkAsset(r)
        return {
            id: r.tag_name,
            version: r.tag_name,
            title: r.name || r.tag_name,
            description: renderReleaseBody(r.body),
            releaseNotes: renderReleaseBody(r.body),
            imageUrl: extractImageUrl(r.body),
            apkUrl: apkAsset ? apkAsset.browser_download_url : null,
            downloadCount: 0,
            createdAt: new Date(r.published_at),
        }
    })
  }
  try {
    const data = await db
      .select()
      .from(stableReleases)
      .orderBy(desc(stableReleases.createdAt))
      .limit(20)
    return data
  } catch (error) {
    console.error("[Releases Action] Error fetching stable releases:", error)
    return []
  }
}


export async function getBetaReleases() {
  const db = await getDb()
  if (!db) {
    const releases = await getReleases()
    return releases.filter((r) => r.prerelease).map(r => {
        const apkAsset = findApkAsset(r)
        return {
            id: r.tag_name,
            version: r.tag_name,
            title: r.name || r.tag_name,
            description: renderReleaseBody(r.body),
            releaseNotes: renderReleaseBody(r.body),
            imageUrl: extractImageUrl(r.body),
            apkUrl: apkAsset ? apkAsset.browser_download_url : null,
            downloadCount: 0,
            createdAt: new Date(r.published_at),
        }
    })
  }
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
  const db = await getDb()
  if (!db) {
    const releases = await getReleases()
    const latest = releases.find((r) => !r.prerelease)
    if (!latest) return null
    const apkAsset = findApkAsset(latest)
    return {
      id: latest.tag_name,
      version: latest.tag_name,
      title: latest.name || latest.tag_name,
      description: renderReleaseBody(latest.body),
      releaseNotes: renderReleaseBody(latest.body),
      imageUrl: extractImageUrl(latest.body),
      apkUrl: apkAsset ? apkAsset.browser_download_url : null,
      downloadCount: 0,
      createdAt: new Date(latest.published_at),
    }
  }
  try {
    const data = await db
      .select()
      .from(stableReleases)
      .orderBy(desc(stableReleases.createdAt))
      .limit(1)
    return data[0] || null
  } catch (error) {
    console.error("[Releases Action] Error fetching latest release:", error)
    return null
  }
}

export async function getLatestBetaRelease() {
  const db = await getDb()
  if (!db) {
    const releases = await getReleases()
    const latestBeta = releases.find((r) => r.prerelease)
    if (!latestBeta) return null
    const apkAsset = findApkAsset(latestBeta)
    return {
      id: latestBeta.tag_name,
      version: latestBeta.tag_name,
      title: latestBeta.name || latestBeta.tag_name,
      description: renderReleaseBody(latestBeta.body),
      releaseNotes: renderReleaseBody(latestBeta.body),
      imageUrl: extractImageUrl(latestBeta.body),
      apkUrl: apkAsset ? apkAsset.browser_download_url : null,
      downloadCount: 0,
      createdAt: new Date(latestBeta.published_at),
    }
  }
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

const USE_CUSTOM_DOWNLOAD_COUNT = true
const CUSTOM_DOWNLOAD_COUNT = 232

export async function getTotalDownloads() {
  if (USE_CUSTOM_DOWNLOAD_COUNT) {
    return CUSTOM_DOWNLOAD_COUNT
  }

  const db = await getDb()
  if (!db) {
    const releases = await getReleases()
    return releases.reduce(
      (sum, r) => sum + r.assets.reduce((s, a) => s + a.download_count, 0),
      0,
    )
  }
  try {
    const stableSum = await db
      .select({
        total: sql<number>`SUM(${stableReleases.downloadCount})`,
      })
      .from(stableReleases)

    const betaSum = await db
      .select({
        total: sql<number>`SUM(${betaReleases.downloadCount})`,
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
  releaseId: string,
  releaseType: "stable" | "beta"
) {
  const db = await getDb()
  if (!db) return { success: false, error: "Database not configured" }
  try {
    const ip = "unknown"

    // Log download
    await db.insert(downloadLogs).values({
      id: `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      releaseId,
      releaseType,
      appName: "NevPlay",
      ipAddress: ip,
    })

    // Update count
    const table = releaseType === "beta" ? betaReleases : stableReleases
    const record = await db
      .select()
      .from(table)
      .where(eq(table.id, releaseId))
      .limit(1)

    if (record.length > 0) {
      const newCount = (record[0].downloadCount || 0) + 1
      await db
        .update(table)
        .set({ downloadCount: newCount })
        .where(eq(table.id, releaseId))
    }

    return { success: true }
  } catch (error) {
    console.error("[Releases Action] Error tracking download:", error)
    return { success: false, error: String(error) }
  }
}

