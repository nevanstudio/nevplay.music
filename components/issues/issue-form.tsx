"use client"

import { useState } from "react"
import { submitIssue } from "@/app/actions/issues"
import { AlertCircle, CheckCircle2, Loader } from "lucide-react"

type Category = "bug" | "feature" | "suggestion"
type Type = "critical" | "high" | "normal" | "low"
type Priority = "critical" | "high" | "normal" | "low"

export function IssueForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "bug" as Category,
    type: "normal" as Type,
    priority: "normal" as Priority,
    email: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await submitIssue(formData)

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Issue submitted successfully!",
        })
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "bug",
          type: "normal",
          priority: "normal",
          email: "",
        })
        // Hide message after 5 seconds
        setTimeout(() => setMessage(null), 5000)
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to submit issue",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message Alert */}
      {message && (
        <div
          className={`flex gap-3 rounded-lg px-4 py-3 ${
            message.type === "success"
              ? "bg-[#1DB954]/10 text-[#1DB954]"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-white">
          Title <span className="text-red-500">*</span>
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
          className="mt-2 w-full rounded-lg border border-[#1DB954]/20 bg-[#121212] px-4 py-3 text-white placeholder-gray-500 focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length}/255 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-white"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Please provide detailed information about your issue, steps to reproduce, or feature idea"
          maxLength={5000}
          rows={6}
          required
          className="mt-2 w-full rounded-lg border border-[#1DB954]/20 bg-[#121212] px-4 py-3 text-white placeholder-gray-500 focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/5000 characters
        </p>
      </div>

      {/* Category, Type, Priority */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-white">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-[#1DB954]/20 bg-[#121212] px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
          >
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="suggestion">Suggestion</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-white">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-[#1DB954]/20 bg-[#121212] px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-white">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-[#1DB954]/20 bg-[#121212] px-4 py-3 text-white focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email (optional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="mt-2 w-full rounded-lg border border-[#1DB954]/20 bg-[#121212] px-4 py-3 text-white placeholder-gray-500 focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
        />
        <p className="mt-1 text-xs text-gray-500">
          So we can follow up with you if needed
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1DB954] px-4 py-3 font-semibold text-black transition-all hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Issue"
        )}
      </button>
    </form>
  )
}
