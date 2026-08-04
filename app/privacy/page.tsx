import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, Lock, HardDrive, Wifi, CheckCircle, ExternalLink } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { Badge, GlassCard, PageHero } from "@/components/ui/primitives"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "NevPlay Privacy Policy — Engineered for absolute data sovereignty. Zero data collection, local-first architecture.",
}

const sections = [
  {
    icon: ShieldCheck,
    title: "1. Privacy by Design",
    content:
      "NevPlay is a professional-grade music experience built on a strict zero-knowledge policy. We do not harvest, track, or sell your personal information. Your digital footprint remains entirely within your control.",
  },
  {
    icon: Lock,
    title: "2. Data Ownership",
    content:
      "We do not collect personally identifiable information. We believe that your listening habits are private; therefore, we do not monitor your behavior, location, or metadata. You are the sole owner of all data stored on your device.",
  },
  {
    icon: HardDrive,
    title: "3. Local-First Architecture",
    content:
      "All app configurations, playlists, equalizer settings, and playback statistics are stored exclusively in your device's secure, local storage environment. We do not maintain cloud servers capable of viewing or syncing your local library.",
  },
  {
    icon: Wifi,
    title: "4. Network & Permissions",
    content:
      "NevPlay requests only the minimum permissions necessary for offline music playback. Network usage occurs exclusively when you invoke specific online features, such as fetching lyrics. No tracking identifiers are ever attached to these requests.",
  },
  {
    icon: CheckCircle,
    title: "5. Integrity & Professionalism",
    content:
      "Our commitment to your privacy is absolute. By keeping our architecture localized, we eliminate the security and privacy risks inherent in data-harvesting business models.",
  },
]

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title="Zero-Knowledge. 100% Private."
        description="Your music, your data, your privacy. NevPlay is engineered for those who demand absolute data sovereignty."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Highlight Card */}
          <Reveal>
            <GlassCard className="relative overflow-hidden p-8 md:p-10 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
              />
              <div className="relative flex flex-col gap-3">
                <Badge className="w-fit">
                  <ShieldCheck className="size-3.5" />
                  Absolute Data Sovereignty
                </Badge>
                <blockquote className="text-lg font-medium italic text-foreground md:text-xl leading-relaxed">
                  &ldquo;Your music, your data, your privacy. NevPlay is engineered for those who demand absolute data sovereignty.&rdquo;
                </blockquote>
                <p className="text-xs text-muted-foreground pt-2">
                  Last Updated: <span className="font-mono text-primary">August 4, 2026</span>
                </p>
              </div>
            </GlassCard>
          </Reveal>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map((sec, index) => (
              <Reveal key={sec.title} delay={index * 60}>
                <GlassCard hover className="p-6 md:p-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <sec.icon className="size-5" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">{sec.title}</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground pl-13">
                    {sec.content}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          {/* Contact Section */}
          <Reveal delay={350}>
            <GlassCard className="p-8 space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">6. Contact & Support</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                For privacy inquiries or technical questions regarding data handling, please reach out to our dedicated support team:
              </p>
              <Link
                href="https://github.com/nevanstudio/nevplay_releases/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline pt-1"
              >
                <span>NevPlay Support Center on GitHub</span>
                <ExternalLink className="size-4" />
              </Link>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </>
  )
}
