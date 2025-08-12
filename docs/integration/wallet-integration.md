# FundFlow Wallet Integration Guide

## 🎯 Overview

FundFlow supports multiple wallet types to provide users with flexibility and choice in how they interact with the platform. This guide covers the integration of HashPack, MetaMask, and WalletConnect v2 wallets with the FundFlow platform.

## 🔗 Supported Wallets

### **1. HashPack Wallet** 🟢

**Type**: Hedera-native wallet
**Best For**: Direct Hedera integration, low fees, optimal performance

#### **Features**
- Direct Hedera Hashgraph integration
- Lowest transaction fees
- Native Hedera account management
- Built-in token support
- Professional interface

#### **Installation**
1. Visit [HashPack.io](https://hashpack.app/)
2. Click "Install Extension"
3. Add to your browser
4. Create or import an account
5. Switch to Hedera Testnet for development

#### **Setup**
```typescript
// HashPack wallet detection
const isHashPackInstalled = () => {
  return typeof window !== 'undefined' && 
         window.hashpack !== undefined;
};

// HashPack connection
const connectHashPack = async () => {
  if (!isHashPackInstalled()) {
    throw new Error('HashPack wallet not installed');
  }
  
  try {
    const connection = await window.hashpack.connect();
    return {
      walletType: 'hashpack',
      accountId: connection.accountId,
      publicKey: connection.publicKey,
      network: connection.network
    };
  } catch (error) {
    throw new Error(`HashPack connection failed: ${error.message}`);
  }
};
```

### **2. MetaMask Wallet** 🟡

**Type**: EVM-compatible wallet
**Best For**: Users familiar with Ethereum ecosystem

#### **Features**
- Wide adoption and familiarity
- EVM compatibility
- Multiple network support
- Hardware wallet integration
- Extensive ecosystem

#### **Installation**
1. Visit [MetaMask.io](https://metamask.io/)
2. Click "Download"
3. Install browser extension
4. Create or import wallet
5. Add Hedera network

#### **Hedera Network Configuration**
```typescript
// Hedera testnet configuration for MetaMask
const hederaTestnet = {
  chainId: '0x128', // 296 in decimal
  chainName: 'Hedera Testnet',
  nativeCurrency: {
    name: 'HBAR',
    symbol: 'HBAR',
    decimals: 18
  },
  rpcUrls: ['https://testnet.hashio.io/api'],
  blockExplorerUrls: ['https://hashscan.io/testnet']
};

// Add network to MetaMask
const addHederaNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [hederaTestnet]
    });
  } catch (error) {
    console.error('Failed to add Hedera network:', error);
  }
};
```

#### **MetaMask Connection**
```typescript
// MetaMask connection
const connectMetaMask = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask wallet not installed');
  }
  
  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    // Get network information
    const chainId = await window.ethereum.request({
      method: 'eth_chainId'
    });
    
    // Verify Hedera network
    if (chainId !== '0x128') {
      throw new Error('Please switch to Hedera network');
    }
    
    return {
      walletType: 'metamask',
      accountId: accounts[0],
      network: 'hedera-testnet'
    };
  } catch (error) {
    throw new Error(`MetaMask connection failed: ${error.message}`);
  }
};
```

### **3. WalletConnect v2** 🔵

**Type**: Universal wallet connector
**Best For**: Mobile wallets, QR code connections

#### **Features**
- Universal wallet support
- Mobile wallet compatibility
- QR code connections
- Cross-platform support
- Extensive wallet ecosystem

#### **Installation**
```bash
npm install @walletconnect/web3-provider @walletconnect/modal
```

#### **Setup**
```typescript
import { WalletConnectModal } from '@walletconnect/modal';

// Initialize WalletConnect
const walletConnectModal = new WalletConnectModal({
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: ['eip155:296'], // Hedera testnet
  enableExplorer: true,
  explorerRecommendedWalletIds: 'ALL',
  explorerExcludedWalletIds: 'NONE'
});

// WalletConnect connection
const connectWalletConnect = async () => {
  try {
    const provider = await walletConnectModal.connect();
    
    // Get account information
    const accounts = await provider.request({
      method: 'eth_accounts'
    });
    
    return {
      walletType: 'walletconnect',
      accountId: accounts[0],
      network: 'hedera-testnet'
    };
  } catch (error) {
    throw new Error(`WalletConnect connection failed: ${error.message}`);
  }
};
```

## 🏗️ Wallet Service Architecture

### **HederaWalletService Class**

```typescript
class HederaWalletService extends EventEmitter {
  private connection: WalletConnection | null = null;
  private walletType: WalletType | null = null;
  
  constructor() {
    super();
    this.loadSavedConnection();
  }
  
  // Connection methods
  async connect(walletType: WalletType): Promise<WalletConnection> {
    let connection: WalletConnection;
    
    switch (walletType) {
      case 'hashpack':
        connection = await this.connectHashPack();
        break;
      case 'metamask':
        connection = await this.connectMetaMask();
        break;
      case 'walletconnect':
        connection = await this.connectWalletConnect();
        break;
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
    
    this.connection = connection;
    this.walletType = walletType;
    
    // Save connection and emit events
    this.saveConnection(connection);
    this.emit('connected', connection);
    
    return connection;
  }
  
  // Disconnect wallet
  disconnect(): void {
    if (this.connection) {
      this.clearSavedConnection();
      this.connection = null;
      this.walletType = null;
      this.emit('disconnected');
    }
  }
  
  // Get wallet balance
  async getBalance(): Promise<number> {
    if (!this.connection) {
      throw new Error('No wallet connected');
    }
    
    switch (this.walletType) {
      case 'hashpack':
        return await this.getHashPackBalance();
      case 'metamask':
        return await this.getMetaMaskBalance();
      case 'walletconnect':
        return await this.getWalletConnectBalance();
      default:
        throw new Error('Unknown wallet type');
    }
  }
  
  // Send transaction
  async sendTransaction(transaction: Transaction): Promise<string> {
    if (!this.connection) {
      throw new Error('No wallet connected');
    }
    
    switch (this.walletType) {
      case 'hashpack':
        return await this.sendHashPackTransaction(transaction);
      case 'metamask':
        return await this.sendMetaMaskTransaction(transaction);
      case 'walletconnect':
        return await this.sendWalletConnectTransaction(transaction);
      default:
        throw new Error('Unknown wallet type');
    }
  }
}
```

### **Wallet Connection Interface**

```typescript
interface WalletConnection {
  walletType: WalletType;
  accountId: string;
  publicKey?: string;
  network: string;
  connectedAt: number;
}

interface Transaction {
  to: string;
  value: string;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
}

type WalletType = 'hashpack' | 'metamask' | 'walletconnect';
```

## 🔄 Connection Flow

### **1. Wallet Detection**

```typescript
// Detect available wallets
const getAvailableWallets = (): WalletType[] => {
  const wallets: WalletType[] = [];
  
  if (isHashPackInstalled()) {
    wallets.push('hashpack');
  }
  
  if (isMetaMaskInstalled()) {
    wallets.push('metamask');
  }
  
  // WalletConnect is always available
  wallets.push('walletconnect');
  
  return wallets;
};

// Check specific wallet installation
const isHashPackInstalled = (): boolean => {
  return typeof window !== 'undefined' && 
         window.hashpack !== undefined;
};

const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && 
         window.ethereum !== undefined &&
         window.ethereum.isMetaMask;
};
```

### **2. Connection Process**

```typescript
// Complete connection flow
const handleWalletConnection = async (walletType: WalletType) => {
  try {
    // Show loading state
    setConnectionStatus('connecting');
    
    // Connect to wallet
    const connection = await hederaWalletService.connect(walletType);
    
    // Update application state
    setUser({
      accountId: connection.accountId,
      walletType: connection.walletType,
      network: connection.network
    });
    
    setConnectionStatus('connected');
    
    // Show success message
    toast.success(`Connected to ${walletType} wallet`);
    
  } catch (error) {
    // Handle connection errors
    setConnectionStatus('disconnected');
    toast.error(`Connection failed: ${error.message}`);
    
    // Log error for debugging
    console.error('Wallet connection error:', error);
  }
};
```

### **3. Connection Persistence**

```typescript
// Save connection to local storage
const saveConnection = (connection: WalletConnection): void => {
  try {
    localStorage.setItem('wallet_connection', JSON.stringify({
      ...connection,
      savedAt: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to save connection:', error);
  }
};

// Load saved connection
const loadSavedConnection = (): WalletConnection | null => {
  try {
    const saved = localStorage.getItem('wallet_connection');
    if (saved) {
      const connection = JSON.parse(saved);
      
      // Check if connection is still valid (e.g., not expired)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - connection.savedAt < maxAge) {
        return connection;
      }
    }
  } catch (error) {
    console.warn('Failed to load saved connection:', error);
  }
  
  return null;
};

// Clear saved connection
const clearSavedConnection = (): void => {
  try {
    localStorage.removeItem('wallet_connection');
  } catch (error) {
    console.warn('Failed to clear saved connection:', error);
  }
};
```

## 🎨 UI Components

### **ConnectWalletButton Component**

```typescript
const ConnectWalletButton: React.FC = () => {
  const { isConnected, connectWallet, disconnectWallet } = useAuth();
  const [showModal, setShowModal] = useState(false);
  
  if (isConnected) {
    return (
      <button
        onClick={disconnectWallet}
        className="btn btn-outline"
      >
        Disconnect Wallet
      </button>
    );
  }
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary"
      >
        Connect Wallet
      </button>
      
      <WalletConnectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConnect={connectWallet}
      />
    </>
  );
};
```

### **WalletConnectionModal Component**

```typescript
const WalletConnectionModal: React.FC<WalletConnectionModalProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const availableWallets = useAuth().getAvailableWallets();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to FundFlow
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {availableWallets.map((walletType) => (
            <WalletOption
              key={walletType}
              walletType={walletType}
              onClick={() => {
                onConnect(walletType);
                onClose();
              }}
            />
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

### **WalletOption Component**

```typescript
const WalletOption: React.FC<WalletOptionProps> = ({
  walletType,
  onClick
}) => {
  const walletInfo = {
    hashpack: {
      name: 'HashPack',
      description: 'Hedera-native wallet with low fees',
      icon: HashPackIcon,
      color: 'bg-green-500'
    },
    metamask: {
      name: 'MetaMask',
      description: 'Popular EVM wallet',
      icon: MetaMaskIcon,
      color: 'bg-orange-500'
    },
    walletconnect: {
      name: 'WalletConnect',
      description: 'Universal wallet connector',
      icon: WalletConnectIcon,
      color: 'bg-blue-500'
    }
  };
  
  const info = walletInfo[walletType];
  
  return (
    <button
      onClick={onClick}
      className="w-full p-4 border rounded-lg hover:bg-gray-50 
                 transition-colors text-left"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full ${info.color} 
                        flex items-center justify-center`}>
          <info.icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            {info.name}
          </h3>
          <p className="text-sm text-gray-500">
            {info.description}
          </p>
        </div>
        
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
};
```

## 🔐 Security Considerations

### **Private Key Protection**
- **Never store private keys** in the frontend
- **Use wallet extensions** for key management
- **Implement secure communication** protocols
- **Validate all transactions** before signing

### **Connection Security**
```typescript
// Validate wallet connection
const validateConnection = (connection: WalletConnection): boolean => {
  // Check required fields
  if (!connection.accountId || !connection.walletType) {
    return false;
  }
  
  // Validate account ID format
  if (connection.walletType === 'hashpack') {
    // Hedera account ID format: 0.0.12345
    const hederaAccountRegex = /^\d+\.\d+\.\d+$/;
    if (!hederaAccountRegex.test(connection.accountId)) {
      return false;
    }
  } else if (connection.walletType === 'metamask') {
    // Ethereum address format: 0x...
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethereumAddressRegex.test(connection.accountId)) {
      return false;
    }
  }
  
  return true;
};
```

### **Transaction Security**
```typescript
// Validate transaction before sending
const validateTransaction = (transaction: Transaction): boolean => {
  // Check required fields
  if (!transaction.to || !transaction.value) {
    return false;
  }
  
  // Validate address format
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!addressRegex.test(transaction.to)) {
    return false;
  }
  
  // Validate value (must be positive)
  const value = BigInt(transaction.value);
  if (value <= 0) {
    return false;
  }
  
  return true;
};
```

## 🧪 Testing Wallet Integration

### **Mock Wallet for Testing**

```typescript
// Mock wallet service for testing
class MockWalletService extends HederaWalletService {
  async connect(walletType: WalletType): Promise<WalletConnection> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockConnection: WalletConnection = {
      walletType,
      accountId: '0.0.12345',
      publicKey: 'mock-public-key',
      network: 'hedera-testnet',
      connectedAt: Date.now()
    };
    
    this.connection = mockConnection;
    this.walletType = walletType;
    
    return mockConnection;
  }
  
  async getBalance(): Promise<number> {
    return 1000; // Mock balance
  }
  
  async sendTransaction(transaction: Transaction): Promise<string> {
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return 'mock-transaction-id';
  }
}
```

### **Test Wallet Components**

```typescript
// Test wallet connection flow
describe('Wallet Integration', () => {
  it('should connect to HashPack wallet', async () => {
    const mockConnect = jest.fn();
    render(<ConnectWalletButton onConnect={mockConnect} />);
    
    // Click connect button
    fireEvent.click(screen.getByText('Connect Wallet'));
    
    // Select HashPack
    fireEvent.click(screen.getByText('HashPack'));
    
    // Verify connection call
    expect(mockConnect).toHaveBeenCalledWith('hashpack');
  });
  
  it('should handle connection errors gracefully', async () => {
    const mockConnect = jest.fn().mockRejectedValue(
      new Error('Connection failed')
    );
    
    render(<ConnectWalletButton onConnect={mockConnect} />);
    
    // Attempt connection
    fireEvent.click(screen.getByText('Connect Wallet'));
    fireEvent.click(screen.getByText('HashPack'));
    
    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText('Connection failed')).toBeInTheDocument();
    });
  });
});
```

## 🚀 Production Deployment

### **Environment Configuration**

```env
# Production environment variables
NEXT_PUBLIC_HEDERA_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your-mainnet-contract-address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-production-project-id
NEXT_PUBLIC_HASHPACK_APP_NAME=FundFlow
NEXT_PUBLIC_METAMASK_CHAIN_ID=295
```

### **Network Configuration**

```typescript
// Network configuration
const NETWORKS = {
  testnet: {
    chainId: 296,
    name: 'Hedera Testnet',
    rpcUrl: 'https://testnet.hashio.io/api',
    explorer: 'https://hashscan.io/testnet'
  },
  mainnet: {
    chainId: 295,
    name: 'Hedera Mainnet',
    rpcUrl: 'https://mainnet.hashio.io/api',
    explorer: 'https://hashscan.io'
  }
};

// Get current network
const getCurrentNetwork = () => {
  const networkName = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
  return NETWORKS[networkName];
};
```

### **Error Monitoring**

```typescript
// Error tracking for wallet issues
const trackWalletError = (error: Error, context: string) => {
  // Send to error monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Production error tracking
    console.error('Wallet error:', { error, context });
    
    // Send to monitoring service
    // analytics.track('wallet_error', { error: error.message, context });
  } else {
    // Development logging
    console.error('Wallet error:', error);
  }
};
```

## 📚 Additional Resources

### **Documentation**
- [HashPack Developer Docs](https://docs.hashpack.app/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [WalletConnect v2 Docs](https://docs.walletconnect.com/)
- [Hedera Developer Portal](https://docs.hedera.com/)

### **Community Support**
- [FundFlow Discord](https://discord.gg/fundflow)
- [HashPack Discord](https://discord.gg/hashpack)
- [MetaMask Community](https://community.metamask.io/)
- [WalletConnect Community](https://discord.gg/walletconnect)

---

**FundFlow Wallet Integration** provides seamless, secure, and user-friendly wallet connectivity for the future of startup fundraising. 🚀

