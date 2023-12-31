import * as React from 'react';
import Image from 'next/image'
import { Connector, useConnect } from 'wagmi';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function WalletOptionsModal() {
    const { connectors, connect } = useConnect();

    console.log('connectors:', connectors)

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Connect Wallet</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Connect Wallet</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {connectors.map((connector) => (
                            <WalletOption
                                key={connector.id}
                                connector={connector}
                                onClick={() => {
                                    connect({ connector });
                                }}
                            />
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

function WalletOption({
                          connector,
                          onClick,
                      }: {
    connector: Connector;
    onClick: () => void;
}) {
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const provider = await connector.getProvider();
            setReady(!!provider);
        })();
    }, [connector]);

    return (
        <Button type='submit' disabled={!ready} onClick={onClick}>
            {connector.icon && (
                <img
                    src={connector.icon}
                    alt={connector.name}
                    className="mr-2 h-5 w-5"
                />

            )}
            {connector.name}
        </Button>
    );
}
