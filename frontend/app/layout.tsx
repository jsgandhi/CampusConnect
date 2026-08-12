import type { Metadata } from 'next';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'CampusConnect — Modern Student Portal & Academic Platform',
  description: 'Consolidated university web platform for course registration, campus events, advising appointments, and AI-assisted campus guidance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
