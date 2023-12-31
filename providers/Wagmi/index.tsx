import { http, fallback, unstable_connector, createConfig } from 'wagmi'
import { mainnet, polygon, arbitrum } from 'wagmi/chains'
import { injected, metaMask, coinbaseWallet, safe } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
    chains: [arbitrum],
    connectors: [injected(), metaMask(), safe()],
    transports: {
        [mainnet.id]: fallback([
            unstable_connector(safe),
            http(),
        ]),
        [polygon.id]: fallback([
            unstable_connector(safe),
            http(),
        ]),
        [arbitrum.id]: fallback([
            unstable_connector(safe),
            http(),
        ]),
    }
})
