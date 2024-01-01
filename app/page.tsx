'use client'
import React, {useCallback, useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa, { ParseResult } from 'papaparse';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useFeeData,
  usePublicClient
} from 'wagmi'
import { removeContractAddresses } from '@/utils/removeContractAddresses';
import { extractEthereumAddresses } from '@/utils/extractEthereumAddresses';
import {Address, formatEther, parseAbi} from "viem";
import { Button } from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Minus, Plus} from "lucide-react";
import {H} from '@highlight-run/next/client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function Airdrop() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; count: number }[]>([]);

  const [ethereumAddresses, setEthereumAddresses] = useState<Address[]>([]);
  const [tokenAddress, setTokenAddress] = useState<Address>();
  const [tokenId, setTokenId] = useState<bigint>(0n);
  const [parsingAddresses, setParsingAddresses] = useState(false);
  const [numberOfAddresses, setNumberOfAddresses] = useState(0);
  const [showAddresses, setShowAddresses] = useState(false);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [numberOfTransactions, setNumberOfTransactions] = useState(1)

  const [estimatedGas, setEstimatedGas] = useState(0n);
  const [estimatedGasCost, setEstimatedGasCost] = useState(0n);

  const addresses_per_tx = 500

  const { data: feeData } = useFeeData()

  const { writeContractAsync, data, error, isError, isSuccess, isPending } = useWriteContract()

  useEffect(() => {
    if (!isConnected || !address) return;
    H.identify(address)
  }, [address, isConnected])

  useEffect(() => {
    if (ethereumAddresses && ethereumAddresses.length > 0) {
      setNumberOfTransactions(Math.ceil(ethereumAddresses.length / addresses_per_tx))
    }
    if (!tokenAddress || !tokenId || !ethereumAddresses || !publicClient || !isConnected || !feeData?.gasPrice) return;
    if (ethereumAddresses.length > 0) {
      const estimateGas = async () => {
        try {
          const gas = await publicClient.estimateContractGas({
            address: airdropContractAddress!,
            abi: parseAbi([
              'function airdropSingle(address tokenAddress, address[] calldata _recipients, uint256 tokenId) external',
            ]),
            functionName: 'airdropSingle',
            args: [tokenAddress!, ethereumAddresses, tokenId!],
            account: address!
          });
          setEstimatedGas(gas);
          const gasCost = gas * feeData.gasPrice!;
          setEstimatedGasCost(gasCost);
        } catch (error) {
            console.error('Error estimating gas:', error);
        }
      }
      estimateGas();
    }
  }, [ethereumAddresses, tokenAddress, tokenId, publicClient])


  const airdropContractAddress = '0x3aD35F512781eD69A18fBF6E383D7F4D2aE0D33d';

  const { data: isApprovedForAll } = useReadContract({
    address: tokenAddress!,
    abi: parseAbi([
      'function isApprovedForAll(address owner, address operator) external view returns (bool)',
    ]),
    functionName: 'isApprovedForAll',
    args: [address!, airdropContractAddress],
    query: {
      enabled: !!tokenAddress && !!address,
    }
  })

  const {data: balance, isError: isBalanceError} = useReadContract({
    address: tokenAddress!,
    abi: parseAbi([
      'function balanceOf(address account, uint256 id) external view returns (uint256)',
    ]),
    functionName: 'balanceOf',
    args: [address!, tokenId!],
    query: {
      enabled: !!tokenAddress && !!tokenId && isConnected,
    }
  })

  const handleAirdrop = async() => {
    let i = 0
    while (i < ethereumAddresses.length) {
      const k = i + addresses_per_tx <= ethereumAddresses.length ? i + addresses_per_tx : ethereumAddresses.length - i
      await writeContractAsync({
        address: airdropContractAddress,
        abi: parseAbi([
          'function airdropSingle(address tokenAddress, address[] calldata _recipients, uint256 tokenId) external',
        ]),
        functionName: 'airdropSingle',
        args: [tokenAddress!, ethereumAddresses.slice(i, k), tokenId!],
      }, {
        onSuccess: () => {
          i += k
          setNumberOfAddresses(numberOfAddresses - k)
          toast.success('Successfully airdropped ')
        },
        onError: () => {
          toast.error('Error Minting Beta NFT')
        }
      })
    }
  }

  const handleApproval = async() => {
    await writeContractAsync({
      address: tokenAddress!,
      abi: parseAbi([
        'function setApprovalForAll(address spender, bool isApprovedForAll) external',
      ]),
      functionName: 'setApprovalForAll',
      args: [airdropContractAddress, true]
    })
  }

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
            const count = addresses.length;

            // Update the state with file and count
            setUploadedFiles(prevFiles => [...prevFiles, { file, count }]);

            allAddresses.push(...addresses);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          // Parse CSV file
          Papa.parse(fileContent, {
            complete: async (result: ParseResult<any>) => {
              const addresses = extractEthereumAddresses(result.data);
              const count = addresses.length;

              // Update the state with file and count
              setUploadedFiles(prevFiles => [...prevFiles, { file, count }]);
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

    setNumberOfAddresses(allAddresses.length);
    setParsingAddresses(true);
    const { filteredAddresses } = await removeContractAddresses({addresses: allAddresses, publicClient});
    setParsingAddresses(false);
    setNumberOfAddresses(filteredAddresses.length);
    setEthereumAddresses(filteredAddresses);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json']
    } });

  return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-800">
        <ToastContainer />
        <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
          <div className="uploaded-files grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Dropzone as the last card in the grid */}
            <div {...getRootProps()}
                 className={`card dropzone bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center justify-center border-4 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all ${uploadedFiles.length === 0 ? 'col-span-full h-32' : ''}`}>
              <input {...getInputProps()} />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200">Drag & drop some files here, or click
                to select files</p>
              <em className="text-sm text-gray-500 dark:text-gray-400">(Only *.csv and *.json files will be
                accepted)</em>
            </div>
            {uploadedFiles.map(({ file, count }, index) => (
                <div key={index} className="card bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="card-header p-4 border-b dark:text-gray-400">
                    <h5 className="card-title font-semibold">{file.name}</h5>
                  </div>
                  <div className="card-content p-4 dark:text-gray-400">
                    <p>Addresses: {count}</p>
                  </div>
                </div>
            ))}
          </div>

          <div className="flex flex-col mb-4 space-y-4">
            <label className="text-lg font-medium text-gray-700 dark:text-gray-400">
              Token Address:
            </label>
            <input
                type="text"
                placeholder="Token Address"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value as Address)}
                className="p-2 rounded-md border border-gray-300"
            />
            {
                isConnected && isApprovedForAll && (
                    <>
                      <label className="text-lg font-medium text-gray-700 dark:text-gray-400">
                        Token ID:
                      </label>
                      <input
                          type="text"
                          placeholder="Token ID"
                          value={String(tokenId)}
                          onChange={(e) => setTokenId(BigInt(e.target.value))}
                          className="p-2 rounded-md border border-gray-300"
                      />
                    </>
                )
            }
            <div className="flex space-x-4">
              {isConnected && !isBalanceError && tokenAddress && tokenId ?
                  <div>Your Balance: {String(balance)} tokens</div> : null}
              {estimatedGasCost ? <div>Estimated gas cost: {formatEther(estimatedGasCost)} MATIC</div> : null}
            </div>
            <div className="flex space-x-4">
              {numberOfTransactions > 1 ? `Airdrop will be split into ${numberOfTransactions} transactions` : null}
            </div>
            {isConnected ? isApprovedForAll ? <Button
                onClick={handleAirdrop}
                disabled={isPending || !ethereumAddresses.length || !tokenAddress || !tokenId}
                className="bg-blue-500 text-white p-2 rounded-md"
            >
              {isPending ? <div className="spinner"/> : 'Submit'}
            </Button> : <Button
                onClick={handleApproval}
                disabled={isPending}
                className="bg-blue-500 text-white p-2 rounded-md"
            >
              {isPending ? <div className="spinner"/> : 'Approve'}
            </Button> : null}
          </div>
          {parsingAddresses ?
              <>
                <div>{`uploaded ${numberOfAddresses} addresses`}</div>
                <div className={'flex space-x-4 items-center'}>
                  <div className="spinner"/>
                  <div>Parsing addresses and removing non-ERC1155 receivers...</div>
                </div>

              </>
              : null}

          {!parsingAddresses && numberOfAddresses > 0 && (
              <div>
                <div className="mb-4 border border-gray-300 rounded-md p-4">
                  <h2 className="flex justify-between cursor-pointer" onClick={() => setShowAddresses(!showAddresses)}>
                    {showAddresses ? 'hide' : 'show'} {numberOfAddresses} Ethereum Addresses
                    {showAddresses ? <Minus/> : <Plus/>}
                  </h2>

                </div>
                {showAddresses && (
                    <>
                      <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id="sortAlphabetically"
                            checked={sortAlphabetically}
                            onChange={(e) => setSortAlphabetically(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="sortAlphabetically">Sort alphabetically</label>
                      </div>
                      <ScrollArea className="h-[300px] rounded-md border p-4">
                        <ul className="list-none m-0 p-0">
                          {sortAlphabetically ? ethereumAddresses.toSorted().map((address, index) => (
                              <li key={index} className="justify-address text-black dark:text-white ">
                                <a href={`https://polygonscan.com/address/${address}`} target="_blank"
                                   rel="noopener noreferrer">
                                  {address}
                                </a>
                              </li>
                          )) : ethereumAddresses.map((address, index) => (
                              <li key={index} className="justify-address text-black dark:text-white ">
                                <a href={`https://polygonscan.com/address/${address}`} target="_blank"
                                   rel="noopener noreferrer">
                                  {address}
                                </a>
                              </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </>
                )}
              </div>
          )}
          {isError ? <div>Error: {error?.message}</div> : null}
          {isSuccess ? <div>Success! Tx hash: {data}</div> : null}
        </div>
      </main>
  );
}
