"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { createFundFlowTransactions, CampaignData, MilestoneData, InvestmentData } from '@/lib/stacks-transactions';
import { stacksApi } from '@/lib/stacks-api';

export interface Campaign {
  id: number;
  creator: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  deadline: number;
  isActive: boolean;
  milestoneCount: number;
  createdAt?: number;
  progress?: number;
  daysLeft?: number;
}

export interface Milestone {
  id: number;
  campaignId: number;
  title: string;
  description: string;
  targetAmount: number;
  isCompleted: boolean;
  votesFor: number;
  votesAgainst: number;
  votingDeadline: number;
}

export interface Investment {
  campaignId: number;
  investor: string;
  amount: number;
  timestamp: number;
}

interface UseCampaignsReturn {
  campaigns: Campaign[];
  userCampaigns: Campaign[];
  userInvestments: Investment[];
  loading: boolean;
  error: string | null;
  
  // Campaign actions
  createCampaign: (data: CampaignData) => Promise<string>;
  investInCampaign: (data: InvestmentData) => Promise<string>;
  getCampaign: (id: number) => Promise<Campaign | null>;
  
  // Milestone actions
  addMilestone: (data: MilestoneData) => Promise<string>;
  voteOnMilestone: (campaignId: number, milestoneId: number, voteFor: boolean) => Promise<string>;
  releaseMilestoneFunds: (campaignId: number, milestoneId: number) => Promise<string>;
  getMilestone: (campaignId: number, milestoneId: number) => Promise<Milestone | null>;
  
  // Utility functions
  refreshCampaigns: () => Promise<void>;
  calculatePlatformFee: (amount: number) => Promise<number>;
  clearError: () => void;
}

