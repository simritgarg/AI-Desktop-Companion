import React from 'react';
import './globals.css';
import { AuthGuard } from '@/components/auth/AuthGuard';

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
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-espresso antialiased">
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
