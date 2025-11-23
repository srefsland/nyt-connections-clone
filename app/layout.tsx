import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://craftconnections.net/'),
  title: "CraftConnections - Daily Minecraft Puzzle",
  description: "Group four things in Minecraft that are related!",
  applicationName: "CraftConnections",
  creator: "CraftConnections",
  authors: {
    name: "CraftConnections",
    url: "https://craftconnections.net"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
    shortcut: "/favicon-large.ico",
  },
  keywords: "craftconnections, craft connections, minecraft connections, craftconnections.net, connections",
  openGraph: {
    title: 'CraftConnections',
    description: 'Group four things in Minecraft that are related!',
  },
  twitter: {
    title: "CraftConnections",
    description: "Group four things in Minecraft that are related!",
  },
  verification: {
    google: "TsXpzkOmM6ys5hHfwm3kEceFfCKnsWiKukj4f9Dmj8w"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://craftconnections.net",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <meta property="og:title" content="CraftConnections" />
      <meta property="og:description" content="Group four things in Minecraft that are related!" />
      <link rel="icon" href="/favicon.ico" sizes="144x144" />
      <link rel="icon" href="/favicon-48x48.png" sizes="48x48" />
      <link rel="icon" href="/icon-large.png" sizes="192x192" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <meta name="apple-mobile-web-app-title" content="CraftConnections - Daily Minecraft Puzzle"></meta>
      <meta property="og:locale" content="en_US" />
      <body className={inter.className}>
        <div itemScope itemType="https://schema.org/WebSite">
          <meta itemProp="name" content="CraftConnections - Daily Minecraft Puzzle" />
          <meta itemProp="url" content="https://craftconnections.net" />
          <meta itemProp="alternateName" content="CraftConnections" />
        </div>
        <div itemScope itemType="https://schema.org/Game">
          <meta itemProp="name" content="CraftConnections" />
          <meta itemProp="genre" content="Puzzle" />
          <meta itemProp="url" content="https://craftconnections.net" />
          <meta itemProp="datePublished" content="2025-11-18" />
          <meta itemProp="dateCreated" content="2025-11-08" />
          <meta itemProp="dateModified" content="2025-11-18" />
          <meta itemProp="inLanguage" content="en" />
        </div>
        {children}</body>
    </html>
  );
}