export const useCampaigns = (): UseCampaignsReturn => {
  const { user, userSession, network } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userCampaigns, setUserCampaigns] = useState<Campaign[]>([]);
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize transaction handler
  const txHandler = createFundFlowTransactions(userSession);

  // Fetch all campaigns (mock data for now, will be replaced with actual contract calls)
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual contract calls
      const mockCampaigns: Campaign[] = [
        {
          id: 1,
          creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          title: 'EcoTech Sustainable Energy Platform',
          description: 'Revolutionary renewable energy management system for smart cities',
          targetAmount: 100000,
          raisedAmount: 45000,
          deadline: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
          isActive: true,
          milestoneCount: 3,
          progress: 45,
          daysLeft: 30
        },
        {
          id: 2,
          creator: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
          title: 'MedTech AI Diagnostics',
          description: 'AI-powered medical diagnostic tools for early disease detection',
          targetAmount: 250000,
          raisedAmount: 125000,
          deadline: Date.now() + (45 * 24 * 60 * 60 * 1000), // 45 days from now
          isActive: true,
          milestoneCount: 4,
          progress: 50,
          daysLeft: 45
        }
      ];
      
      setCampaigns(mockCampaigns);
      
      // Filter user campaigns if user is connected
      if (user?.walletAddress) {
        const userCreatedCampaigns = mockCampaigns.filter(
          campaign => campaign.creator === user.walletAddress
        );
        setUserCampaigns(userCreatedCampaigns);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, [user?.walletAddress]);

  // Fetch user investments
  const fetchUserInvestments = useCallback(async () => {
    if (!user?.walletAddress) return;
    
    try {
      // Mock data - replace with actual contract calls
      const mockInvestments: Investment[] = [
        {
          campaignId: 1,
          investor: user.walletAddress,
          amount: 5000,
          timestamp: Date.now() - (7 * 24 * 60 * 60 * 1000) // 7 days ago
        }
      ];
      
      setUserInvestments(mockInvestments);
    } catch (err) {
      console.error('Error fetching user investments:', err);
    }
  }, [user?.walletAddress]);

  // Load data on mount and when user changes
  useEffect(() => {
    fetchCampaigns();
    fetchUserInvestments();
  }, [fetchCampaigns, fetchUserInvestments]);

  // Campaign actions
  const createCampaign = async (data: CampaignData): Promise<string> => {
    if (!user?.walletAddress) {
      throw new Error('User not connected');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const txId = await txHandler.createCampaign(data);
      
      // Refresh campaigns after creation
      await fetchCampaigns();
      
      return txId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const investInCampaign = async (data: InvestmentData): Promise<string> => {
    if (!user?.walletAddress) {
      throw new Error('User not connected');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const txId = await txHandler.investInCampaign(data);
      
      // Refresh campaigns and investments after investment
      await Promise.all([fetchCampaigns(), fetchUserInvestments()]);
      
      return txId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to invest in campaign';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCampaign = async (id: number): Promise<Campaign | null> => {
    try {
      const result = await txHandler.getCampaign(id);
      
      if (result && result.value) {
        // Parse contract response and convert to Campaign object
        // This would need to be adapted based on the actual contract response format
        return {
          id,
          creator: result.value.creator.value,
          title: result.value.title.value,
          description: result.value.description.value,
          targetAmount: parseInt(result.value['target-amount'].value) / 1000000, // Convert from microSTX
          raisedAmount: parseInt(result.value['raised-amount'].value) / 1000000,
          deadline: parseInt(result.value.deadline.value),
          isActive: result.value['is-active'].value,
          milestoneCount: parseInt(result.value['milestone-count'].value),
        };
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching campaign:', err);
      return null;
    }
  };

  // Milestone actions
  const addMilestone = async (data: MilestoneData): Promise<string> => {
    if (!user?.walletAddress) {
      throw new Error('User not connected');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const txId = await txHandler.addMilestone(data);
      return txId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add milestone';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const voteOnMilestone = async (campaignId: number, milestoneId: number, voteFor: boolean): Promise<string> => {
    if (!user?.walletAddress) {
      throw new Error('User not connected');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const txId = await txHandler.voteOnMilestone(campaignId, milestoneId, voteFor);
      return txId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to vote on milestone';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const releaseMilestoneFunds = async (campaignId: number, milestoneId: number): Promise<string> => {
    if (!user?.walletAddress) {
      throw new Error('User not connected');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const txId = await txHandler.releaseMilestoneFunds(campaignId, milestoneId);
      return txId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to release milestone funds';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMilestone = async (campaignId: number, milestoneId: number): Promise<Milestone | null> => {
    try {
      const result = await txHandler.getMilestone(campaignId, milestoneId);
      
      if (result && result.value) {
        // Parse contract response and convert to Milestone object
        return {
          id: milestoneId,
          campaignId,
          title: result.value.title.value,
          description: result.value.description.value,
          targetAmount: parseInt(result.value['target-amount'].value) / 1000000,
          isCompleted: result.value['is-completed'].value,
          votesFor: parseInt(result.value['votes-for'].value),
          votesAgainst: parseInt(result.value['votes-against'].value),
          votingDeadline: parseInt(result.value['voting-deadline'].value),
        };
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching milestone:', err);
      return null;
    }
  };

  // Utility functions
  const refreshCampaigns = async (): Promise<void> => {
    await fetchCampaigns();
    await fetchUserInvestments();
  };

  const calculatePlatformFee = async (amount: number): Promise<number> => {
    try {
      const result = await txHandler.calculatePlatformFee(amount);
      if (result && result.value) {
        return parseInt(result.value) / 1000000; // Convert from microSTX
      }
      return 0;
    } catch (err) {
      console.error('Error calculating platform fee:', err);
      // Fallback to 2.5% calculation
      return amount * 0.025;
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    campaigns,
    userCampaigns,
    userInvestments,
    loading,
    error,
    
    // Campaign actions
    createCampaign,
    investInCampaign,
    getCampaign,
    
    // Milestone actions
    addMilestone,
    voteOnMilestone,
    releaseMilestoneFunds,
    getMilestone,
    
    // Utility functions
    refreshCampaigns,
    calculatePlatformFee,
    clearError,
  };
};