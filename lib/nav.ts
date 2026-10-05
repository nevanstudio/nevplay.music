import {
  Home,
  Download,
  Sparkles,
  Rocket,
  Newspaper,
  Info,
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
  { label: "Releases", href: "/releases", icon: Rocket },
  { label: "News & Dispatch", href: "/news", icon: Newspaper },
  { label: "About", href: "/about", icon: Info },
]

export const GITHUB_REPO_URL = "https://github.com/nevanstudio/nevplay_releases"
export const GITHUB_ISSUES_URL = "https://github.com/nevanstudio/nevplay_releases/issues"
