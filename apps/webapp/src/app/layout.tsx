import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { ApiProvider } from '@/components/providers/api-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo List App',
  description: 'A simple and elegant task management application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ApiProvider>
          <QueryProvider>{children}</QueryProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
