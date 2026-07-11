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
    { value: "100% Free", label: "Open Source" },
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
    id: "home",
    title: "Home Screen",
    category: "Library",
    image: "/assets/screenshots/Home.png",
    description:
      "Your clean, modern music hub with local collection highlights and customized recommendations.",
  },
  {
    id: "player",
    title: "Beautiful Now Playing",
    category: "Player",
    image: "/assets/screenshots/Player.png",
    description:
      "Premium glass UI showcasing album art, high-fidelity playback controls, and smooth visualizations.",
  },
  {
    id: "lyrics_full",
    title: "Full Screen Lyrics View",
    category: "Player",
    image: "/assets/screenshots/Full_Screen_Lyrics_View.png",
    description:
      "Synced karaoke-style lyrics that highlight and transition beautifully to the rhythm of your music.",
  },
  {
    id: "equalizer",
    title: "Professional Equalizer",
    category: "Audio",
    image: "/assets/screenshots/Equalizer.png",
    description:
      "Multi-band audio frequency tuning tool to achieve the perfect acoustic response for any headphones.",
  },
  {
    id: "auto_eq",
    title: "AutoEQ Integration",
    category: "Audio",
    image: "/assets/screenshots/AutoEQ.png",
    description:
      "Choose from thousands of preset headphone profiles to optimize and balance sound automatically.",
  },
  {
    id: "rhythm_stats",
    title: "Rhythm & Listen Stats",
    category: "Analytics",
    image: "/assets/screenshots/Rhythm_Stats.png",
    description:
      "Understand your music taste with privacy-first listening history charts, statistics, and graphs.",
  },
  {
    id: "edit_metadata",
    title: "Tag Editor & Metadata",
    category: "Tools",
    image: "/assets/screenshots/Edit_Metadata.png",
    description:
      "Keep your local audio library organized by modifying titles, artists, albums, track numbers, and cover art.",
  },
  {
    id: "playlist",
    title: "Smart Playlists",
    category: "Library",
    image: "/assets/screenshots/Playlist.png",
    description:
      "Create custom lists of your favorite tracks or play automatically generated collections based on tags.",
  },
  {
    id: "queue",
    title: "Interactive Play Queue",
    category: "Player",
    image: "/assets/screenshots/Queue.png",
    description:
      "Easily manage upcoming tracks with drag-and-drop ordering and swift swipe-to-remove interactions.",
  },
  {
    id: "settings",
    title: "Extensive Customization",
    category: "Settings",
    image: "/assets/screenshots/Settings.png",
    description:
      "Tailor the interface, theme engine, gesture behaviors, language translations, and file scanners to your liking.",
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
      "This is a common false positive for sideloaded APKs. NevPlay is open source — you can verify the code yourself on GitHub. The warning appears because the app isn't distributed through the Play Store.",
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
