
import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"; // Your existing Toaster
import { Toaster as ReactHotToaster } from 'react-hot-toast'; // Toaster from react-hot-toast
import './globals.css';

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
      <body>
          {children}
          <Toaster /> {/* Your existing Toaster */}
          <ReactHotToaster position="top-right" /> {/* Toaster from react-hot-toast */}
      </body>
    </html>
  );
}
