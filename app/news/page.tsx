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
  category: "Dispatch" | "Release" | "Feature"
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
    id: "developer-return-october-2026",
    pinned: true,
    category: "Dispatch",
    title: "Developer Dispatch: The 60-Day Silence is Over — NevPlay is Back",
    subtitle:
      "A candid personal report from the solo developer behind NevPlay on the sudden offline absence since v2026.08.10, the architectural overhaul during the hiatus, and our upcoming roadmap.",
    date: "October 6, 2026",
    time: "12:00 AM",
    author: "Nevan (Lead & Solo Developer)",
    content: [
      "To our community and listeners worldwide:",
      "On August 10, 2026, following the release of NevPlay v2026.08.10, an unprecedented personal emergency suddenly and completely forced me offline. I was abruptly separated from my development workstations, hardware test devices, code repositories, and online communication channels for nearly two full months.",
      "As a 100% independent, solo developer, when life unexpectedly forces you away from your keyboard, there is no PR department, no proxy maintainer, and no automated social pipeline. The silence was absolute, and for that, I recognize it caused genuine concern among our community.",
      "Today, I want to make one thing unequivocally clear: NevPlay was never abandoned, nor will it be. That involuntary hiatus away from illuminated screens became a profound crucible. In the quiet, I dissected every aspect of NevPlay from first principles: where the UI was carrying dead weight, why certain screens caused unnecessary cognitive load, and how to push our low-latency audio engine to rival commercial studio players.",
      "We are kicking off this comeback with immediate action: our website has been completely rebuilt to be drastically lighter and faster, removing dozens of speculative and underutilized pages to deliver pure performance. Meanwhile, on the Android side, the next app release is actively in development with streamlined caching, refined Liquid Glass aesthetics, and rock-solid offline stability.",
      "Thank you to everyone who kept listening, kept NevPlay on their devices, and had faith in this independent project. We're back in the studio, and the best is yet to come.",
    ],
    action: {
      label: "Download Stable v2026.08.10+",
      href: "/download",
    },
  },
  {
    id: "release-2026-08-10",
    category: "Release",
    title: "NevPlay Version 2026.08.10 — Stability & High-Res Engine Milestone",
    subtitle:
      "Core audio optimization update introducing multi-threaded buffers, expanded lossless decoding, and battery efficiency.",
    date: "August 10, 2026",
    time: "03:45 PM",
    author: "Nevan",
    content: [
      "Version 2026.08.10 solidified our core playback pipeline with multi-threaded audio buffering, expanded FLAC and ALAC decoding, and improved album art memory management.",
      "This build serves as our stable baseline across thousands of Android devices as we prepare the next major evolutionary update.",
    ],
    action: {
      label: "View Release Notes",
      href: "/releases",
    },
  },
  {
    id: "release-2026-07",
    category: "Release",
    title: "NevPlay Version 2026.07 — The Liquid Glass & Equalizer Update",
    subtitle:
      "Major performance update introducing our 10-band equalizer with AutoEQ headphone profiles and responsive glassmorphism UI.",
    date: "July 28, 2026",
    time: "02:15 PM",
    author: "Nevan",
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
    author: "Nevan",
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
    author: "Nevan",
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
                        ? "border-primary/60 bg-gradient-to-br from-primary/15 via-card to-card shadow-2xl shadow-primary/15 ring-1 ring-primary/40"
                        : "border-glass-border bg-card hover:border-primary/40 hover:shadow-lg"
                    }`}
                  >
                    {/* Top Decorative Strip */}
                    <div
                      className={`flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b text-xs font-mono ${
                        isPinned
                          ? "border-primary/30 bg-primary/20 text-primary"
                          : "border-glass-border bg-secondary/30 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isPinned ? (
                          <span className="inline-flex items-center gap-1.5 font-bold text-primary">
                            <span className="size-2 rounded-full bg-primary animate-ping-ring" />
                            OFFICIAL COMEBACK DISPATCH
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
                                ? "bg-primary text-primary-foreground hover:brightness-110 font-bold"
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
