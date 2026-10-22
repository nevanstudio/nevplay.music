import Image from "next/image"
import { AudioLines, Mic2, Palette, ShieldCheck, WifiOff, Clock, SlidersHorizontal, Moon, Sparkles } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/ui/primitives"

const features = [
  {
    icon: Palette,
    title: "Material 3 Expressive & Liquid Glass",
    description:
      "Fluid dynamic colors extracted in real-time from album art, accompanied by responsive waveform seeking, frosted glass controls, and gesture-driven bottom sheets.",
    image: "/assets/screenshots/now_playing_screen.png",
    alt: "NevPlay Material 3 Expressive Now Playing Screen",
  },
  {
    icon: Mic2,
    title: "Synced Karaoke-Style Lyrics",
    description:
      "Synchronized LRC and syllable-accurate lyrics glide smoothly into view with animated lead-in countdowns, custom offset synchronization, and ambient blurred backdrops.",
    image: "/assets/screenshots/full_lyrics_screen.png",
    alt: "NevPlay Full Screen Synced Karaoke Lyrics",
  },
  {
    icon: Moon,
    title: "Intelligent Bedtime Sleep Timer",
    description:
      "Wake up refreshed with our live countdown hero, dynamic wavy progress loader, quick extender pills, and gentle 15-second audio fade-out that lets your tracks finish naturally.",
    image: "/assets/screenshots/sleep_timer_screen.png",
    alt: "NevPlay Redesigned Sleep Timer with Wavy Progress",
  },
  {
    icon: WifiOff,
    title: "Pure Offline Library with Multi-Selection",
    description:
      "Your complete local music library instantly accessible without accounts or internet. Effortlessly batch-edit ID3 tags, manage playlists, and bulk-organize songs with full multi-selection.",
    image: "/assets/screenshots/library_screen.png",
    alt: "NevPlay Local Music Library and Multi-Select Deck",
  },
  {
    icon: AudioLines,
    title: "Pro Acoustic Engine & Hardware Offload",
    description:
      "Deep bass enhancement, 3D spatial widening, hardware-accelerated audio offload, and real-time audio session diagnostics calibrated for zero battery drain.",
    image: "/assets/screenshots/device_capability_screen.png",
    alt: "NevPlay Audio Device Capabilities and DSP Engine",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-First Customization & Smart Filters",
    description:
      "Zero analytics, zero tracking, zero telemetries. Full blacklist and whitelist controls automatically shield system ringtones, alarms, recordings, and Android folders on all drives.",
    image: "/assets/screenshots/settings_screen.png",
    alt: "NevPlay Material 3 Settings and Focus Folders",
  },
]

export function FeatureShowcase() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-20">
        <Reveal>
          <SectionHeading
            eyebrow="Why NevPlay"
            title="Every Detail, Crafted for Listeners"
            description="From synced lyrics and AI-powered discovery to professional-grade audio tuning — a premium local music experience on Android."
          />
        </Reveal>

        {features.map((feature, index) => (
          <Reveal key={feature.title}>
            <div
              className={`flex flex-col items-center gap-10 lg:gap-16 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              <div className="flex flex-1 flex-col items-start gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <feature.icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                  {feature.title}
                </h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              <div className="relative flex flex-1 justify-center">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 m-auto h-64 w-64 rounded-full bg-glow blur-3xl"
                />
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  width={280}
                  height={580}
                  className="relative w-56 rounded-2xl border border-glass-border shadow-2xl md:w-64"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
