import type { Metadata } from "next";
import "./globals.css";

export const viewport = {
  width: 'device-width',
  initialScale: 1.0
};

export const metadata: Metadata = {
  title: "V-Ticket",
  description: "Create, manage and sell tickets for your events. Discover upcoming events and purchase tickets securely.",
  keywords: ["events", "tickets", "event management", "virtual tickets", "event booking", "event planning", "online ticketing", "event apps", "ticketing app" ],
  authors: [
    { name: "Jabulani" },
    { name: "VTickets Team" }
  ],
  category: "Events & Ticketing",
  openGraph: {
    title: "V-Ticket | Event Ticketing Platform",
    description: "Create, manage and sell tickets for your events. Discover upcoming events and purchase tickets securely.",
    type: "website",
    locale: "en_NG",
    siteName: "V-Ticket"
  },
  twitter: {
    title: "V-Ticket | Event Ticketing Platform",
    description: "Create, manage and sell tickets for your events. Discover upcoming events and purchase tickets securely."
  },
  icons: {
    icon: "/favicon.png"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <link rel="icon" href="/favicon.png" type="image/png" sizes="300x300" />
      <link rel="icon" href="/favicon.png" type="image/png" sizes="250x250" />
      <link rel="apple-touch-icon" href="/favicon.png" sizes="250x250" />
    </head>
      <body>
        {children}
      </body>
    </html>
  );
}
