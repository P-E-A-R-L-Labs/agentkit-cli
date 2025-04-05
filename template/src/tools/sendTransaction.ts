// sendTransactionTool.ts
import type { Tool } from '../config/toolConfig.ts';
import { createViemPublicClient } from '../config/networkConfig.ts';
import { monadTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';

export const createSendTransactionTool = (privateKey?: string): Tool => {
  // Add debug logs
  console.log('Initializing send transaction tool...');
  if (!privateKey) {
    console.warn('No private key provided - transactions will fail');
    return {
      name: 'send_transaction',
      description: 'Send MONAD tokens on Monad testnet (disabled - no private key)',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      },
      execute: async () => {
        throw new Error('Transaction tool disabled - no private key provided');
      }
    };
  }

  // Ensure the private key has the 0x prefix
  const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  
  // Create account directly from private key for local signing
  const account = privateKeyToAccount(formattedKey as `0x${string}`);
  console.log(`Account address from private key: ${account.address}`);
  
  // Create public client for read operations
  const publicClient = createViemPublicClient().publicClient;
  
  // Create wallet client with local account for sending transactions
  const localWalletClient = createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(monadTestnet.rpcUrls.default.http[0])
  });

  return {
    name: 'send_transaction',
    description: 'Send MONAD tokens on Monad testnet',
    parameters: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient address starting with 0x',
          pattern: '^0x[a-fA-F0-9]{40}$'
        },
        value: {
          type: 'string',
          description: 'Amount in wei (1 MONAD = 10^18 wei)',
          pattern: '^[0-9]+$'
        }
      },
      required: ['to', 'value']
    },
    execute: async (params: Record<string, any>) => {
      console.log('Attempting transaction with params:', params);

      try {
        // 1. Verify account balance first
        console.log('Using account:', account.address);
        
        const balance = await publicClient.getBalance({ address: account.address });
        console.log('Account balance:', balance.toString());
        
        const value = BigInt(params.value);
        if (balance < value) {
          const errorMsg = `Insufficient balance: ${balance.toString()} < ${value.toString()}`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        // 2. Estimate gas
        const gasEstimate = await publicClient.estimateGas({
          account: account.address,
          to: params.to,
          value,
        });
        console.log('Estimated gas:', gasEstimate.toString());

        // 3. Send the transaction using eth_sendRawTransaction under the hood
        console.log('Sending transaction...');
        const txHash = await localWalletClient.sendTransaction({
          to: params.to,
          value,
          gas: gasEstimate,
        });
        
        console.log('Transaction hash:', txHash);

        // 4. Wait for confirmation
        console.log('Waiting for transaction receipt...');
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
          timeout: 60_000 // 60 second timeout
        });
        console.log('Transaction receipt:', receipt);

        // Convert any BigInt values to strings for JSON serialization
        const safeReceipt = {
          status: receipt.status === 'success' ? 'success' : 'failed',
          txHash,
          from: receipt.from,
          to: receipt.to,
          blockNumber: typeof receipt.blockNumber === 'bigint' ? 
                       receipt.blockNumber.toString() : 
                       receipt.blockNumber,
          gasUsed: typeof receipt.gasUsed === 'bigint' ? 
                  receipt.gasUsed.toString() : 
                  undefined,
          effectiveGasPrice: typeof receipt.effectiveGasPrice === 'bigint' ? 
                            receipt.effectiveGasPrice.toString() : 
                            undefined,
          explorerUrl: `${monadTestnet.blockExplorers?.default.url}/tx/${txHash}`
        };

        return JSON.stringify(safeReceipt);
      } catch (error) {
        console.error('Transaction failed:', error);
        throw new Error(`Transaction failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };
};