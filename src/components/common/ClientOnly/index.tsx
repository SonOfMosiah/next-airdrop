'use client'

import { useState, useEffect, ReactNode } from 'react'

type ClientOnlyProps = {
    children: ReactNode
    className?: string
}

const ClientOnly = ({ children, className = 'flex w-full flex-col' }: ClientOnlyProps) => {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return null
    }

    return <div className={className}>{children}</div>
}

export { ClientOnly }
