import type { Metadata } from "next"
import {
  AudioLines,
  Car,
  Download,
  FileEdit,
  Gauge,
  Headphones,
  Languages,
  ListMusic,
  Mic2,
  Moon,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
  WifiOff,
} from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { ButtonLink, GlassCard, PageHero, SectionHeading } from "@/components/ui/primitives"

export const metadata: Metadata = {
  title: "Features",
  description:
    "From synced lyrics and AI-powered discovery to professional-grade audio tuning — every NevPlay feature, in detail.",
}

const featureGroups = [
  {
    category: "Player",
    features: [
      {
        icon: WifiOff,
        title: "Offline Playback",
        description:
          "Your entire local library, always available. No internet required, no streaming dependencies.",
      },
      {
        icon: Mic2,
        title: "Synced Lyrics",
        description:
          "Karaoke-style LRC lyrics that highlight in real time, beautifully animated to the rhythm.",
      },
      {
        icon: ListMusic,
        title: "Interactive Queue",
        description:
          "Drag-and-drop ordering and swift swipe-to-remove interactions for upcoming tracks.",
      },
      {
        icon: Car,
        title: "Android Auto",
        description:
          "Full playback controls, browse-by-artist/album, and voice search from your car's head unit.",
      },
    ],
  },
  {
    category: "Audio",
    features: [
      {
        icon: AudioLines,
        title: "Professional Equalizer",
        description:
          "Multi-band frequency tuning to achieve the perfect acoustic response for any setup.",
      },
      {
        icon: Headphones,
        title: "AutoEQ Integration",
        description:
          "Thousands of preset headphone profiles that optimize and balance sound automatically.",
      },
      {
        icon: Gauge,
        title: "Lightning Fast",
        description:
          "Under 40MB with 60 FPS animations. Built for instant startup and buttery scrolling.",
      },
      {
        icon: Timer,
        title: "Sleep Timer",
        description:
          "Drift off to your favorite album — NevPlay fades out and stops on schedule.",
      },
    ],
  },
  {
    category: "Library & Tools",
    features: [
      {
        icon: Search,
        title: "Advanced Scanning",
        description:
          "Smart local file scanning and sorting algorithms keep large libraries organized.",
      },
      {
        icon: FileEdit,
        title: "Tag Editor",
        description:
          "Modify titles, artists, albums, track numbers, and cover art without leaving the app.",
      },
      {
        icon: ListMusic,
        title: "Smart Playlists",
        description:
          "Custom lists of favorites or automatically generated collections based on tags.",
      },
      {
        icon: Sparkles,
        title: "AI Recommendations",
        description:
          "On-device intelligence learns your taste and surfaces tracks you'll love — privately.",
      },
    ],
  },
  {
    category: "Personalization & Privacy",
    features: [
      {
        icon: Palette,
        title: "Material You",
        description:
          "Dynamic color palettes fetched directly from your Android wallpaper system.",
      },
      {
        icon: Moon,
        title: "Liquid Glass UI",
        description:
          "NevPlay's signature interface — layered glass, smooth gradients, tasteful motion.",
      },
      {
        icon: Languages,
        title: "Translations",
        description:
          "Interface language switching, gesture behaviors, and deep customization options.",
      },
      {
        icon: ShieldCheck,
        title: "Zero Tracking",
        description:
          "No analytics, no accounts, no data collection. Listening stats never leave your device.",
      },
    ],
  },
]

const stats = [
  { value: "10+", label: "Core Features" },
  { value: "60 FPS", label: "Smooth Animations" },
  { value: "1000+", label: "AutoEQ Profiles" },
  { value: "0", label: "Data Collected" },
]

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Everything NevPlay Offers"
        title="Features Built for Serious Listeners"
        description="From synced lyrics and AI-powered discovery to professional-grade audio tuning — every detail is crafted for a premium local music experience on Android."
      >
        <ButtonLink href="/download">
          <Download className="size-4" aria-hidden="true" />
          Download Free
        </ButtonLink>
        <ButtonLink href="/releases" variant="secondary">
          See What&apos;s New
        </ButtonLink>
      </PageHero>

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-panel flex flex-col items-center gap-1 rounded-xl px-4 py-5 text-center"
            >
              <span className="text-xl font-bold tracking-tight text-primary md:text-2xl">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground md:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-20">
          {featureGroups.map((group) => (
            <div key={group.category} className="flex flex-col gap-8">
              <Reveal>
                <SectionHeading eyebrow="In Detail" title={group.category} align="left" />
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {group.features.map((feature, index) => (
                  <Reveal key={feature.title} delay={index * 60}>
                    <GlassCard hover className="flex h-full flex-col gap-3 p-6">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <feature.icon className="size-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
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
        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border border-glass-border bg-surface px-8 py-16 text-center">
            <div
              aria-hidden="true"
              className="animate-pulse-glow pointer-events-none absolute left-1/2 top-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow blur-3xl"
            />
            <div className="relative flex flex-col items-center gap-5">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Experience NevPlay?
              </h2>
              <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
                Download the latest version and transform how you listen to local music.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-4">
                <ButtonLink href="/download" size="lg">
                  Get NevPlay Free
                </ButtonLink>
                <ButtonLink href="/roadmap" variant="secondary" size="lg">
                  View Roadmap
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
