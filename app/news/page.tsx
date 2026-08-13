import type { Metadata } from "next"
import Link from "next/link"
import {
  Newspaper,
  Calendar,
  Clock,
  Tag,
  ShieldAlert,
  Download,
  Smartphone,
  Info,
  Sparkles,
  ArrowLeft,
  Search,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import { Badge, ButtonLink, GlassCard, PageHero } from "@/components/ui/primitives"
import { Reveal } from "@/components/motion/reveal"

export const metadata: Metadata = {
  title: "News & Notices",
  description:
    "Official news, notices, beta program policy updates, and release reports for NevPlay for Android.",
}

export type NewsItem = {
  id: string
  title: string
  subtitle: string
  date: string
  time: string
  category: "Notice" | "Beta Program" | "Release" | "Feature"
  pinned?: boolean
  author: string
  content: string[]
  action?: {
    label: string
    href: string
  }
}

const newsReports: NewsItem[] = [
  {
    id: "beta-channel-ended-aug-2026",
    pinned: true,
    category: "Notice",
    title: "Official Notice: Public Beta Channels Concluded — Early Access Moves In-App",
    subtitle:
      "Important policy change regarding NevPlay beta distribution. Public beta channels are closed; in-app Early Access requests are now enabled for users on v2026.08.12 or higher.",
    date: "August 13, 2026",
    time: "09:30 AM",
    author: "NevPlay Core Team",
    content: [
      "We are announcing an immediate change regarding the NevPlay Beta distribution channels. Effective today, we have formally ended the public Beta channels hosted on GitHub and our website.",
      "We understand that public beta channels were made available just a few hours ago. However, due to rapid development cycles and the need for targeted performance metrics, public beta builds cannot be made available to everyone at this scale.",
      "If you are interested in trying experimental features ahead of official stable releases, you can still request Early Access. Starting with NevPlay version 2026.08.12 or higher, users can submit an Early Access Request directly from within the app settings screen.",
      "The Stable channel remains the single recommended, fully-tested version for all users. We appreciate your understanding and continued support as we build the ultimate offline music player for Android.",
    ],
    action: {
      label: "Download Stable v2026.08.12+",
      href: "/download",
    },
  },
  {
    id: "initial-beta-rollout",
    category: "Beta Program",
    title: "NevPlay Public Beta Channel Initial Preview",
    subtitle:
      "Exploratory public testing launch for early adopter feedback and experimental sound processing features.",
    date: "August 13, 2026",
    time: "06:00 AM",
    author: "NevPlay Core Team",
    content: [
      "Earlier today, NevPlay briefly opened a public preview channel to test our upcoming high-resolution resampling engine and dynamic theme transitions.",
      "Initial feedback allowed us to gather invaluable crash diagnostics and device configuration telemetry across various Android OS versions.",
      "This public preview period has now concluded as we transition to our structured in-app Early Access system.",
    ],
  },
  {
    id: "release-2026-07",
    category: "Release",
    title: "NevPlay Version 2026.07 — The Liquid Glass & Equalizer Update",
    subtitle:
      "Major performance update introducing our 10-band equalizer with AutoEQ headphone profiles and responsive glassmorphism UI.",
    date: "July 28, 2026",
    time: "02:15 PM",
    author: "NevPlay Core Team",
    content: [
      "Version 2026.07 brings our most requested feature: a built-in 10-Band Graphic Equalizer complete with AutoEQ integration featuring over 1,000 headphone calibration profiles.",
      "The UI has been overhauled with smooth 60 FPS Jetpack Compose animations, dynamic ambient artwork blurs, and instant local library indexing.",
      "Offline LRC lyric rendering now includes customizable line offsets and timing adjustments for perfect karaoke synchronization.",
    ],
    action: {
      label: "View Release Notes",
      href: "/releases",
    },
  },
  {
    id: "release-2026-06",
    category: "Release",
    title: "NevPlay Version 2026.06.01 — Material You Dynamic Color & Synced Lyrics",
    subtitle:
      "Full Material 3 Expressive UI integration with dynamic color extraction and LRCLIB lyrics lookup.",
    date: "June 15, 2026",
    time: "11:00 AM",
    author: "NevPlay Design Team",
    content: [
      "NevPlay now dynamically samples your wallpaper and cover art palette using Android Material You design tokens for a cohesive look across dark and light modes.",
      "Automatic offline lyric matching via LRCLIB ensures your music library shines with full karaoke text display.",
    ],
  },
  {
    id: "ai-playlist-preview",
    category: "Feature",
    title: "Sneak Peek: On-Device AI Smart Playlist & Recommendation Engine",
    subtitle:
      "Zero-cloud tracking AI recommendations that learn your acoustic taste directly on your Android device.",
    date: "May 10, 2026",
    time: "04:30 PM",
    author: "NevPlay AI Labs",
    content: [
      "NevPlay is introducing on-device intelligence. Unlike streaming platforms that collect user listening logs, NevPlay analyze track acoustics, BPM, key signature, and your local listening history 100% locally.",
      "Your data never leaves your device while you enjoy personalized smart playlist generation.",
    ],
  },
]

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News & Official Notices"
        title="NevPlay News Reports & Announcements"
        description="Stay updated with official notices, policy updates, release reports, and technical insights from the NevPlay engineering team."
      >
        <ButtonLink href="/download" size="lg">
          <Smartphone className="size-4" aria-hidden="true" />
          Get Stable App
        </ButtonLink>
        <ButtonLink href="/releases" variant="secondary" size="lg">
          Version History
        </ButtonLink>
      </PageHero>

      {/* Main News Reports Container */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-5xl space-y-10">
          
          {/* Breadcrumb & Navigation helper */}
          <div className="flex items-center justify-between border-b border-glass-border pb-4">
            <Link
              href="/download"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back to Download Page
            </Link>

            <span className="text-xs font-mono text-muted-foreground">
              {newsReports.length} Reports Published
            </span>
          </div>

          {/* News List */}
          <div className="space-y-8">
            {newsReports.map((item, index) => {
              const isPinned = item.pinned
              return (
                <Reveal key={item.id} delay={index * 50}>
                  <article
                    className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isPinned
                        ? "border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-card to-card shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30"
                        : "border-glass-border bg-card hover:border-primary/40 hover:shadow-lg"
                    }`}
                  >
                    {/* Top Decorative Strip */}
                    <div
                      className={`flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b text-xs font-mono ${
                        isPinned
                          ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                          : "border-glass-border bg-secondary/30 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isPinned ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                            <ShieldAlert className="size-3.5" aria-hidden="true" />
                            CRITICAL NOTICE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-primary">
                            <Newspaper className="size-3.5" aria-hidden="true" />
                            {item.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" aria-hidden="true" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" aria-hidden="true" />
                          {item.time}
                        </span>
                      </div>
                    </div>

                    {/* Article Body */}
                    <div className="p-6 md:p-8 space-y-4">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                          {item.title}
                        </h2>
                        <p className="mt-1 text-sm font-medium text-muted-foreground leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="space-y-3 pt-2 text-sm text-foreground/90 leading-relaxed">
                        {item.content.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>

                      {/* Author & Action footer */}
                      <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-glass-border/60 mt-6">
                        <span className="text-xs text-muted-foreground font-medium">
                          Published by <strong className="text-foreground">{item.author}</strong>
                        </span>

                        {item.action && (
                          <ButtonLink
                            href={item.action.href}
                            size="sm"
                            className={
                              isPinned
                                ? "bg-amber-500 text-black hover:bg-amber-400 font-bold"
                                : ""
                            }
                          >
                            {item.action.label}
                            <ChevronRight className="size-3.5" aria-hidden="true" />
                          </ButtonLink>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>

        </div>
      </section>
    </>
  )
}
