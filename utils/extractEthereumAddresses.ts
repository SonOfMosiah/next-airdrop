import {Address} from "viem";

export const extractEthereumAddresses = (data: any) => {
    const ethAddressRegex = /0x[a-fA-F0-9]{40}/;
    const addresses: Address[] = [];

    for (const row of data) {
        for (const key in row) {
            const potentialAddress = row[key];
            if (typeof potentialAddress === 'string' && ethAddressRegex.test(potentialAddress)) {
                addresses.push(potentialAddress as Address);
            }
        }
    }

    return addresses;
};