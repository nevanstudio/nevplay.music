"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"

export function RefreshReleaseButton({
  className = "",
  channel = "stable",
}: {
  className?: string
  channel?: "stable" | "beta"
}) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const handleRefresh = async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setStatusMessage("Checking GitHub...")

    try {
      // 1. Call sync endpoint with cache bypass to force fresh GitHub data
      await fetch("/api/releases/sync", { method: "POST", cache: "no-store" })
      
      // 2. Fetch latest release directly from API
      const res = await fetch(`/api/releases/latest?channel=${channel}&t=${Date.now()}`, {
        cache: "no-store",
      })

      if (res.ok) {
        const data = await res.json()
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        setLastUpdated(timeStr)
        setStatusMessage(`Updated! Latest: ${data.version}`)
      } else {
        setStatusMessage("Refreshed")
      }

      // Hard refresh page data seamlessly
      window.location.reload()
    } catch (error) {
      console.error("Failed to refresh release:", error)
      setStatusMessage("Failed to refresh")
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
        setStatusMessage(null)
      }, 3000)
    }
  }

  // 30 seconds auto-refresher timer indicator
  useEffect(() => {
    const timer = setInterval(() => {
      // Auto fetch background trigger every 30 seconds
      fetch(`/api/releases/latest?channel=${channel}&t=${Date.now()}`, { cache: "no-store" }).catch(() => {})
    }, 30000)

    return () => clearInterval(timer)
  }, [channel])

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        title="Manual refresh for latest APK version (Auto-refreshes every 30s)"
        type="button"
        className="group relative inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-surface/80 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur-md transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:scale-95 disabled:opacity-60"
      >
        <RefreshCw
          className={`size-3.5 transition-transform duration-500 ${
            isRefreshing ? "animate-spin text-primary" : "group-hover:rotate-180"
          }`}
        />
        <span>{isRefreshing ? "Checking..." : "Refresh APK"}</span>
      </button>

      {statusMessage && (
        <span className="text-[11px] font-mono text-primary animate-fade-in">
          {statusMessage}
        </span>
      )}
      {!statusMessage && lastUpdated && (
        <span className="text-[10px] font-mono text-muted-foreground">
          Checked: {lastUpdated}
        </span>
      )}
    </div>
  )
}
