import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'AI App Builder',
  description: 'Chat-first AI App Builder (MVP)'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
