import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { AnimatedLayout } from '@/components/AnimatedLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodeForge - Modern Codeforces Analytics',
  description: 'A modern Codeforces analytics platform with problem solver, submission viewer, and contest tracker.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AnimatedLayout>
              {children}
            </AnimatedLayout>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 