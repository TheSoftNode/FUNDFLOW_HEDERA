# Hedera Wallet Integration Setup Guide

This guide explains how to set up and use the Hedera wallet integration in the FundFlow frontend.

## Overview

The FundFlow frontend now supports multiple Hedera wallet types:
- **HashPack**: Native Hedera wallet with full ecosystem support
- **MetaMask**: EVM-compatible wallet with Hedera EVM support
- **WalletConnect**: Multi-wallet support via QR code

## Environment Configuration

Create a `.env.local` file in the `fundflow-frontend` directory with the following variables:

```env
# Hedera Network Configuration
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_HEDERA_NETWORK_ID=296

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here

# HashPack Configuration
NEXT_PUBLIC_HASHPACK_APP_NAME=FundFlow
NEXT_PUBLIC_HASHPACK_APP_DESCRIPTION=Blockchain-Powered Startup Fundraising Platform
NEXT_PUBLIC_HASHPACK_APP_URL=https://fundflow.com

# MetaMask Configuration
NEXT_PUBLIC_METAMASK_CHAIN_ID=296
NEXT_PUBLIC_METAMASK_CHAIN_NAME=Hedera Testnet
NEXT_PUBLIC_METAMASK_RPC_URL=https://testnet.hashio.io/api
NEXT_PUBLIC_METAMASK_BLOCK_EXPLORER=https://hashscan.io/testnet
```

## Wallet Setup

### HashPack Wallet

