import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VTickets',
  description: 'Virtual Event Ticketing Platform',
  manifest: '/manifest.json',
  icons: [
    { rel: 'apple-touch-icon', url: '/icons/icon-192x192.png' },
    { rel: 'icon', url: '/favicon.ico' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VTickets',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="300x300" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="250x250" />
        <link rel="apple-touch-icon" href="/favicon.png" sizes="250x250" />
      </head>
      <body>{children}</body>
    </html>
  );
}
