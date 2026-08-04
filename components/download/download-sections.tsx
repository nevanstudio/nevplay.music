import Image from "next/image"
import { installSteps, systemRequirements, faqs } from "@/lib/data"
import { GITHUB_REPO_URL } from "@/lib/nav"
import { Reveal } from "@/components/motion/reveal"
import { GlassCard, SectionHeading } from "@/components/ui/primitives"

const stores = [
  {
    name: "GitHub Releases",
    description: "Official releases & source code",
    icon: "/assets/icones/Refresh_loading.png",
    href: GITHUB_REPO_URL,
    available: true,
  },
  {
    name: "APKPure",
    description: "Direct APK mirror store",
    icon: "/assets/icones/apkpure.png",
    href: null,
    available: false,
  },
  {
    name: "Uptodown",
    description: "Verified Android app store",
    icon: "/assets/icones/uptodown.png",
    href: null,
    available: false,
  },
  {
    name: "Google Play Store",
    description: "Auto-updates (review pending)",
    icon: "/assets/icones/playstore.png",
    href: null,
    available: false,
  },
  {
    name: "Samsung Galaxy Store",
    description: "Official Galaxy package",
    icon: "/assets/icones/galaxystore.png",
    href: null,
    available: false,
  },
  {
    name: "Huawei AppGallery",
    description: "Optimized for HarmonyOS",
    icon: "/assets/icones/appgallery.png",
    href: null,
    available: false,
  },
]

export function InstallGuide() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading
            eyebrow="Install Guide"
            title="Four Steps to Premium Audio"
            description="Sideloading NevPlay takes less than a minute."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {installSteps.map((step, index) => (
            <Reveal key={step.step} delay={index * 80}>
              <GlassCard hover className="flex h-full flex-col gap-3 p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
                  {step.step}
                </span>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

import { getDynamicStores } from "@/lib/stores"

export async function StoreCards() {
  const stores = await getDynamicStores()

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionHeading
            eyebrow="Distribution"
            title="Alternative App Stores"
            description="Prefer third-party distribution? NevPlay is heading to major Android stores."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store, index) => {
            const inner = (
              <GlassCard
                hover={store.available}
                className={`relative flex h-full items-center gap-4 p-5 transition-all duration-300 ${
                  store.available
                    ? "border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg shadow-primary/5"
                    : "opacity-75 hover:opacity-100 hover:border-primary/20"
                }`}
              >
                {store.icon ? (
                  <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl border border-glass-border bg-secondary/80 p-2 shadow-inner">
                    <Image
                      src={store.icon}
                      alt={store.name}
                      width={36}
                      height={36}
                      className="size-8 object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 font-mono text-sm font-bold text-primary">
                    GH
                  </div>
                )}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="font-bold text-sm tracking-tight truncate">{store.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{store.description}</span>
                </div>
                {store.available ? (
                  <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                    Live
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full border border-glass-border bg-secondary/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Soon
                  </span>
                )}
              </GlassCard>
            )
            return (
              <Reveal key={store.name} delay={index * 50}>
                {store.href ? (
                  <a href={store.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function SystemRequirements() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow="Requirements" title="Device Requirements" align="left" />
        </Reveal>
        <Reveal className="mt-8">
          <GlassCard className="divide-y divide-glass-border">
            {systemRequirements.map((req) => (
              <div
                key={req.label}
                className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <dt className="text-sm font-medium text-muted-foreground">{req.label}</dt>
                <dd className="text-sm font-semibold">{req.value}</dd>
              </div>
            ))}
          </GlassCard>
        </Reveal>
      </div>
    </section>
  )
}

export function FaqSection({ title = "Frequently Asked Questions" }: { title?: string }) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title={title} />
        </Reveal>
        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 50}>
              <details className="glass-panel group rounded-xl">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
