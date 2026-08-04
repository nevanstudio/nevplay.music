import type { Metadata } from "next"
import { Code2, Eye, Heart, Target, Users, Wallet } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { ButtonLink, GlassCard, PageHero, SectionHeading } from "@/components/ui/primitives"

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind NevPlay — a premium, private, offline music player built by an independent team.",
}

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "Give every Android user a world-class local music experience without compromising privacy or requiring subscriptions.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "A future where offline music players are as polished as streaming apps — but owned entirely by the listener.",
  },
  {
    icon: Heart,
    title: "Our Promise",
    description:
      "Free forever, no ads, no tracking. NevPlay will never sell your data because we never collect it.",
  },
]

const journey = [
  {
    year: "2024",
    title: "The Idea",
    description:
      "A frustration with bloated streaming apps leads to the first NevPlay prototype — a minimal local player with Material Design.",
  },
  {
    year: "2025",
    title: "Public Launch",
    description:
      "NevPlay is released publicly. Synced lyrics, equalizer, and smart playlists join the core playback engine.",
  },
  {
    year: "2026",
    title: "The Glass Era",
    description:
      "Material You integration, Liquid Glass UI, AI recommendations, and AutoEQ transform NevPlay into a premium experience.",
  },
]

const principles = [
  {
    icon: Users,
    title: "Independent Development",
    description:
      "Built by a small passionate team, not a corporation with shareholders to please.",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Feature priorities come from real users. Your feedback shapes every release.",
  },
  {
    icon: Code2,
    title: "Premium Quality",
    description:
      "Built with attention to detail. Every feature is crafted for excellence and reliability.",
  },
  {
    icon: Wallet,
    title: "Sustainable & Free",
    description:
      "Supported by donations, not ads or data mining. Optional support keeps development alive.",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Music Deserves Better"
        description="NevPlay was born from a simple frustration: why should listening to your own music feel second-class? We set out to build the player we always wanted — beautiful, fast, private, and entirely offline."
      />

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 60}>
              <GlassCard hover className="flex h-full flex-col gap-3 p-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <pillar.icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="font-semibold">{pillar.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SectionHeading
              eyebrow="Journey"
              title="How We Got Here"
              description="From a weekend prototype to a full-featured premium player — every step driven by listener feedback."
            />
          </Reveal>
          <ol className="relative mt-12 flex flex-col gap-10 border-l border-glass-border pl-8">
            {journey.map((step) => (
              <Reveal as="li" key={step.year} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.42rem] top-1 size-4 rounded-full border-2 border-background bg-primary"
                />
                <p className="font-mono text-sm font-semibold text-primary">{step.year}</p>
                <h3 className="mt-1 text-lg font-bold tracking-tight">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeading eyebrow="Principles" title="What We Stand For" />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 60}>
                <GlassCard className="flex gap-4 p-6">
                  <principle.icon
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-semibold">{principle.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-8">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
              Join the NevPlay Community
            </h2>
            <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Download the app, share feedback, or support the project — every bit helps.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/download">Download NevPlay</ButtonLink>
              <ButtonLink href="/donate" variant="secondary">
                Support Us
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
