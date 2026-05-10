import type { Metadata } from 'next';
import './globals.css';
import { SeismicProvider } from '@/context/SeismicContext';

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
    <html lang="en">
      <body className="antialiased">
        <SeismicProvider>
          {children}
        </SeismicProvider>
      </body>
    </html>
  );
}