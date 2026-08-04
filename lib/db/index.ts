import * as schema from "./schema"

let _db: any = null

export async function getDb() {
  if (!process.env.DATABASE_URL) {
    return null
  }
  if (!_db) {
    try {
      // Dynamic imports to prevent build-time symlink issues on Windows
      const { drizzle } = await import("drizzle-orm/node-postgres")
      const { Pool } = await import("pg")
      
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      })
      _db = drizzle(pool, { schema })
    } catch (error) {
      console.error("Failed to initialize database:", error)
      return null
    }
  }
  return _db
}

// Keep the proxy for compatibility, but it will now try to initialize lazily
export const db = new Proxy({} as any, {
  get(_target, prop) {
    throw new Error("Direct 'db' access is deprecated. Use 'getDb()' instead for safe lazy initialization.")
  },
})


