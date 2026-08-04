"use server"

import { getDb } from "@/lib/db"
import { comingSoonApps } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

export async function getComingSoonApps() {
  try {
    const db = await getDb()
    if (!db) return []

    const data = await db
      .select()
      .from(comingSoonApps)
      .orderBy(desc(comingSoonApps.estimatedRelease))
      .limit(20)
    return data
  } catch (error) {
    console.error("[Coming-Soon Action] Error:", error)
    return []
  }
}
