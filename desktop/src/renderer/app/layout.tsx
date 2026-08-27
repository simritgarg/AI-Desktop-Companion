import React from 'react';
import './globals.css';

export const metadata = {
  title: 'AI Desktop Companion Dashboard',
  description: 'Personal AI Friend, Accountability Coach & Virtual Desktop Companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
