import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PulsoFit | Train smarter every week",
    template: "%s | PulsoFit",
  },
  description:
    "Adaptive workouts, habit tracking, and recovery signals in one focused fitness cockpit.",
  metadataBase: new URL("https://pulsofit.vercel.app"),
  openGraph: {
    title: "PulsoFit",
    description:
      "Adaptive workouts, habit tracking, and recovery signals in one focused fitness cockpit.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
