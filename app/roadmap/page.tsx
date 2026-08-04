import type { Metadata } from "next"
import {
  Bot,
  Car,
  Cloud,
  Github,
  LayoutGrid,
  MessageCircle,
  Mic2,
  Monitor,
  ScanSearch,
  Watch,
} from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { Badge, ButtonLink, GlassCard, PageHero, SectionHeading } from "@/components/ui/primitives"
import { GITHUB_REPO_URL } from "@/lib/nav"

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Where NevPlay is headed — what we're building now, what's next, and the ambitious ideas on the horizon.",
}

const groups = [
  {
    status: "In Progress",
    tone: "bg-primary",
    items: [
      {
        icon: ScanSearch,
        title: "Advanced File Scanner",
        description: "Smarter local library indexing with duplicate detection and metadata repair.",
      },
      {
        icon: Car,
        title: "Android Auto v2",
        description: "Redesigned car interface with voice search and larger touch targets.",
      },
      {
        icon: LayoutGrid,
        title: "Widget Redesign",
        description: "Home screen widgets with dynamic album art and playback controls.",
      },
    ],
  },
  {
    status: "Coming Next",
    tone: "bg-accent-foreground",
    items: [
      {
        icon: Bot,
        title: "AI Playlist Builder",
        description: "On-device AI that creates playlists from mood, tempo, and listening history.",
      },
      {
        icon: Car,
        title: "Car Mode",
        description: "Large-button driving interface optimized for one-handed use.",
      },
      {
        icon: Mic2,
        title: "More Lyrics Providers",
        description: "Expanded synced lyrics sources with automatic LRC fetching.",
      },
    ],
  },
  {
    status: "Future Vision",
    tone: "bg-muted-foreground",
    items: [
      {
        icon: Watch,
        title: "Wear OS Companion",
        description: "Control playback and browse your library from your wrist.",
      },
      {
        icon: Monitor,
        title: "Desktop Version",
        description: "Cross-platform NevPlay for Windows, macOS, and Linux.",
      },
      {
        icon: Cloud,
        title: "Cloud-Free Sync",
        description: "Local network sync between devices without any cloud dependency.",
      },
    ],
  },
]

const community = [
  { icon: Github, label: "GitHub Feature Requests" },
  { icon: MessageCircle, label: "Discord Community Chat" },
  { icon: Bot, label: "Weekly Dev Updates" },
  { icon: Github, label: "Open Source Contributions" },
]

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Product Direction"
        title="Where We're Headed"
        description="NevPlay's roadmap is shaped by our community. Here's what we're building now, what's next, and the ambitious ideas on the horizon."
      />

      <section className="px-6 pb-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-16">
          {groups.map((group) => (
            <div key={group.status} className="flex flex-col gap-6">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className={`size-2.5 rounded-full ${group.tone}`} />
                  <h2 className="text-2xl font-bold tracking-tight">{group.status}</h2>
                </div>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-3">
                {group.items.map((item, index) => (
                  <Reveal key={item.title} delay={index * 60}>
                    <GlassCard hover className="flex h-full flex-col gap-3 p-6">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="size-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </GlassCard>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeading
              eyebrow="Community"
              title="Shape the Roadmap"
              description="Have an idea? We listen. The best features come from the people who use NevPlay every day."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {community.map((item, index) => (
              <Reveal key={item.label} delay={index * 60}>
                <GlassCard className="flex items-center gap-3 p-5">
                  <item.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{item.label}</span>
                </GlassCard>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14">
            <div className="flex flex-col items-center gap-5 text-center">
              <Badge>Get Involved</Badge>
              <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                Want to Influence What&apos;s Next?
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <ButtonLink href="/releases">See Recent Updates</ButtonLink>
                <ButtonLink href="/donate" variant="secondary">
                  Support Development
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
