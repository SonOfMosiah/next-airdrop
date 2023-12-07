'use client'
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa, { ParseResult } from 'papaparse';
import {useAccount, useContractRead, useContractWrite, usePrepareContractWrite, usePublicClient} from 'wagmi'
import { removeContractAddresses } from '@/utils/removeContractAddresses';
import {Address, parseAbi} from "viem";
import {Connect} from "@/components/Connect";

export default function Home() {
    const [ethereumAddresses, setEthereumAddresses] = useState<Address[]>([]);
    const [tokenAddress, setTokenAddress] = useState<Address>();
    const [tokenId, setTokenId] = useState<bigint>(0n);
    const [parsingAddresses, setParsingAddresses] = useState(false);
    const publicClient = usePublicClient();
    const { address, isConnected } = useAccount();

    const airdropContractAddress = '0x3aD35F512781eD69A18fBF6E383D7F4D2aE0D33d';

    const { data: isApprovedForAll, isLoading: isApprovedForAllLoading, isSuccess: isApprovedForAllSuccess } = useContractRead({
        address: tokenAddress!,
        abi: parseAbi([
            'function isApprovedForAll(address owner, address operator) external view returns (bool)',
        ]),
        functionName: 'isApprovedForAll',
        args: [address!, airdropContractAddress],
        enabled: !!tokenAddress && !!address,
        watch: true
    })

    const { config: approveConfig, isError: isApprovePrepareError, error: approvePrepareError } = usePrepareContractWrite({
        address: tokenAddress!,
        abi: parseAbi([
            'function setApprovalForAll(address spender, bool isApprovedForAll) external',
        ]),
        functionName: 'setApprovalForAll',
        args: [airdropContractAddress, true]
    })

    const { data: approveData, isLoading: isApproveLoading, isSuccess: isApproveSuccess, write: approveWrite, error: approveError, isError: isApproveError } = useContractWrite(approveConfig)

    const { config, isError: isPrepareError, error: prepareError } = usePrepareContractWrite({
        address: airdropContractAddress,
        abi: parseAbi([
            'function airdropSingle(address tokenAddress, address[] calldata _recipients, uint256 tokenId) external',
        ]),
        functionName: 'airdropSingle',
        args: [tokenAddress!, ethereumAddresses, tokenId!],
        enabled: ethereumAddresses.length > 0 && isConnected && !!tokenAddress && !!tokenId,
    })

    const { data, isLoading, isSuccess, write, error, isError } = useContractWrite(config)

    const extractEthereumAddresses = (data: any) => {
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

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        let allAddresses: Address[] = [];

        for (const file of acceptedFiles) {
            const reader = new FileReader();

            reader.onabort = () => console.log('File reading was aborted');
            reader.onerror = () => console.log('File reading has failed');
            reader.onload = async () => {
                const fileContent = reader.result as string;

                if (file.type === 'application/json') {
                    try {
                        const jsonData = JSON.parse(fileContent);
                        const addresses = extractEthereumAddresses(jsonData);
                        allAddresses.push(...addresses);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                } else {
                    // Parse CSV file
                    Papa.parse(fileContent, {
                        complete: async (result: ParseResult<any>) => {
                            const addresses = extractEthereumAddresses(result.data);
                            allAddresses.push(...addresses);
                        },
                        header: true
                    });
                }
            };

            reader.readAsText(file);
        }

        // Wait for all files to be processed
        await new Promise(resolve => setTimeout(resolve, 1000));
        setParsingAddresses(true);
        const { filteredAddresses } = await removeContractAddresses({addresses: allAddresses, publicClient});
        setParsingAddresses(false);
        setEthereumAddresses(filteredAddresses);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: {
            'text/csv': ['.csv'],
            'application/json': ['.json']
        } });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            {!isConnected ? <Connect /> : null}
            <div className="mb-8"/>
            <div {...getRootProps()} className="border-dashed border-4 border-gray-300 rounded-md p-4 w-full max-w-xl text-center">
                <input {...getInputProps()} />
                <p>Drag & drop some files here, or click to select files</p>
                <em>(Only *.csv and *.json files will be accepted)</em>
            </div>
            <div className="mb-4"/>
            <div className="flex flex-col space-y-4 mb-4">
                <label className="text-lg font-medium text-gray-700">
                    Token Address:
                </label>
                <input
                    type="text"
                    placeholder="Token Address"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value as Address)}
                    className="p-2 rounded-md border border-gray-300"
                />
                <label className="text-lg font-medium text-gray-700">
                    Token ID:
                </label>
                <input
                    type="text"
                    placeholder="Token ID"
                    value={String(tokenId)}
                    onChange={(e) => setTokenId(BigInt(e.target.value))}
                    className="p-2 rounded-md border border-gray-300"
                />
                {isConnected ? isApprovedForAll ? <button
                    onClick={() => write?.()}
                    disabled={!config || isLoading || isError}
                    className="bg-blue-500 text-white p-2 rounded-md"
                >
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button> : <button
                    onClick={() => approveWrite?.()}
                    disabled={!approveConfig || isApproveLoading || isApproveError || isApprovedForAll}
                    className="bg-blue-500 text-white p-2 rounded-md"
                >
                    {isLoading ? 'Submitting approval...' : 'Approve'}
                </button> : null }
            </div>
            <div>
                <h2>Ethereum Addresses:</h2>
                {parsingAddresses ? <div>Parsing addresses...</div> : null}
                <ul>
                    {ethereumAddresses.map((address, index) => (
                        <li key={index}>{address}</li>
                    ))}
                </ul>
            </div>
            {isPrepareError ? <div>Error: {prepareError?.message}</div> : null}
            {isApprovePrepareError ? <div>Error: {approvePrepareError?.message}</div> : null}
            {isError ? <div>Error: {error?.message}</div> : null}
            {isSuccess ? <div>Success! Tx hash: {data?.hash}</div> : null}
        </main>
    );
}
