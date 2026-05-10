import type { Metadata } from 'next';
import './globals.css';
import { SeismicProvider } from '@/context/SeismicContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'BNBC Seismic Calculator for ETABS',
  description: 'BNBC 2020 Seismic Load Calculator for Structural Engineers in Bangladesh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <SeismicProvider>
            {children}
            <ThemeToggle />
          </SeismicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}