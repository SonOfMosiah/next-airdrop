import { http, fallback, unstable_connector, createConfig } from 'wagmi'
import { mainnet, polygon, arbitrum, goerli } from 'wagmi/chains'
import { injected, metaMask, coinbaseWallet, safe } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
    chains: [polygon, mainnet, arbitrum, goerli],
    connectors: [
        injected(),
        metaMask(),
        coinbaseWallet({
            appName: 'nft-airdrop-utility'
        }),
        safe()],
    transports: {
        [polygon.id]: fallback([
            unstable_connector(safe),
            http(),
        ]),
        [mainnet.id]: fallback([
            unstable_connector(safe),
            http(),
        ]),
        [arbitrum.id]: fallback([
            unstable_connector(safe),
            http(),
        ]),
        [goerli.id]: fallback([
            unstable_connector(safe),
            http(),
        ]),
    }
})
