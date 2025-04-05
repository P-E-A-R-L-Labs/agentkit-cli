import { createPublicClient, createWalletClient, http } from "viem";
import { monadTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

export function createViemPublicClient(privateKey?: string) {
  // Configure with retry and timeout
  const transport = http('https://testnet-rpc.monad.xyz/', {
    retryDelay: 1000,
    retryCount: 3,
    timeout: 15_000,
  });

  const publicClient = createPublicClient({
    chain: monadTestnet,
    transport,
  });

  let walletClient = null;
  if (privateKey) {
    try {
      walletClient = createWalletClient({
        chain: monadTestnet,
        transport,
        account: privateKeyToAccount(privateKey as `0x${string}`)
      });
    } catch (error) {
      console.error('Wallet client initialization failed:', error);
    }
  }

  return {
    publicClient,
    walletClient,
  };
}