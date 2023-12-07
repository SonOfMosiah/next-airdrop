import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {RootProvider} from "@/providers/RootProvider";
import {ThemeProvider} from "@/providers/ThemeProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
          {children}
        </ThemeProvider>
      </RootProvider></body>
    </html>
  )
}
