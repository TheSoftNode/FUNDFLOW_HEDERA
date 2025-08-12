# 🚀 Wallet Connection Setup Guide

## 📋 **Current Status**
✅ **Working**: Mock connections for development  
🔄 **In Progress**: Real wallet integrations  
🎯 **Goal**: Full Hedera wallet integration

---

## 🔧 **WalletConnect Project ID Setup**

### **Step 1: Get WalletConnect Project ID**
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up/Login with your account
3. Create a new project
4. Copy your **Project ID** (looks like: `1234567890abcdef1234567890abcdef`)

### **Step 2: Update Environment Variables**
```bash
# In .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

---

## 🦊 **MetaMask Setup**

### **Current Issue**
MetaMask is detected but connection fails due to:
- Network configuration issues
- Popup blocking
- Chain ID mismatches

### **Solution**
1. **Install MetaMask Extension**
2. **Add Hedera Network**:
   - Open MetaMask
   - Go to Settings → Networks → Add Network
   - **Network Name**: Hedera Testnet
   - **RPC URL**: `https://testnet.hashio.io/api`
   - **Chain ID**: `296`
   - **Currency Symbol**: `HBAR`
   - **Block Explorer**: `https://hashscan.io/testnet`

### **Test MetaMask**
1. Visit `/wallet-test`
2. Click "Test MetaMask Detection"
3. Click "Connect to metamask"

---

## 🔗 **HashPack Setup**

### **Current Status**
HashPack is not detected because:
- HashPack extension not installed
- No HashPack SDK integration

### **Solution**
1. **Install HashPack Extension**:
   - Visit [HashPack.app](https://hashpack.app)
   - Install browser extension
   - Create/Import wallet

2. **HashPack SDK Integration** (Future):
   ```bash
   npm install @hashpack/connect
   ```

### **Test HashPack**
1. Install HashPack extension
2. Visit `/wallet-test`
3. Click "Test HashPack Detection"
4. Click "Connect to hashpack"

---

## 🔌 **WalletConnect v2 Setup**

### **Current Status**
Using mock connections for development

### **Real Implementation** (Future)
```typescript
import { EthereumProvider } from '@walletconnect/ethereum-provider';

const provider = await EthereumProvider.init({
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: [296], // Hedera testnet
  showQrModal: true,
});
```

---

## 🧪 **Testing Your Setup**

### **1. Development Testing**
```bash
# Start the development server
npm run dev

# Visit test pages
http://localhost:3001/wallet-test
http://localhost:3001/wallet-demo
```

### **2. Check Console Logs**
Open browser dev tools to see:
- Available wallet detection
- Connection attempts
- Error messages
- Debug information

### **3. Test Each Wallet**
1. **MetaMask**: Should connect with mock data
2. **WalletConnect**: Should connect with mock data
3. **HashPack**: Will work once extension is installed

---

## 🎯 **Next Steps for Production**

### **1. Get Real WalletConnect Project ID**
- Follow Step 1 above
- Update `.env.local`

### **2. Deploy FundFlow Smart Contract**
- Deploy to Hedera testnet
- Update contract address in environment

### **3. Implement Real Connections**
- Replace mock connections with real wallet SDKs
- Test with real HBAR transactions

### **4. Add HashPack SDK**
- Install HashPack SDK
- Implement real HashPack integration

---

## 🔍 **Troubleshooting**

### **MetaMask Issues**
- **Error**: "Unexpected error"
  - **Solution**: Use mock connection for development
- **Error**: "Network not found"
  - **Solution**: Add Hedera network to MetaMask

### **HashPack Issues**
- **Error**: "HashPack not detected"
  - **Solution**: Install HashPack browser extension

### **WalletConnect Issues**
- **Error**: "Project ID not found"
  - **Solution**: Get real project ID from WalletConnect Cloud

---

## 📊 **Current Test Results**

| Wallet | Detection | Connection | Status |
|--------|-----------|------------|---------|
| MetaMask | ✅ Yes | 🔄 Mock | Working |
| WalletConnect | ✅ Yes | 🔄 Mock | Working |
| HashPack | ❌ No | ❌ No | Needs Extension |

---

## 🚀 **Ready to Test**

Visit: `http://localhost:3001/wallet-test`

The mock connections are working for development. Once you get the real WalletConnect project ID and install HashPack, you'll have full wallet integration! 🎉 