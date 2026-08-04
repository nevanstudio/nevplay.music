"use client"

import { useState, useRef } from "react"
import { submitIssue } from "@/app/actions/issues"
import {
  AlertCircle, CheckCircle2, Loader2, Send,
  Bug, Lightbulb, MessageSquare, ExternalLink, ImagePlus, X, Smartphone, Cpu, Tag
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type Category = "bug" | "feature" | "suggestion"
type Priority = "critical" | "high" | "normal" | "low"

const categoryOptions: { value: Category; label: string; icon: typeof Bug }[] = [
  { value: "bug", label: "Bug Report", icon: Bug },
  { value: "feature", label: "Feature Request", icon: Lightbulb },
  { value: "suggestion", label: "Suggestion", icon: MessageSquare },
]

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: "critical", label: "Critical", color: "text-red-500" },
  { value: "high", label: "High", color: "text-amber-500" },
  { value: "normal", label: "Normal", color: "text-primary" },
  { value: "low", label: "Low", color: "text-sky-500" },
]

type SubmitResult = {
  success: boolean
  issueId?: string
  githubUrl?: string | null
  message?: string
  error?: string
}

export function IssueForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "bug" as Category,
    type: "normal" as Priority,
    priority: "normal" as Priority,
    email: "",
    appVersion: "",
    androidVersion: "",
    deviceModel: "",
  })

  const [screenshots, setScreenshots] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<SubmitResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Screenshot upload handler (Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (screenshots.length >= 3) {
      setError("Maximum 3 screenshots allowed per report.")
      return
    }

    const fileList = Array.from(files).slice(0, 3 - screenshots.length)

    fileList.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload valid image files (.png, .jpg, .webp).")
        return
      }

      if (file.size > 4 * 1024 * 1024) {
        setError("Image size should be less than 4MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setScreenshots((prev) => [...prev, event.target!.result as string])
          setError(null)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitIssue({
        ...formData,
        screenshots,
      })

      if (result.success) {
        setSubmitted(result)
        setFormData({
          title: "",
          description: "",
          category: "bug",
          type: "normal",
          priority: "normal",
          email: "",
          appVersion: "",
          androidVersion: "",
          deviceModel: "",
        })
        setScreenshots([])
      } else {
        setError(result.error || "Failed to submit issue")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Success State ──
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center">
        <div className="relative flex size-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-60" />
          <div className="relative flex size-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10 shadow-lg shadow-primary/20">
            <CheckCircle2 className="size-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Report Received! 🎉</h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Your report has been <strong className="text-foreground">successfully submitted</strong> and{" "}
            <strong className="text-foreground">automatically logged to GitHub</strong>.
            We review every single report carefully.
          </p>
        </div>

        {submitted.githubUrl && (
          <Link
            href={submitted.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:shadow-md hover:shadow-primary/10"
          >
            <ExternalLink className="size-4" />
            View your report on GitHub
          </Link>
        )}

        <div className="w-full rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">What happens next?</p>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary shrink-0" />
              Our team receives an instant GitHub notification
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary shrink-0" />
              Your report is reviewed and labeled
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary shrink-0" />
              When fixed, it's closed and the "Issues Fixed" counter updates automatically
            </li>
          </ul>
        </div>

        <button
          onClick={() => setSubmitted(null)}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Submit another report →
        </button>
      </div>
    )
  }

  // ── Form ──
  const inputBase =
    "mt-2 w-full rounded-xl border border-glass-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-colors focus:border-primary/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Category chips */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Category <span className="text-destructive">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormData((p) => ({ ...p, category: opt.value }))}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                formData.category === opt.value
                  ? "border-primary/50 bg-primary/15 text-primary shadow-sm shadow-primary/10"
                  : "border-glass-border bg-secondary/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <opt.icon className="size-3.5" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Brief summary of your issue"
          maxLength={255}
          required
          className={inputBase}
        />
        <p className="mt-1 text-right text-[10px] font-mono text-muted-foreground/60">
          {formData.title.length}/255
        </p>
      </div>

      {/* Recommended Device & Version Metadata (Optional) */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Smartphone className="size-3.5" />
          <span>Device & App Info (Optional / Recommended)</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {/* App Version */}
          <div>
            <label htmlFor="appVersion" className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Tag className="size-3 text-primary" />
              NevPlay Version
            </label>
            <input
              type="text"
              id="appVersion"
              name="appVersion"
              value={formData.appVersion}
              onChange={handleChange}
              placeholder="e.g. v2026.08.04"
              className="mt-1 w-full rounded-lg border border-glass-border bg-secondary/80 px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:border-primary/60 focus:outline-none"
            />
          </div>

          {/* Android Version */}
          <div>
            <label htmlFor="androidVersion" className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Cpu className="size-3 text-primary" />
              Android OS
            </label>
            <input
              type="text"
              id="androidVersion"
              name="androidVersion"
              value={formData.androidVersion}
              onChange={handleChange}
              placeholder="e.g. Android 14"
              className="mt-1 w-full rounded-lg border border-glass-border bg-secondary/80 px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:border-primary/60 focus:outline-none"
            />
          </div>

          {/* Device Model */}
          <div>
            <label htmlFor="deviceModel" className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Smartphone className="size-3 text-primary" />
              Device Model
            </label>
            <input
              type="text"
              id="deviceModel"
              name="deviceModel"
              value={formData.deviceModel}
              onChange={handleChange}
              placeholder="e.g. Galaxy S24"
              className="mt-1 w-full rounded-lg border border-glass-border bg-secondary/80 px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:border-primary/60 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description, steps to reproduce, or your feature idea..."
          maxLength={5000}
          rows={5}
          required
          className={`${inputBase} resize-none`}
        />
        <p className="mt-1 text-right text-[10px] font-mono text-muted-foreground/60">
          {formData.description.length}/5000
        </p>
      </div>

      {/* Screenshots Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Screenshots & Attachments <span className="text-muted-foreground text-xs font-normal">(Optional, max 3)</span>
        </label>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-3 mt-2">
          {/* Upload Button */}
          {screenshots.length < 3 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-glass-border bg-secondary/30 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/60 hover:text-foreground"
            >
              <ImagePlus className="size-5 text-primary" />
              <span className="text-[10px] font-semibold">Add Image</span>
            </button>
          )}

          {/* Uploaded Thumbnails */}
          {screenshots.map((src, index) => (
            <div key={index} className="relative h-20 w-24 overflow-hidden rounded-xl border border-glass-border bg-card group">
              <img
                src={src}
                alt={`Screenshot ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeScreenshot(index)}
                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-destructive"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormData((p) => ({ ...p, type: opt.value, priority: opt.value }))}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                formData.priority === opt.value
                  ? `border-current/50 bg-current/10 ${opt.color}`
                  : "border-glass-border bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={inputBase}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Only used to notify you when your issue is resolved. Never shared.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting your report...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Submit Report
          </>
        )}
      </button>
    </form>
  )
}