1. **Install HashPack Extension**
   - Visit [hashpack.app](https://hashpack.app)
   - Install the browser extension
   - Create or import a wallet

2. **Get Testnet HBAR**
   - Visit [portal.hedera.com](https://portal.hedera.com)
   - Create an account and get testnet HBAR

### MetaMask Wallet

1. **Install MetaMask**
   - Visit [metamask.io](https://metamask.io)
   - Install the browser extension
   - Create or import a wallet

2. **Add Hedera Network**
   - Open MetaMask
   - Go to Settings > Networks
   - Add the Hedera testnet network:
     - Network Name: Hedera Testnet
     - RPC URL: https://testnet.hashio.io/api
     - Chain ID: 296
     - Currency Symbol: HBAR
     - Block Explorer: https://hashscan.io/testnet

### WalletConnect

1. **Get Project ID**
   - Visit [cloud.walletconnect.com](https://cloud.walletconnect.com)
   - Create an account and get a project ID
   - Add the project ID to your `.env.local` file

## Architecture

### Core Services

1. **HederaWalletService** (`lib/hedera-wallet-service.ts`)
   - Manages wallet connections
   - Handles different wallet types
   - Provides balance and transaction capabilities

2. **HederaTransactionService** (`lib/hedera-transactions.ts`)
   - Handles smart contract interactions
   - Supports campaign creation, investment, and milestone management
   - Works with both HashPack and MetaMask

3. **useAuth Hook** (`hooks/useAuth.tsx`)
   - Manages authentication state
   - Handles wallet connections and disconnections
   - Stores user profiles and preferences

### Components

1. **ConnectWalletButton** (`components/shared/wallet/ConnectWalletButton.tsx`)
   - Main wallet connection UI
   - Shows available wallets
   - Displays user information when connected

2. **WalletConnectionModal** (`components/shared/wallet/WalletConnectionModal.tsx`)
   - Detailed wallet selection modal
   - Shows wallet features and installation links
   - Handles connection errors

## Usage Examples

### Connecting a Wallet

```typescript
import { useAuth } from '@/hooks/useAuth';
import { WalletType } from '@/lib/hedera-wallet-service';

const MyComponent = () => {
  const { connectWallet, isConnected, user } = useAuth();

  const handleConnect = async () => {
    try {
      await connectWallet(WalletType.HASHPACK);
      console.log('Wallet connected!');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <div>Connected: {user?.walletAddress}</div>
      )}
    </div>
  );
};
```

### Creating a Campaign

```typescript
import { hederaTransactionService } from '@/lib/hedera-transactions';

const createCampaign = async () => {
  const result = await hederaTransactionService.createCampaign(
    'My Startup Campaign',
    'Funding for our innovative product',
    1000, // 1000 HBAR
    30 // 30 days
  );

  if (result.success) {
    console.log('Campaign created:', result.transactionId);
  } else {
    console.error('Campaign creation failed:', result.error);
  }
};
```

### Investing in a Campaign

```typescript
const investInCampaign = async (campaignId: number, amount: number) => {
  const result = await hederaTransactionService.investInCampaign(
    campaignId,
    amount
  );

  if (result.success) {
    console.log('Investment successful:', result.transactionId);
  } else {
    console.error('Investment failed:', result.error);
  }
};
```

## Network Configuration

### Testnet
- Network: `testnet`
- Chain ID: `296`
- RPC URL: `https://testnet.hashio.io/api`
- Block Explorer: `https://hashscan.io/testnet`

### Mainnet
- Network: `mainnet`
- Chain ID: `295`
- RPC URL: `https://mainnet.hashio.io/api`
- Block Explorer: `https://hashscan.io/mainnet`

## Smart Contract Integration

The frontend is designed to work with a FundFlow smart contract that supports:

- Campaign creation and management
- Investment functionality
- Milestone-based funding
- Voting mechanisms
- Fund release based on milestone completion

### Contract Functions

1. **Campaign Management**
   - `createCampaign(title, description, targetAmount, durationDays)`
   - `getCampaign(campaignId)`

2. **Investment**
   - `investInCampaign(campaignId)` (payable)

3. **Milestone Management**
   - `addMilestone(campaignId, title, description, targetAmount, votingDurationDays)`
   - `voteOnMilestone(campaignId, milestoneId, voteFor)`
   - `releaseMilestoneFunds(campaignId, milestoneId)`

## Error Handling

The wallet integration includes comprehensive error handling:

```typescript
try {
  await connectWallet(WalletType.HASHPACK);
} catch (error) {
  if (error.message.includes('not installed')) {
    // Redirect to wallet installation
    window.open('https://hashpack.app', '_blank');
  } else if (error.message.includes('user rejected')) {
    // User cancelled the connection
    console.log('User cancelled wallet connection');
  } else {
    // Other errors
    console.error('Connection error:', error);
  }
}
```

## Testing

### Development Testing

1. **Install Test Wallets**
   - Install HashPack extension
   - Install MetaMask extension
   - Get testnet HBAR from the portal

2. **Test Scenarios**
   - Connect HashPack wallet
   - Connect MetaMask wallet
   - Create a campaign
   - Invest in a campaign
   - Add milestones
   - Vote on milestones

### Production Considerations

1. **Security**
   - Always validate user inputs
   - Implement proper error handling
   - Use HTTPS in production
   - Validate contract addresses

2. **Performance**
   - Implement proper loading states
   - Cache wallet connections
   - Optimize transaction gas usage

3. **User Experience**
   - Provide clear error messages
   - Show transaction progress
   - Implement retry mechanisms
   - Add wallet installation guides

## Troubleshooting

### Common Issues

1. **Wallet Not Detected**
   - Ensure the wallet extension is installed
   - Check if the wallet is unlocked
   - Refresh the page and try again

2. **Network Issues**
   - Verify the correct network is selected
   - Check RPC URL configuration
   - Ensure sufficient HBAR for gas fees

3. **Transaction Failures**
   - Check account balance
   - Verify contract address
   - Ensure proper gas limits

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```env
NEXT_PUBLIC_DEBUG=true
```

This will show detailed console logs for wallet operations.

## Contributing

When adding new wallet support:

1. Update `WalletType` enum
2. Add connection method to `HederaWalletService`
3. Update transaction methods in `HederaTransactionService`
4. Add wallet option to UI components
5. Update documentation

## Resources

- [Hedera Documentation](https://docs.hedera.com/)
- [HashPack Documentation](https://docs.hashpack.app/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Hedera Portal](https://portal.hedera.com/) 