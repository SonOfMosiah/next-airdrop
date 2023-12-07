import type { Address, PublicClient } from 'viem';

// todo: fix setParsed type
export const removeContractAddresses = async ({addresses, publicClient}: {addresses: Address[], publicClient: PublicClient}) => {
    let filteredAddresses = [...addresses];

    for (let i = 0; i < filteredAddresses.length; i++) {
        try {
            const bytecode = await publicClient.getBytecode({
                address: filteredAddresses[i]
            });
            if (bytecode && bytecode !== '0x') {
                console.log('Address is a contract:', filteredAddresses[i]);
                filteredAddresses.splice(i, 1);
                --i;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return { filteredAddresses };
};