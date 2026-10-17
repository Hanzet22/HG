import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import AnimationModeToggle from "./components/AnimationModeToggle";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hypergaruda-next.netlify.app"),
  title: {
    default: "HyperGaruda | Link Hub",
    template: "%s | HyperGaruda",
  },
  description:
    "HyperGaruda's personal link hub for portfolio, social media, education, contact, organization, websites, and project roadmap.",
  applicationName: "HyperGaruda Link Hub",
  keywords: [
    "HyperGaruda",
    "TKJ",
    "Networking",
    "Linux",
    "AI",
    "Open Source",
    "HG-ESR-NET",
  ],
  appleWebApp: {
    capable: true,
    title: "HyperGaruda",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "HyperGaruda | Link Hub",
    description:
      "One hub for HyperGaruda's portfolio, projects, social profiles, and contact links.",
    siteName: "HyperGaruda",
    type: "website",
    url: "https://hypergaruda-next.netlify.app",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#080b12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AnimationModeToggle />
        <div className="site-shell">{children}</div>
      </body>
    </html>
  );
}
