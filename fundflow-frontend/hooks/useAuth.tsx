"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  hederaWalletService, 
  WalletType, 
  WalletConnection 
} from '../lib/hedera-wallet-service';

export type UserRole = 'investor' | 'startup' | null;

export interface User {
  walletAddress: string;
  accountId: string;
  walletType: WalletType;
  balance: string;
  role: UserRole;
  profile: {
    name?: string;
    email?: string;
    isAccredited?: boolean; // For investors
    companyName?: string; // For startups
    industry?: string; // For startups
  };
}

interface AuthContextType {
  user: User | null;
  isConnected: boolean;
  isLoading: boolean;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  setUserRole: (role: UserRole) => void;
  updateProfile: (profile: Partial<User['profile']>) => void;
  updateBalance: () => Promise<void>;
  getAvailableWallets: () => WalletType[];
  connection: WalletConnection | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connection, setConnection] = useState<WalletConnection | null>(null);

  // Initialize wallet listeners on mount
  useEffect(() => {
    initializeWalletListeners();
    checkExistingSession();
  }, []);

  const initializeWalletListeners = () => {
    // Listen for wallet events
    hederaWalletService.on('connected', (connection: WalletConnection) => {
      setConnection(connection);
      setIsConnected(true);
      
      // Check if there's an existing user profile
      const existingUser = localStorage.getItem(`user_${connection.accountId}`);
      if (existingUser) {
        const userProfile = JSON.parse(existingUser);
        setUser(userProfile);
      } else {
        // Create new user
        const newUser: User = {
          walletAddress: connection.address,
          accountId: connection.accountId,
          walletType: connection.type,
          balance: connection.balance || '0',
          role: null,
          profile: {}
        };
        setUser(newUser);
      }
    });

    hederaWalletService.on('disconnected', () => {
      setConnection(null);
      setIsConnected(false);
      setUser(null);
    });

    hederaWalletService.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setConnection(null);
        setIsConnected(false);
        setUser(null);
      } else {
        // Account changed, update the connection
        const currentConnection = hederaWalletService.getConnection();
        if (currentConnection) {
          setConnection(currentConnection);
          // Update user with new account info
          if (user) {
            const updatedUser = {
              ...user,
              walletAddress: currentConnection.address,
              accountId: currentConnection.accountId,
              balance: currentConnection.balance || '0'
            };
            setUser(updatedUser);
            localStorage.setItem(`user_${currentConnection.accountId}`, JSON.stringify(updatedUser));
          }
        }
      }
    });
  };

  const checkExistingSession = async () => {
    setIsLoading(true);
    try {
      // Check if there's an existing wallet connection
      const walletConnection = hederaWalletService.getConnection();
      if (walletConnection && hederaWalletService.isConnected()) {
        setConnection(walletConnection);
        setIsConnected(true);
        
        // Check if there's an existing user profile
        const existingUser = localStorage.getItem(`user_${walletConnection.accountId}`);
        if (existingUser) {
          const userProfile = JSON.parse(existingUser);
          setUser(userProfile);
        } else {
          // Create new user
          const newUser: User = {
            walletAddress: walletConnection.address,
            accountId: walletConnection.accountId,
            walletType: walletConnection.type,
            balance: walletConnection.balance || '0',
            role: null,
            profile: {}
          };
          setUser(newUser);
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (walletType: WalletType) => {
    setIsLoading(true);
    try {
      const walletConnection = await hederaWalletService.connect(walletType);
      setConnection(walletConnection);
      
      // Get balance
      let balance = walletConnection.balance || '0';
      try {
        balance = await hederaWalletService.getBalance();
      } catch (error) {
        console.warn('Could not fetch balance:', error);
      }
      
      // Check if user exists in our system
      const existingUser = localStorage.getItem(`user_${walletConnection.accountId}`);
      
      if (existingUser) {
        // Existing user - load their role and profile
        const userProfile = JSON.parse(existingUser);
        const updatedUser = {
          ...userProfile,
          walletAddress: walletConnection.address,
          accountId: walletConnection.accountId,
          walletType: walletConnection.type,
          balance
        };
        setUser(updatedUser);
        localStorage.setItem(`user_${walletConnection.accountId}`, JSON.stringify(updatedUser));
      } else {
        // New user - create profile
        const newUser: User = {
          walletAddress: walletConnection.address,
          accountId: walletConnection.accountId,
          walletType: walletConnection.type,
          balance,
          role: null,
          profile: {}
        };
        setUser(newUser);
        localStorage.setItem(`user_${walletConnection.accountId}`, JSON.stringify(newUser));
      }
      
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await hederaWalletService.disconnect();
      setConnection(null);
      setIsConnected(false);
      setUser(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const updateBalance = async () => {
    if (!isConnected || !user) return;
    
    try {
      const balance = await hederaWalletService.getBalance();
      const updatedUser = { ...user, balance };
      setUser(updatedUser);
      localStorage.setItem(`user_${user.accountId}`, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  };

  const getAvailableWallets = (): WalletType[] => {
    return hederaWalletService.getAvailableWallets();
  };

  const setUserRole = async (role: UserRole) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem(`user_${user.accountId}`, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to set user role:', error);
    }
  };

  const updateProfile = async (profileUpdate: Partial<User['profile']>) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        profile: { ...user.profile, ...profileUpdate }
      };
      setUser(updatedUser);
      localStorage.setItem(`user_${user.accountId}`, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    setUserRole,
    updateProfile,
    updateBalance,
    getAvailableWallets,
    connection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}