"use client"

import { useState } from "react"
import { Code, Copy, Check, X, Sparkles } from "lucide-react"

export function EmbedBadgeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const embedCode = `<a href='https://nevplay.en.uptodown.com/android' title='Download NevPlay' target='_blank' rel='noopener noreferrer'>
  <img src='https://stc.utdstc.com/img/mediakit/download-gio-big-b.png' alt='Download NevPlay' />
</a>`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard fallback
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/60 shadow-sm"
      >
        <Code className="size-4" aria-hidden="true" />
        <span>Embed Button HTML</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-glass-border bg-card p-6 shadow-2xl space-y-5 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-glass-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Embed Download Badge</h3>
                  <p className="text-xs text-muted-foreground">Copy official HTML snippet to embed on any website</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Live Badge Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Badge Preview</span>
              <div className="flex items-center justify-center rounded-2xl border border-glass-border bg-secondary/30 p-6">
                <a
                  href="https://nevplay.en.uptodown.com/android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:scale-105 transition-transform"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://stc.utdstc.com/img/mediakit/download-gio-big-b.png"
                    alt="Download NevPlay"
                    className="h-14 object-contain drop-shadow-md"
                  />
                </a>
              </div>
            </div>

            {/* HTML Code Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">HTML Embed Code</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-xl border border-glass-border bg-slate-950 p-4 font-mono text-xs text-emerald-400 select-all leading-relaxed">
                <code>{embedCode}</code>
              </pre>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-glass-border pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-glass-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Code Copied!" : "Copy HTML Code"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
