export const hero = {
  heading: {
    prefix: "Your Music.",
    highlight: "Beautifully Reimagined.",
    suffix: "The Premium Offline Music Player.",
  },
  description:
    "NevPlay is an Android music player that brings your local library to life. Private offline listening with synced lyrics, AI-powered recommendations, and a beautiful Material You Liquid Glass interface — built for lightning-fast performance without any tracking.",
  pills: [
    "Offline Music",
    "AI Recommendations",
    "Synced Lyrics",
    "Material You",
    "Liquid Glass UI",
    "Privacy First",
    "Lightning Fast",
    "Android Auto",
  ],
  stats: [
    { value: "100% Free", label: "No Ads Ever" },
    { value: "Weekly", label: "Regular Updates" },
    { value: "< 40MB", label: "Fast Performance" },
    { value: "No Tracking", label: "Privacy Focused" },
  ],
  nowPlaying: {
    title: "Midnight Drive",
    artist: "NevPlay",
    progress: 45,
    timeCurrent: "1:37",
    timeTotal: "3:45",
  },
  lyrics: [
    { text: "Driving down the neon streets", active: false },
    { text: "Where local beats and rhythms meet", active: true },
    { text: "Offline sound, privacy complete", active: false },
  ],
  aiRecommendation: {
    title: "Retro Waves",
    match: "98% Match",
  },
}

export type Screenshot = {
  id: string
  title: string
  category: string
  image: string
  description: string
}

export const screenshots: Screenshot[] = [
  {
    id: "now_playing",
    title: "Material 3 Now Playing",
    category: "Player",
    image: "/assets/screenshots/now_playing_screen.png",
    description:
      "Vibrant dynamic theming pulled directly from album art, paired with responsive waveform scrubbing and frosted glass controls.",
  },
  {
    id: "full_lyrics",
    title: "Synced Karaoke Lyrics",
    category: "Lyrics",
    image: "/assets/screenshots/full_lyrics_screen.png",
    description:
      "Full-screen word-by-word synced lyrics with smooth line entrances, countdown lead-in ring, and ambient blurred background.",
  },
  {
    id: "half_lyrics",
    title: "Interactive Lyrics Peek",
    category: "Lyrics",
    image: "/assets/screenshots/half_lyrics_screen.png",
    description:
      "Follow synchronized lines without leaving the player, complete with timing offset adjustment and haptic feedback.",
  },
  {
    id: "sleep_timer",
    title: "Redesigned Sleep Timer",
    category: "Audio",
    image: "/assets/screenshots/sleep_timer_screen.png",
    description:
      "Live countdown hero with wavy progress loader, quick extender pills, custom idle slider, and gentle 15-second audio fade-out.",
  },
  {
    id: "library",
    title: "Local Music Library",
    category: "Library",
    image: "/assets/screenshots/library_screen.png",
    description:
      "High-performance local music management with multi-selection deck for bulk tag editing, playlist addition, and instant playback.",
  },
  {
    id: "full_artist",
    title: "Artist Discography",
    category: "Library",
    image: "/assets/screenshots/full_artist_screen.png",
    description:
      "Curated artist view featuring full discography albums, top tracks, and integrated biography.",
  },
  {
    id: "artist_bottomsheet",
    title: "Quick Artist Navigator",
    category: "Library",
    image: "/assets/screenshots/artist_bottomsheet_screen.png",
    description:
      "Effortlessly browse artist highlights, track counts, and related releases right from your queue or now playing screen.",
  },
  {
    id: "device_capability",
    title: "Audio Engine Diagnostics",
    category: "Audio",
    image: "/assets/screenshots/device_capability_screen.png",
    description:
      "Real-time hardware audio offload diagnostics, spatialization processor capabilities, sample rates, and acoustic status.",
  },
  {
    id: "settings",
    title: "Material 3 Expressive Settings",
    category: "Settings",
    image: "/assets/screenshots/settings_screen.png",
    description:
      "Total customization of audio effects, themes, focus folders, and automatic system folder blacklisting on all storage volumes.",
  },
  {
    id: "about",
    title: "About NevPlay",
    category: "About",
    image: "/assets/screenshots/about_screen.png",
    description:
      "Independent, privacy-first audio philosophy with zero tracking, offline-first design, and transparent open-source engineering.",
  },
  {
    id: "updater",
    title: "Seamless In-App Updater",
    category: "Updates",
    image: "/assets/screenshots/updater_screen_1.png",
    description:
      "Direct release notifications, auto-download checks, and verified SHA-256 package verification without third-party app stores.",
  },
  {
    id: "changelog",
    title: "Release Changelog View",
    category: "Updates",
    image: "/assets/screenshots/updater_screen_2.png",
    description:
      "Detailed release notes, feature highlights, and performance benchmarks delivered right inside the app.",
  },
]

