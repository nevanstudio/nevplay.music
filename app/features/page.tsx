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
  FolderTree,
  SlidersHorizontal,
  Zap,
  Brain,
  Sliders,
} from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { ButtonLink, GlassCard, PageHero, SectionHeading } from "@/components/ui/primitives"
import { InteractiveFeatureShowcase } from "@/components/features/interactive-showcase"

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore NevPlay features: Material 3 Expressive UI, 10-Band Equalizer with AutoEQ, AI Smart Recommendations, Synced LRC Lyrics, and offline privacy.",
}

const featureGroups = [
  {
    category: "Material 3 Design & Aesthetics",
    description: "Built from the ground up using Jetpack Compose and Material 3 design tokens.",
    features: [
      {
        icon: Palette,
        title: "Material You Dynamic Color",
        description:
          "Extracts vibrant primary, secondary, and tonal surface palettes directly from your Android wallpaper or album cover art.",
      },
      {
        icon: Moon,
        title: "Fluent Design & Material Interface",
        description:
          "NevPlay's signature visual style — layered frosted glass cards, dynamic ambient artwork blurs, and smooth 120 FPS transitions.",
      },
      {
        icon: Sliders,
        title: "Theme Overrides",
        description:
          "Choose between Pure Pitch Black (AMOLED), Material Dark, Light, or customized gradient shaders tailored to your device.",
      },
      {
        icon: Gauge,
        title: "Under 40MB & 120 FPS",
        description:
          "Extremely lightweight, zero bloat, lightning-fast app launch times, and butter-smooth scrolling performance.",
      },
    ],
  },
  {
    category: "Pro Audio & Acoustic Engine",
    description: "Studio-grade sound controls engineered for audiophiles and casual listeners alike.",
    features: [
      {
        icon: AudioLines,
        title: "10-Band Graphic Equalizer",
        description:
          "Precise multi-frequency equalizer sliders with bass boost, sound virtualizer, and loudness enhancement controls.",
      },
      {
        icon: Headphones,
        title: "AutoEQ Headphone Profiles",
        description:
          "Integrated AutoEQ database containing over 1,000 preset headphone frequency correction curves for optimal sound fidelity.",
      },
      {
        icon: SlidersHorizontal,
        title: "Pitch & Speed Adjuster",
        description:
          "Variable speed control (0.5x to 2.0x) and pitch shifting for music practice, podcasts, or custom acoustic listening.",
      },
      {
        icon: Timer,
        title: "Sleep Fade-Out Timer",
        description:
          "Set a countdown timer to fall asleep — NevPlay gently lowers the audio volume before stopping playback automatically.",
      },
    ],
  },
  {
    category: "Synced Lyrics & AI Intelligence",
    description: "Interactive lyrics and privacy-first local artificial intelligence.",
    features: [
      {
        icon: Mic2,
        title: "Synced Karaoke Lyrics",
        description:
          "Real-time LRC file parsing and LRCLIB cloud integration with karaoke-style text highlighting matched to track rhythm.",
      },
      {
        icon: Sliders,
        title: "In-App Lyric Offset Editor",
        description:
          "Adjust lyric timing by + / - milliseconds directly inside the player UI to guarantee precise vocal synchronization.",
      },
      {
        icon: Brain,
        title: "Local AI Recommendation Engine",
        description:
          "On-device Machine Learning analyzes your listening history and acoustic parameters locally without cloud tracking.",
      },
      {
        icon: Sparkles,
        title: "AI Playlist Generator",
        description:
          "Create contextual mood playlists and dynamic track queues using smart local content matching algorithms.",
      },
    ],
  },
  {
    category: "Library Tools & Android Integration",
    description: "Complete control over your music files, ID3 tags, and car head units.",
    features: [
      {
        icon: FileEdit,
        title: "In-App ID3 Tag Editor",
        description:
          "Edit track titles, artist names, album titles, track numbers, and embed artwork directly into audio files.",
      },
      {
        icon: FolderTree,
        title: "Smart Directory Explorer",
        description:
          "Browse your music library by physical folder hierarchy or auto-scanned metadata tags with instant search.",
      },
      {
        icon: Car,
        title: "Android Auto Support",
        description:
          "Full car display interface featuring touch controls, album art background, voice search, and safe queue browsing.",
      },
      {
        icon: ShieldCheck,
        title: "100% Offline & Private",
        description:
          "Zero telemetry, zero ads, zero user data collection. Your local music library stays exclusively on your device.",
      },
    ],
  },
]

const stats = [
  { value: "Material 3", label: "Design Language" },
  { value: "120 FPS", label: "Smooth Animations" },
  { value: "1000+", label: "AutoEQ Profiles" },
  { value: "0 Telemetry", label: "100% Private" },
]

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Everything NevPlay Offers"
        title="Material 3 Music Player Built for Android"
        description="Explore NevPlay's studio audio engine, Material You dynamic shaders, local AI recommendation system, and synced LRC karaoke lyrics."
      >
        <ButtonLink href="/download" size="lg">
          <Download className="size-4" aria-hidden="true" />
          Download Free APK
        </ButtonLink>
        <ButtonLink href="/news" variant="secondary" size="lg">
          Read News & Notices
        </ButtonLink>
      </PageHero>

      {/* Stats Counter Bar */}
      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-panel flex flex-col items-center gap-1 rounded-2xl px-4 py-5 text-center border border-glass-border"
            >
              <span className="text-xl font-bold tracking-tight text-primary md:text-2xl">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground md:text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Material 3 Playground */}
      <section className="px-6 py-10">
        <Reveal>
          <InteractiveFeatureShowcase />
        </Reveal>
      </section>

      {/* Deep Feature Breakdown */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-20">
          {featureGroups.map((group) => (
            <div key={group.category} className="flex flex-col gap-8">
              <Reveal>
                <SectionHeading
                  eyebrow="Feature Group"
                  title={group.category}
                  description={group.description}
                  align="left"
                />
              </Reveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {group.features.map((feature, index) => (
                  <Reveal key={feature.title} delay={index * 120}>
                    <GlassCard hover className="flex h-full flex-col gap-3 p-6 border-glass-border">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                        <feature.icon className="size-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-base font-bold tracking-tight text-foreground">{feature.title}</h3>
                      <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
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

      {/* Call to Action */}
      <section className="px-6 pb-24">
        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-glass-border bg-card px-8 py-16 text-center shadow-2xl">
            <div
              aria-hidden="true"
              className="animate-pulse-glow pointer-events-none absolute left-1/2 top-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow blur-3xl"
            />
            <div className="relative flex flex-col items-center gap-5">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Ready to Experience NevPlay?
              </h2>
              <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
                Download the latest stable release and elevate your Android local music experience.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-4">
                <ButtonLink href="/download" size="lg" className="font-bold">
                  Get Stable APK Free
                </ButtonLink>
                <ButtonLink href="/news" variant="secondary" size="lg">
                  Read News Reports
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
