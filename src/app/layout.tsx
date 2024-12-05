import { ReactNode } from 'react';
import { Navigation } from '../components/Navigation';
import { QueryProvider } from '../components/Providers/QueryProvider';
import { PWAPrompt } from '../components/PWAPrompt/PWAPrompt';
import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#007AFF" />
        <meta name="description" content="A modern cocktail search application" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <QueryProvider>
          <Navigation />
          <div className="app-container">
            {children}
          </div>
          <PWAPrompt />
        </QueryProvider>
      </body>
    </html>
  );
}

export default RootLayout;

export const metadata = {
  title: 'Drink Index',
  description: 'A modern cocktail search application',
  manifest: '/manifest.json',
  themeColor: '#007AFF',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Drink Index',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}; 