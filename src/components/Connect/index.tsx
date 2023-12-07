'use client'

import { ClientOnly } from '@/components/common/ClientOnly'
import { ConnectKitButton, useModal } from 'connectkit'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const Connect = () => {
    const {isConnected } = useAccount()
    const { setOpen } = useModal()

    useEffect(() => {
        if (!isConnected) {
            setOpen(true)
        }
    }, [isConnected])

    return (
        <div>
            <ClientOnly>
                <div className="flex items-center">
                    <ConnectKitButton />
                </div>
            </ClientOnly>
        </div>
    )
}

export { Connect }