export type CuratedRelease = {
  version: string
  date: string
  title: string
  image: string
  changelog: string[]
}

export const curatedReleases: CuratedRelease[] = [
  {
    version: "Version 2026.07",
    date: "July 2026",
    title: "The Glassmorphism Era",
    image: "/assets/image_releases/Rhythm_5.1_Release.png",
    changelog: [
      "Completely rewritten website layout with interactive Liquid Glass components",
      "Dynamic background matching with 60 FPS scrolling and parallax",
      "Added support for advanced local file scanning and sorting algorithms",
      "Enhanced equalizer sound profiles with AutoEQ integrations",
      "Privacy tracking shield: 100% zero analytics or data collection",
    ],
  },
  {
    version: "Version 2026.06.01",
    date: "June 2026",
    title: "Material You Integration",
    image: "/assets/image_releases/Rhythm_5_Release.png",
    changelog: [
      "Dynamic color palettes fetched directly from your Android wallpaper system",
      "Full offline synced lyrics support for LRC files",
      "Stately Now Playing cards with customized gradient shaders",
      "Android Auto integration with full speech-to-text searching",
    ],
  },
]

export const faqs = [
  {
    question: 'Why does Android warn about a "harmful file"?',
    answer:
      "This is a common false positive for sideloaded APKs. The warning appears because the app isn't distributed through the Play Store. Rest assured, NevPlay is secure and digitally signed.",
  },
  {
    question: "How do I add synced lyrics?",
    answer:
      "Place an .lrc file in the same folder as your audio file with a matching filename. NevPlay will automatically detect and sync lyrics during playback. You can also enable automatic lyrics fetching in Settings.",
  },
  {
    question: "Does NevPlay work with Android Auto?",
    answer:
      "Yes! NevPlay supports Android Auto with full playback controls, browse-by-artist/album, and voice search. Connect your phone to your car's head unit and NevPlay appears automatically.",
  },
  {
    question: "How do I use AutoEQ headphone profiles?",
    answer:
      "Open Settings, then Audio, then AutoEQ, and search for your headphone model. NevPlay includes thousands of community-tuned profiles that automatically adjust the equalizer for optimal sound on your specific headphones.",
  },
  {
    question: "Is my listening data collected or shared?",
    answer:
      "Absolutely not. NevPlay collects zero analytics, requires no accounts, and never transmits your listening history. All statistics are computed and stored locally on your device.",
  },
]

export const installSteps = [
  {
    step: "1",
    title: "Download File",
    description: 'Tap download to save the APK. Tap "Download Anyway" if prompted by your browser.',
  },
  {
    step: "2",
    title: "Enable Sources",
    description:
      'If requested, allow installation permissions from "Unknown Sources" or your browser.',
  },
  {
    step: "3",
    title: "Install & Run",
    description:
      'Tap the download notification or find the file, hit "Install" and launch the player.',
  },
  {
    step: "4",
    title: "Scan & Enjoy",
    description: "NevPlay finds your local music automatically. Press play and enjoy.",
  },
]

export const systemRequirements = [
  { label: "Operating System", value: "Android 8.0 (Oreo) or higher" },
  { label: "Architecture", value: "arm64-v8a / armeabi-v7a / x86_64" },
  { label: "Root Access", value: "Not required" },
  { label: "Internet Permission", value: "No — purely offline local player" },
]
