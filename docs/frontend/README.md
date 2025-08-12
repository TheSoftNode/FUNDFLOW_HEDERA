# FundFlow Frontend Development Guide

## 🎯 Overview

FundFlow's frontend is built with **Next.js 15**, **React 19**, and **TypeScript**, providing a modern, responsive, and user-friendly interface for the decentralized fundraising platform. The frontend integrates seamlessly with Hedera Hashgraph and supports multiple wallet connections.

## 🏗️ Architecture Overview

### **Technology Stack**
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with Framer Motion
- **Components**: Shadcn/ui and Radix UI primitives
- **State Management**: React hooks and Context API
- **Blockchain**: Hedera SDK and Ethers.js
- **Wallets**: HashPack, MetaMask, WalletConnect v2

### **Project Structure**
```
fundflow-frontend/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   ├── campaigns/         # Campaign pages
│   ├── wallet-demo/       # Wallet testing page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── shared/            # Shared UI components
│   ├── wallet/            # Wallet integration
│   └── ui/                # Shadcn/ui components
├── lib/                   # Utilities and services
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🔧 Development Setup

### **Prerequisites**
- Node.js 18.0 or higher
- npm 8.0 or higher
- Git for version control

### **Installation**
```bash
# Clone the repository
git clone https://github.com/yourusername/fundflow.git
cd fundflow/fundflow-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### **Environment Configuration**
```env
# Hedera Network
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your-contract-address

# Wallet Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
NEXT_PUBLIC_HASHPACK_APP_NAME=FundFlow
NEXT_PUBLIC_METAMASK_CHAIN_ID=296

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🎨 Component Architecture

### **Component Hierarchy**
```
App
├── RootLayout
│   ├── ThemeProvider
│   ├── AuthProvider
│   └── Navbar
├── Page Components
│   ├── Landing Page
│   ├── Dashboard
│   └── Campaign Pages
└── Shared Components
    ├── UI Components
    ├── Wallet Components
    └── Layout Components
```

### **Component Categories**

#### **1. Page Components**
- **Landing Page**: Hero section, features, call-to-action
- **Dashboard**: User-specific dashboards for startups and investors
- **Campaign Pages**: Campaign creation, browsing, and management
- **Wallet Demo**: Testing and demonstration pages

#### **2. Dashboard Components**
- **StartupDashboard**: Campaign management, analytics, investor tracking
- **InvestorDashboard**: Portfolio management, investment tracking
- **DashboardRouter**: Role-based routing and navigation
- **DashboardNavbar**: Dashboard-specific navigation

#### **3. Shared Components**
- **Logo**: Brand identity components
- **ThemeToggle**: Light/dark mode switching
- **Button**: Reusable button components
- **Modal**: Dialog and overlay components

#### **4. Wallet Components**
- **ConnectWalletButton**: Wallet connection interface
- **WalletConnectionModal**: Detailed wallet selection
- **WalletDemo**: Interactive wallet testing

## 🔗 Wallet Integration

### **Supported Wallets**

#### **1. HashPack Wallet**
- **Type**: Hedera-native wallet
- **Features**: Direct Hedera integration, low fees
- **Installation**: Browser extension from [HashPack.io](https://hashpack.app/)

#### **2. MetaMask Wallet**
- **Type**: EVM-compatible wallet
- **Features**: Wide adoption, familiar interface
- **Installation**: Browser extension from [MetaMask.io](https://metamask.io/)

#### **3. WalletConnect v2**
- **Type**: Universal wallet connector
- **Features**: Mobile wallet support, QR code connection
- **Installation**: npm package integration

### **Wallet Service Architecture**
```typescript
class HederaWalletService {
  // Connection methods
  connectHashPack(): Promise<WalletConnection>
  connectMetaMask(): Promise<WalletConnection>
  connectWalletConnect(): Promise<WalletConnection>
  
  // Transaction methods
  sendTransaction(transaction: Transaction): Promise<string>
  signMessage(message: string): Promise<string>
  
  // Utility methods
  getBalance(): Promise<number>
  getNetworkInfo(): Promise<NetworkInfo>
  disconnect(): void
}
```

### **Wallet Connection Flow**
1. **User Selection**: User chooses wallet type
2. **Connection Request**: Frontend requests wallet connection
3. **Wallet Approval**: User approves in wallet interface
4. **Account Retrieval**: Frontend receives account information
5. **State Update**: Authentication state updated
6. **Event Emission**: Connection events emitted for UI updates

## 🎭 State Management

### **Authentication Context**
```typescript
interface AuthContextType {
  user: User | null;
  isConnected: boolean;
  walletType: WalletType | null;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  getAvailableWallets: () => WalletType[];
}
```

### **State Persistence**
- **Local Storage**: User preferences and session data
- **Session Storage**: Temporary session information
- **Context API**: React state management
- **Event System**: Cross-component communication

### **State Updates**
```typescript
// Wallet connection
const handleWalletConnection = async (walletType: WalletType) => {
  try {
    const connection = await hederaWalletService.connect(walletType);
    setUser(connection.user);
    setIsConnected(true);
    setWalletType(walletType);
    
    // Persist connection
    localStorage.setItem('wallet_connection', JSON.stringify(connection));
  } catch (error) {
    console.error('Wallet connection failed:', error);
  }
};
```

## 🎨 UI/UX Design System

### **Design Principles**
- **Modern & Clean**: Minimalist design with clear hierarchy
- **Responsive**: Mobile-first approach with progressive enhancement
- **Accessible**: WCAG 2.1 AA compliance
- **Consistent**: Unified design language across components

### **Color Palette**
```css
/* Primary Colors */
--primary: #3B82F6;
--primary-dark: #1D4ED8;
--primary-light: #93C5FD;

