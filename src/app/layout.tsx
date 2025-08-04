import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'CleanCSV | Clean Your CSV Files in Seconds',
  description: 'Transform messy CSV files into clean, formatted data in seconds - no formulas, no scripts, no headaches.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <Script src="https://cdn.paddle.com/paddle/paddle.js" />
        <Script
          id="paddle-setup"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window.Paddle !== 'undefined') {
                window.Paddle.Setup({
                  token: 'live_b7c260dd6f1a3403c97dda234b3'
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
