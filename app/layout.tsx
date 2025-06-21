import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

// Get the brand prefix from environment variable, default to 'VMIS'
const brandPrefix = process.env.NEXT_PUBLIC_APP_BRAND_PREFIX || 'VMIS';

export const metadata: Metadata = {
  title: `${brandPrefix}-HRMS | Vendor Management & HR System`,
  description: 'Complete SaaS solution for vendor management and human resources',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}