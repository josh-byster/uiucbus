import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/navbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = "https://uiucbus.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UIUC Bus Tracker — Real-Time Champaign-Urbana Bus Departures",
    template: "%s | UIUC Bus Tracker",
  },
  description:
    "Track CUMTD buses in real time. View live departures, search stops, and navigate the Champaign-Urbana transit system from any device.",
  keywords: [
    "UIUC bus",
    "CUMTD",
    "Champaign-Urbana bus tracker",
    "real-time bus",
    "UIUC transit",
    "MTD bus",
    "University of Illinois bus",
  ],
  openGraph: {
    type: "website",
    siteName: "UIUC Bus Tracker",
    title: "UIUC Bus Tracker — Real-Time Champaign-Urbana Bus Departures",
    description:
      "Track CUMTD buses in real time. View live departures, search stops, and navigate the Champaign-Urbana transit system.",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "UIUC Bus Tracker",
    description:
      "Track CUMTD buses in real time. View live departures and search stops across Champaign-Urbana.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "UIUC Bus Tracker",
              url: siteUrl,
              description:
                "Real-time bus tracking for the UIUC/Champaign-Urbana transit system (CUMTD).",
              applicationCategory: "TravelApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires a modern web browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main>{children}</main>
          <footer className="py-4 text-center text-xs text-muted-foreground">
            Not affiliated with CUMTD. Transit data provided by the
            Champaign-Urbana Mass Transit District.
            <br />
            <a
              href="https://github.com/josh-byster/bus-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-foreground"
            >
              Open source on GitHub
            </a>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
