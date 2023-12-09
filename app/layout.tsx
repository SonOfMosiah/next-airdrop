import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { RootProvider } from "@/providers/RootProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppLayout } from '@/components/layout/AppLayout'; // Import AppLayout
import { HighlightInit } from '@highlight-run/next/client'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NFT Airdrop Utility',
  description: 'Utility to airdrop NFTs to a list of addresses',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <>
          <HighlightInit
              projectId={process.env.HIGHLIGHT_PROJECT_ID}
              serviceName="nft-airdrop-frontend"
              tracingOrigins
              networkRecording={{
                  enabled: true,
                  recordHeadersAndBody: true,
                  urlBlocklist: [],
              }}
          />
        <html lang="en">
          <head>
            <title>NFT Airdrop Utility</title>
          </head>
          <body className={inter.className}>
          <RootProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
            >
              <AppLayout>
                {children}
              </AppLayout>
            </ThemeProvider>
          </RootProvider>
          </body>
        </html>
      </>
  );
}