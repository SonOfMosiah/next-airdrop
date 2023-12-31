'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/providers/Wagmi'
import { WagmiProvider } from 'wagmi'

// Root Provider
const RootProvider = ({ children }: { children: ReactNode }) => {
    // 2. Set up a React Query client.
    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                    {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

// Exports
export { RootProvider }
