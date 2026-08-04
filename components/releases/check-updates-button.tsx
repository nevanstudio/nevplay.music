"use client"

import { useState } from "react"
import { checkForUpdates } from "@/app/actions/sync"
import { RefreshCw, Check, AlertCircle } from "lucide-react"

export function CheckUpdatesButton() {
  const [isChecking, setIsChecking] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error" | null
    text: string
  }>({ type: null, text: "" })

  const handleCheckUpdates = async () => {
    setIsChecking(true)
    setMessage({ type: null, text: "" })

    try {
      const result = await checkForUpdates()

      if (result.success) {
        setMessage({
          type: "success",
          text: "Releases checked successfully! Any new versions are now available.",
        })
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to check for updates",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while checking for updates",
      })
    } finally {
      setIsChecking(false)
      // Clear message after 5 seconds
      setTimeout(() => setMessage({ type: null, text: "" }), 5000)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCheckUpdates}
        disabled={isChecking}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1DB954] px-4 py-2 font-semibold text-black transition-all hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw
          className={`size-4 ${isChecking ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
        {isChecking ? "Checking..." : "Check for Updates"}
      </button>

      {message.type && (
        <div
          className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-[#1DB954]/10 text-[#1DB954]"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <Check className="size-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="size-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <p>{message.text}</p>
        </div>
      )}
    </div>
  )
}
