import type { Metadata } from "next"
import { IssueForm } from "@/components/issues/issue-form"
import { getRecentIssues } from "@/app/actions/issues"
import { Bug, Lightbulb, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Report Issues & Feedback",
  description:
    "Help us improve NevPlay by reporting bugs, suggesting features, or sharing your feedback.",
}

export default async function IssuesPage() {
  const recentIssues = await getRecentIssues(5)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bug":
        return <Bug className="h-5 w-5 text-red-500" />
      case "feature":
        return <Lightbulb className="h-5 w-5 text-[#1DB954]" />
      case "suggestion":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-500"
      case "high":
        return "bg-orange-500/10 text-orange-500"
      case "normal":
        return "bg-[#1DB954]/10 text-[#1DB954]"
      case "low":
        return "bg-blue-500/10 text-blue-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <main className="space-y-12 py-12">
      {/* Header */}
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-bold text-white">Report Issues & Feedback</h1>
        <p className="mt-4 text-lg text-gray-400">
          Found a bug? Have a feature idea? We&apos;d love to hear from you. Your feedback helps us
          make NevPlay better for everyone.
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Form - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-[#1DB954]/20 bg-[#0f0f0f] p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Submit Your Feedback</h2>
            <IssueForm />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="mt-8 space-y-6 lg:mt-0">
          {/* Guidelines */}
          <div className="rounded-lg border border-[#1DB954]/20 bg-[#0f0f0f] p-6">
            <h3 className="font-semibold text-white">Guidelines</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-[#1DB954]">•</span>
                <span>Be clear and descriptive</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-[#1DB954]">•</span>
                <span>Include steps to reproduce bugs</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-[#1DB954]">•</span>
                <span>One issue per submission</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-[#1DB954]">•</span>
                <span>We read every submission</span>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div className="rounded-lg border border-[#1DB954]/20 bg-[#0f0f0f] p-6">
            <h3 className="font-semibold text-white">Community Feedback</h3>
            <p className="mt-4 text-sm text-gray-400">
              Total reports received:{" "}
              <span className="font-semibold text-[#1DB954]">{recentIssues.length}+</span>
            </p>
          </div>
        </div>
      </div>

      {/* Recent Issues Preview */}
      {recentIssues.length > 0 && (
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-lg border border-[#1DB954]/20 bg-[#0f0f0f] p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Recent Feedback</h2>

            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex gap-4 rounded-lg border border-[#1DB954]/10 bg-[#121212] p-4"
                >
                  <div className="flex-shrink-0 pt-1">
                    {getCategoryIcon(issue.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{issue.title}</h3>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                          issue.type
                        )}`}
                      >
                        {issue.type}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                      {issue.description}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(issue.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-lg border border-[#1DB954]/20 bg-[#0f0f0f] p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">FAQ</h2>

          <div className="space-y-4">
            <details className="group cursor-pointer">
              <summary className="flex items-center gap-2 font-semibold text-white hover:text-[#1DB954]">
                <span className="inline-block h-6 w-6 text-[#1DB954] group-open:rotate-90 transition-transform">
                  →
                </span>
                How long does it take to receive feedback?
              </summary>
              <p className="mt-3 ml-8 text-gray-400">
                We review all submissions regularly. While we can&apos;t guarantee a specific timeline, most
                issues are reviewed within 1-2 weeks. For critical bugs, we prioritize faster.
              </p>
            </details>

            <details className="group cursor-pointer">
              <summary className="flex items-center gap-2 font-semibold text-white hover:text-[#1DB954]">
                <span className="inline-block h-6 w-6 text-[#1DB954] group-open:rotate-90 transition-transform">
                  →
                </span>
                Can I see the status of my submitted issue?
              </summary>
              <p className="mt-3 ml-8 text-gray-400">
                If you provided your email, we&apos;ll send you updates about your submission. You can also check
                the recent feedback section on this page to see community reports.
              </p>
            </details>

            <details className="group cursor-pointer">
              <summary className="flex items-center gap-2 font-semibold text-white hover:text-[#1DB954]">
                <span className="inline-block h-6 w-6 text-[#1DB954] group-open:rotate-90 transition-transform">
                  →
                </span>
                What if I found a security issue?
              </summary>
              <p className="mt-3 ml-8 text-gray-400">
                Please don&apos;t post security issues publicly. Instead, report them with priority set to
                &quot;Critical&quot; and include your email for direct contact.
              </p>
            </details>

            <details className="group cursor-pointer">
              <summary className="flex items-center gap-2 font-semibold text-white hover:text-[#1DB954]">
                <span className="inline-block h-6 w-6 text-[#1DB954] group-open:rotate-90 transition-transform">
                  →
                </span>
                Can I attach files or screenshots?
              </summary>
              <p className="mt-3 ml-8 text-gray-400">
                Currently, our form supports text-based descriptions. If you need to share files, please provide
                your email and we&apos;ll contact you for additional details.
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  )
}
