'use client'

import { WagmiProvider } from '@/providers/Wagmi'
import { ReactNode } from 'react'
import {ConnectKitProvider} from "connectkit";

// Root Provider
const RootProvider = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <WagmiProvider>
                <ConnectKitProvider>{children}</ConnectKitProvider>
            </WagmiProvider>
        </>
    )
}

// Exports
export { RootProvider }
