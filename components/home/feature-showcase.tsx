import Image from "next/image"
import { AudioLines, Mic2, Palette, ShieldCheck, WifiOff } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/ui/primitives"

const features = [
  {
    icon: WifiOff,
    title: "Your Library, Always Offline",
    description:
      "Your entire local music collection, always available. No internet required, no streaming dependencies, no buffering — just instant playback of the music you own.",
    image: "/assets/screenshots/Home.png",
    alt: "NevPlay home screen showing the local music library",
  },
  {
    icon: Mic2,
    title: "Karaoke-Style Synced Lyrics",
    description:
      "LRC lyrics highlight in real time, beautifully animated to the rhythm. Full-screen lyric mode turns every song into an experience.",
    image: "/assets/screenshots/Full_Screen_Lyrics_View.png",
    alt: "Full screen synced lyrics view in NevPlay",
  },
  {
    icon: AudioLines,
    title: "Professional Audio Tuning",
    description:
      "A multi-band equalizer plus AutoEQ integration with thousands of community-tuned headphone profiles. Perfect sound for your exact headphones, automatically.",
    image: "/assets/screenshots/Equalizer.png",
    alt: "NevPlay professional equalizer screen",
  },
  {
    icon: Palette,
    title: "Material You, Liquid Glass",
    description:
      "Dynamic color palettes pulled straight from your wallpaper, layered with NevPlay's signature Liquid Glass interface. Every screen feels personal.",
    image: "/assets/screenshots/Player.png",
    alt: "NevPlay now playing screen with Material You theming",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Without Compromise",
    description:
      "Zero analytics, zero tracking, zero accounts. Listening stats are computed on-device and never leave it. Your music stays yours.",
    image: "/assets/screenshots/Rhythm_Stats.png",
    alt: "NevPlay privacy-first local listening statistics",
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
