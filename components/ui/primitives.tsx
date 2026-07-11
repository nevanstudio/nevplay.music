import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function GlassCard({
  children,
  className,
  hover = false,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl",
        hover &&
          "transition-transform duration-300 will-change-transform hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground",
        className,
      )}
    >
      {children}
    </span>
  )
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"

const buttonVariants = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 hover:-translate-y-0.5 glow-shadow",
  secondary:
    "glass-panel text-foreground hover:bg-secondary hover:-translate-y-0.5",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
}

const buttonSizes = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-13 px-8 text-base",
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external = false,
}: {
  href: string
  children: ReactNode
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  className?: string
  external?: boolean
}) {
  const cls = cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
  align?: "center" | "left"
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-24 md:pb-20 md:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-105 w-[52rem] max-w-full -translate-x-1/2 rounded-full bg-glow blur-3xl"
      />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
        {eyebrow ? (
          <Badge className="blur-in">{eyebrow}</Badge>
        ) : null}
        <h1 className="blur-in text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl [animation-delay:100ms]">
          {title}
        </h1>
        {description ? (
          <p className="blur-in max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground [animation-delay:200ms]">
            {description}
          </p>
        ) : null}
        {children ? (
          <div className="blur-in mt-2 flex flex-wrap items-center justify-center gap-4 [animation-delay:300ms]">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  )
}
