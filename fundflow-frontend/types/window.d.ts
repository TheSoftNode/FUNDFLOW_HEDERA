import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    hashpack?: any; // You might want to add proper types for HashPack too
  }
}

export {};


