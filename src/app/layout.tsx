import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const metadata: Metadata = {
  title: 'Provincial Intelligent Safety | Limpopo Guardian',
  description: 'AI-Powered Safety Platform for the Citizens of Limpopo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen relative overflow-x-hidden">
        <FirebaseClientProvider>
          <div 
            className="limpopo-bg" 
            style={{ backgroundImage: `url(${PlaceHolderImages[4].imageUrl})` }}
            data-ai-hint={PlaceHolderImages[4].imageHint}
          />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}