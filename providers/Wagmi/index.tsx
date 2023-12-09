import { ReactNode } from 'react'
import { configureChains, createConfig, WagmiConfig, Connector } from 'wagmi'
import {mainnet, polygon, arbitrum, goerli } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const WagmiProvider = ({ children }: { children: ReactNode }) => {
    const { chains, publicClient, webSocketPublicClient } = configureChains(
        [polygon, goerli],
        [publicProvider()]
    )

    const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

    let connectors: Connector[] = [
        new InjectedConnector({
            chains,
            options: {
                name: (detectedName) =>
                    `Injected (${
                        typeof detectedName === 'string' ? detectedName : detectedName.join(', ')
                    })`,
                shimDisconnect: true,
            },
        }),
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: 'Supa',
            },
        })
    ]

    if (WALLETCONNECT_PROJECT_ID && WALLETCONNECT_PROJECT_ID !== '') {
        // A WalletConnect ID is provided, so we add the Connector for testing purposes
        connectors = [
            ...connectors,
            new WalletConnectConnector({
                chains,
                options: {
                    showQrModal: false,
                    projectId: WALLETCONNECT_PROJECT_ID,
                },
            }),
        ]
    }

    const config = createConfig({
        autoConnect: true,
        connectors,
        publicClient,
        webSocketPublicClient,
    })

    return <WagmiConfig config={config}>{children}</WagmiConfig>
}

export { WagmiProvider }
