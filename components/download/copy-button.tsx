"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-glass-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-secondary"
      aria-label="Copy checksum to clipboard"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-primary" aria-hidden="true" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-3.5" aria-hidden="true" />
          Copy
        </>
      )}
    </button>
  )
}