/* Secondary Colors */
--secondary: #10B981;
--secondary-dark: #059669;
--secondary-light: #6EE7B7;

/* Neutral Colors */
--background: #FFFFFF;
--foreground: #1F2937;
--muted: #6B7280;
--border: #E5E7EB;
```

### **Typography**
```css
/* Font Families */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
```

### **Component Variants**
```typescript
// Button variants
const buttonVariants = {
  default: "bg-primary text-white hover:bg-primary-dark",
  secondary: "bg-secondary text-white hover:bg-secondary-dark",
  outline: "border border-border text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted"
};
```

## 📱 Responsive Design

### **Breakpoint System**
```css
/* Tailwind CSS breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* 2X large devices */
```

### **Mobile-First Approach**
```typescript
// Responsive component example
const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="flex h-screen">
      {/* Sidebar - hidden on mobile, collapsible on desktop */}
      <aside className={`
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
        hidden md:block transition-all duration-300
        bg-background border-r border-border
      `}>
        <SidebarContent collapsed={sidebarCollapsed} />
      </aside>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <DashboardContent />
      </main>
    </div>
  );
};
```

## 🧪 Testing Strategy

### **Testing Tools**
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing
- **MSW**: API mocking

### **Test Structure**
```typescript
// Component test example
describe('ConnectWalletButton', () => {
  it('should display available wallets', () => {
    render(<ConnectWalletButton />);
    
    expect(screen.getByText('HashPack')).toBeInTheDocument();
    expect(screen.getByText('MetaMask')).toBeInTheDocument();
    expect(screen.getByText('WalletConnect')).toBeInTheDocument();
  });
  
  it('should connect to selected wallet', async () => {
    const mockConnect = jest.fn();
    render(<ConnectWalletButton onConnect={mockConnect} />);
    
    fireEvent.click(screen.getByText('HashPack'));
    
    expect(mockConnect).toHaveBeenCalledWith('hashpack');
  });
});
```

### **Testing Commands**
```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e
```

## 🚀 Performance Optimization

### **Code Splitting**
```typescript
// Dynamic imports for code splitting
const WalletDemo = dynamic(() => import('./WalletDemo'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

const Dashboard = dynamic(() => import('./Dashboard'), {
  loading: () => <div>Loading...</div>
});
```

### **Image Optimization**
```typescript
// Next.js Image component for optimization
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="FundFlow Logo"
  width={200}
  height={60}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### **Bundle Analysis**
```bash
# Analyze bundle size
npm run build
npm run analyze

# Generate bundle report
npm run bundle-report
```

## 🔒 Security Considerations

### **Frontend Security**
- **Input Validation**: Client-side validation with server-side verification
- **XSS Protection**: Sanitized user input and output
- **CSRF Protection**: Token-based request validation
- **Content Security Policy**: Restricted resource loading

### **Wallet Security**
- **Secure Communication**: HTTPS-only connections
- **Private Key Protection**: Never stored in frontend
- **Transaction Verification**: User confirmation for all transactions
- **Error Handling**: Secure error messages without information leakage

## 📊 Analytics & Monitoring

### **User Analytics**
- **Page Views**: Navigation and user journey tracking
- **User Actions**: Button clicks and form submissions
- **Performance Metrics**: Page load times and errors
- **Conversion Tracking**: User goal completion rates

### **Error Monitoring**
```typescript
// Error boundary for React components
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    logError(error, errorInfo);
    
    // Update UI to show error state
    this.setState({ hasError: true });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

## 🔄 Development Workflow

### **Git Workflow**
1. **Feature Branch**: Create feature branch from main
2. **Development**: Implement feature with tests
3. **Code Review**: Submit pull request for review
4. **Testing**: Ensure all tests pass
5. **Merge**: Merge to main after approval

### **Code Quality**
```bash
# Lint code
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### **Pre-commit Hooks**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 📚 Additional Resources

### **Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### **Community**
- [FundFlow Discord](https://discord.gg/fundflow)
- [Next.js Discord](https://discord.gg/nextjs)
- [React Community](https://reactjs.org/community/support.html)

---

**FundFlow Frontend** provides a modern, responsive, and user-friendly interface for the future of startup fundraising. 🚀

