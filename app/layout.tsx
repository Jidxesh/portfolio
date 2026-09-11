import type { Metadata } from "next";
import { Outfit, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Jidnesh Chavan — App developer, full-stack, AI/ML",
  description:
    "Jidnesh Chavan — app developer in Mumbai working in Kotlin and Jetpack Compose, learning full-stack and AI/ML.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
