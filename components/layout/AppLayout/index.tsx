'use client'
import { ReactNode } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import {ModeToggle} from "@/components/layout/ModeToggle";
import {useAccount} from "wagmi";
import {Account} from "@/components/Account";
import {WalletOptionsModal} from "@/components/WalletOptionsModal";

type AppLayoutProps = {
    children: ReactNode;
};

function ConnectWallet() {
    const { isConnected } = useAccount()
    if (isConnected) return <Account />
    return <WalletOptionsModal />
}

export function AppLayout({ children }: AppLayoutProps) {
    const {  resolvedTheme } = useTheme();

    return (
        <div className="flex flex-col space-y-16 bg-gray-100 dark:bg-gray-800">
            <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-700">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <div className="container flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Image
                                src={resolvedTheme === 'dark' ? '/airdrop-white.svg' : '/airdrop.svg'}
                                // src="/airdrop.svg"
                                alt="logo"
                                width={50}
                                height={50}
                                className="dark:color-white"
                            />
                            <h1> NFT Airdrop Utility</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ConnectWallet />
                            <ModeToggle/>
                        </div>
                    </div>
                </div>
            </header>
            <div className="container">
                <main className="flex w-full flex-1 flex-col">{children}</main>
            </div>
        </div>
    );
}
