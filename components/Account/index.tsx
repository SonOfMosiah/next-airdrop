import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {shortenAddress} from "@/utils/formatters";

export function Account() {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">{ensAvatar ? ensAvatar : null } {ensName ? ensName : address ? shortenAddress(address) : 'not connected'}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Connected</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 justify-items-center items-center">
                        {ensAvatar && <img alt="ENS Avatar" src={ensAvatar}/>}
                        {address && <div>{ensName ? `${ensName}` : shortenAddress(address)}</div>}
                        <Button onClick={() => disconnect()}>Disconnect</Button>
                    </div>
                </DialogContent>
                <DialogFooter>

                </DialogFooter>
            </Dialog>
        </>
    );
}