import type { Metadata } from "next"
import { IssueForm } from "@/components/issues/issue-form"
import { getRecentIssues, getGitHubIssueStats } from "@/app/actions/issues"
import {
  Bug, Lightbulb, MessageSquare, CheckCircle2, CircleDot,
  ShieldAlert, Target, Sparkles, Info, ChevronRight
} from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { Badge, GlassCard, PageHero } from "@/components/ui/primitives"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Report Issues & Feedback",
  description:
    "Help us improve NevPlay by reporting bugs, suggesting features, or sharing your feedback. Every report goes directly to our development team.",
}

const guidelines = [
  {
    icon: Target,
    title: "Be specific and descriptive",
    body: "Include your NevPlay version, Android version, and device model when reporting bugs.",
  },
  {
    icon: ChevronRight,
    title: "Steps to reproduce",
    body: "For bugs, describe exactly what you did before the problem occurred — step by step.",
  },
  {
    icon: Info,
    title: "One issue per report",
    body: "Submit separate reports for separate issues so we can track and fix them individually.",
  },
  {
    icon: ShieldAlert,
    title: "Security vulnerabilities",
    body: "For sensitive security issues, set priority to Critical and include your email for private follow-up.",
  },
  {
    icon: Sparkles,
    title: "Feature requests",
    body: "Describe the use case and why it would improve your experience. Screenshots or mockups are welcome in the description.",
  },
]

const getCategoryIcon = (category: string, size = "h-4 w-4") => {
  switch (category) {
    case "bug":
      return <Bug className={`${size} text-red-500`} />
    case "feature":
      return <Lightbulb className={`${size} text-primary`} />
    case "suggestion":
      return <MessageSquare className={`${size} text-sky-500`} />
    default:
      return <CircleDot className={`${size} text-muted-foreground`} />
  }
}

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case "critical": return "border-red-500/30 bg-red-500/10 text-red-500"
    case "high": return "border-amber-500/30 bg-amber-500/10 text-amber-500"
    case "normal": return "border-primary/30 bg-primary/10 text-primary"
    case "low": return "border-sky-500/30 bg-sky-500/10 text-sky-500"
    default: return "border-glass-border bg-secondary text-muted-foreground"
  }
}

export default async function IssuesPage() {
  const [recentIssues, ghStats] = await Promise.all([
    getRecentIssues(6),
    getGitHubIssueStats(),
  ])

  return (
    <>
      <PageHero
        eyebrow="Community Feedback"
        title="Report Issues & Feedback"
        description="Found a bug? Have a feature idea? Every report is read and tracked by our team. Help us make NevPlay better for everyone."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl space-y-16">

          {/* Stats Row */}
          <Reveal>
            <div className="grid grid-cols-3 gap-4">
              <GlassCard className="flex flex-col items-center gap-1.5 p-5 text-center">
                <span className="text-3xl font-bold text-foreground tabular-nums">{ghStats.total}</span>
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total Reports</span>
              </GlassCard>
              <GlassCard className="flex flex-col items-center gap-1.5 p-5 text-center border-primary/30">
                <span className="text-3xl font-bold text-primary tabular-nums">{ghStats.closed}</span>
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Issues Fixed</span>
              </GlassCard>
              <GlassCard className="flex flex-col items-center gap-1.5 p-5 text-center">
                <span className="text-3xl font-bold text-amber-500 tabular-nums">{ghStats.open}</span>
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Under Review</span>
              </GlassCard>
            </div>
          </Reveal>

          {/* How it works note */}
          <Reveal delay={60}>
            <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Reports submitted here are <strong className="text-foreground">automatically tracked on GitHub</strong>.
                When we close a report on GitHub (mark it resolved), the <strong className="text-foreground">Issues Fixed</strong> counter updates automatically within 1 hour.
              </span>
            </div>
          </Reveal>

          {/* Main Grid: Form + Sidebar */}
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Submission Form */}
            <Reveal className="lg:col-span-2">
              <GlassCard className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Bug className="size-4" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Submit Your Report</h2>
                </div>
                <IssueForm />
              </GlassCard>
            </Reveal>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Guidelines */}
              <Reveal delay={80}>
                <GlassCard className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Target className="size-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Submission Guidelines</h3>
                  </div>
                  <ul className="space-y-4">
                    {guidelines.map((g) => (
                      <li key={g.title} className="flex gap-3">
                        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <g.icon className="size-3 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{g.title}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{g.body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>

              {/* Track on GitHub */}
              <Reveal delay={100}>
                <GlassCard className="p-6">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-foreground">Track Your Report</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Every submitted report is posted to our public GitHub Issues tracker. You can follow progress, add comments, and get notified when it's resolved.
                  </p>
                  <Link
                    href="https://github.com/nevanstudio/nevplay_releases/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    View all open issues on GitHub →
                  </Link>
                </GlassCard>
              </Reveal>
            </div>
          </div>

          {/* Recent Reports */}
          {recentIssues.length > 0 && (
            <div className="space-y-4">
              <Reveal>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold tracking-tight">Recent Reports</h2>
                  <Badge>
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    Live
                  </Badge>
                </div>
              </Reveal>
              <div className="grid gap-3 sm:grid-cols-2">
                {recentIssues.map((issue: any, index: number) => (
                  <Reveal key={issue.id} delay={index * 40}>
                    <GlassCard hover className="flex gap-4 p-5">
                      <div className="mt-0.5 shrink-0">
                        {getCategoryIcon(issue.category)}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold">{issue.title}</h3>
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getPriorityStyle(issue.type)}`}>
                            {issue.type}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {issue.description}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground/60">
                          {new Date(issue.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </GlassCard>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          <Reveal>
            <GlassCard className="p-8">
              <h2 className="mb-6 text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <div className="divide-y divide-glass-border space-y-0">
                {[
                  {
                    q: "How long does it take to receive a response?",
                    a: "We review all submissions regularly. Critical bugs are prioritised within 48 hours. Other issues are typically addressed within 1–2 weeks.",
                  },
                  {
                    q: "How will I know when my issue is fixed?",
                    a: "When a report is closed on GitHub, the 'Issues Fixed' counter above updates within 1 hour. If you submitted your email, we'll notify you directly.",
                  },
                  {
                    q: "Can I see the status of my submitted issue?",
                    a: "Yes — every report is publicly trackable on GitHub Issues. Click the 'View all open issues on GitHub' link in the sidebar.",
                  },
                  {
                    q: "What if I found a security vulnerability?",
                    a: "Set the priority to Critical and include your email for private follow-up. Do not post credentials or sensitive details in the description.",
                  },
                  {
                    q: "Can I attach screenshots?",
                    a: "Not directly via the form yet — describe your issue in detail and include your email. We'll contact you to request screenshots if needed.",
                  },
                ].map((item) => (
                  <details key={item.q} className="group cursor-pointer py-4 first:pt-0 last:pb-0">
                    <summary className="flex items-center justify-between gap-4 text-sm font-semibold text-foreground marker:content-none hover:text-primary transition-colors">
                      {item.q}
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </GlassCard>
          </Reveal>

        </div>
      </section>
    </>
  )
}
