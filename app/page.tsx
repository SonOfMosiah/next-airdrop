'use client'
import React, {useCallback, useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import Papa, { ParseResult } from 'papaparse';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useFeeData,
  usePrepareContractWrite,
  usePublicClient
} from 'wagmi'
import { removeContractAddresses } from '@/utils/removeContractAddresses';
import { extractEthereumAddresses } from '@/utils/extractEthereumAddresses';
import {Address, formatEther, formatGwei, parseAbi} from "viem";
import {Connect} from "@/components/Connect";
import { Button } from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Minus, Plus} from "lucide-react";
import {H} from '@highlight-run/next/client'

export default function Airdrop() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [ethereumAddresses, setEthereumAddresses] = useState<Address[]>([]);
  const [tokenAddress, setTokenAddress] = useState<Address>();
  const [tokenId, setTokenId] = useState<bigint>(0n);
  const [parsingAddresses, setParsingAddresses] = useState(false);
  const [numberOfAddresses, setNumberOfAddresses] = useState(0);
  const [showAddresses, setShowAddresses] = useState(false);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

  const [estimatedGas, setEstimatedGas] = useState(0n);
  const [estimatedGasCost, setEstimatedGasCost] = useState(0n);

  const { data: feeData } = useFeeData()

  useEffect(() => {
    if (!isConnected || !address) return;
    H.identify(address)
  }, [address, isConnected])

  useEffect(() => {
    if (!tokenAddress || !tokenId || !ethereumAddresses || !publicClient || !isConnected || !feeData?.gasPrice) return;
    if (ethereumAddresses.length > 0) {
      const estimateGas = async () => {
        console.log('enter estimateGas')
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
          console.log('gas', gas);

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

  const {data: balance, isError: isBalanceError} = useContractRead({
    address: tokenAddress!,
    abi: parseAbi([
      'function balanceOf(address account, uint256 id) external view returns (uint256)',
    ]),
    functionName: 'balanceOf',
    args: [address!, tokenId!],
    enabled: !!tokenAddress && !!tokenId && isConnected,
    watch: true
  })

  const { data, isLoading, isSuccess, write, error, isError } = useContractWrite(config)

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
    setNumberOfAddresses(allAddresses.length);
    setParsingAddresses(true);
    const { filteredAddresses } = await removeContractAddresses({addresses: allAddresses, publicClient});
    setParsingAddresses(false);
    setNumberOfAddresses(filteredAddresses.length);
    setEthereumAddresses(filteredAddresses);
    const sortedEthereumAddresses = filteredAddresses.toSorted();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json']
    } });

  return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-800">
        {!isConnected ? <Connect /> : null}
        <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
          <div {...getRootProps()} className="flex flex-col items-center justify-center w-full p-4 mb-4 border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all">
            <input {...getInputProps()} />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">Drag & drop some files here, or click to select files</p>
            <em className="text-sm text-gray-500 dark:text-gray-400">(Only *.csv and *.json files will be accepted)</em>
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
              { isConnected && !isBalanceError && tokenAddress && tokenId ? <div>Your Balance: {String(balance)} tokens</div> : null}
              {estimatedGasCost ? <div>Estimated gas cost: {formatEther(estimatedGasCost)} MATIC</div> : null}
            </div>
            {isConnected ? isApprovedForAll ? <Button
                onClick={() => write?.()}
                disabled={!config || isLoading || !ethereumAddresses.length || !tokenAddress || !tokenId}
                className="bg-blue-500 text-white p-2 rounded-md"
            >
              {isLoading ? <div className="spinner"/> : 'Submit'}
            </Button> : <Button
                onClick={() => approveWrite?.()}
                disabled={!approveConfig || isApproveLoading}
                className="bg-blue-500 text-white p-2 rounded-md"
            >
              {isApproveLoading ? <div className="spinner"/> : 'Approve'}
            </Button> : null }
          </div>
          { parsingAddresses ?
              <>
                <div>{`uploaded ${numberOfAddresses} addresses`}</div>
                <div className={'flex space-x-4 items-center'}>
                  <div className="spinner"/>
                  <div >Parsing addresses and removing non-ERC1155 receivers...</div>
                </div>

              </>
              : null }

          {!parsingAddresses && numberOfAddresses > 0 && (
              <div>
                <div className="mb-4 border border-gray-300 rounded-md p-4">
                  <h2 className="flex justify-between cursor-pointer" onClick={() => setShowAddresses(!showAddresses)}>
                    {showAddresses ? 'hide' : 'show'} {numberOfAddresses} Ethereum Addresses
                    {showAddresses ? <Minus /> : <Plus />}
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
                              <li key={index} className="justify-address">
                                <a href={`https://polygonscan.com/address/${address}`} target="_blank" rel="noopener noreferrer">
                                  {address}
                                </a>
                              </li>
                          )) : ethereumAddresses.map((address, index) => (
                              <li key={index} className="justify-address">
                                <a href={`https://polygonscan.com/address/${address}`} target="_blank" rel="noopener noreferrer">
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
          {isPrepareError ? <div>Error: {prepareError?.message}</div> : null}
          {isApprovePrepareError ? <div>Error: {approvePrepareError?.message}</div> : null}
          {isError ? <div>Error: {error?.message}</div> : null}
          {isSuccess ? <div>Success! Tx hash: {data?.hash}</div> : null}
        </div>
      </main>
  );
}
