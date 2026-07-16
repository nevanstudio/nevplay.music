import {
  Home,
  Download,
  Sparkles,
  Camera,
  Rocket,
  Map,
  Newspaper,
  Info,
  Heart,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Download", href: "/download", icon: Download },
  { label: "Features", href: "/features", icon: Sparkles },
  { label: "Screenshots", href: "/screenshots", icon: Camera },
  { label: "Releases", href: "/releases", icon: Rocket },
  { label: "Roadmap", href: "/roadmap", icon: Map },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "About", href: "/about", icon: Info },
  { label: "Donate", href: "/donate", icon: Heart },
  { label: "Help", href: "/help", icon: LifeBuoy },
]

export const GITHUB_REPO_URL = "https://github.com/nevanstudio/nevplay_releases"
