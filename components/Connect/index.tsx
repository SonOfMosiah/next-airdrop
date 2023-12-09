'use client'

import { ClientOnly } from '@/components/common/ClientOnly'
import { ConnectKitButton, useModal } from 'connectkit'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {useTheme} from "next-themes";

const Connect = () => {
    const {isConnected } = useAccount()
    const { setOpen } = useModal()
    const {  resolvedTheme } = useTheme();

    const mode = resolvedTheme === 'dark' ? 'dark' : 'light'

    useEffect(() => {
        if (!isConnected) {
            setOpen(true)
        }
    }, [isConnected])

    return (
        <div>
            <ClientOnly>
                <div className="flex items-center">
                    <ConnectKitButton theme={"auto"} mode={'dark'} />
                </div>
            </ClientOnly>
        </div>
    )
}

export { Connect }
