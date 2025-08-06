import { ethers } from 'ethers';

// Contract configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const HEDERA_NETWORK = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';

// Contract ABI (simplified for the main functions we need)
const FUNDFLOW_ABI = [
  // Campaign Management
  "function createCampaign(string memory _title, string memory _description, uint256 _targetAmount, uint256 _durationDays) external returns (uint256)",
  "function investInCampaign(uint256 _campaignId) external payable",
  
  // Milestone Management
  "function addMilestone(uint256 _campaignId, string memory _title, string memory _description, uint256 _targetAmount, uint256 _votingDurationDays) external returns (uint256)",
  "function voteOnMilestone(uint256 _campaignId, uint256 _milestoneId, bool _voteFor) external",
  "function releaseMilestoneFunds(uint256 _campaignId, uint256 _milestoneId) external",
  
  // View Functions
  "function getCampaign(uint256 _campaignId) external view returns (address creator, string memory title, string memory description, uint256 targetAmount, uint256 raisedAmount, uint256 deadline, bool isActive, uint256 milestoneCount, uint256 totalInvestors)",
  "function getMilestone(uint256 _campaignId, uint256 _milestoneId) external view returns (string memory title, string memory description, uint256 targetAmount, bool isCompleted, uint256 votesFor, uint256 votesAgainst, uint256 votingDeadline)",
  "function getInvestment(uint256 _campaignId, address _investor) external view returns (uint256)",
  "function calculatePlatformFee(uint256 _amount) external view returns (uint256)",
  "function platformFeePercent() external view returns (uint256)",
  "function getNextCampaignId() external view returns (uint256)",
  "function getCampaignInvestors(uint256 _campaignId) external view returns (address[])",
  
  // Admin Functions
  "function setPlatformFeePercent(uint256 _newFeePercent) external",
  "function withdrawPlatformFees(address payable _recipient) external",
  
  // Events
  "event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 targetAmount, uint256 deadline)",
  "event InvestmentMade(uint256 indexed campaignId, address indexed investor, uint256 amount, uint256 netAmount)",
  "event MilestoneAdded(uint256 indexed campaignId, uint256 indexed milestoneId, string title, uint256 targetAmount, uint256 votingDeadline)",
  "event MilestoneVoted(uint256 indexed campaignId, uint256 indexed milestoneId, address indexed voter, bool vote, uint256 votingPower)",
  "event MilestoneFundsReleased(uint256 indexed campaignId, uint256 indexed milestoneId, address indexed recipient, uint256 amount)"
];

// Types
export interface CampaignData {
  title: string;
  description: string;
  targetAmount: number;
  durationDays: number;
}

export interface MilestoneData {
  campaignId: number;
  title: string;
  description: string;
  targetAmount: number;
  votingDurationDays: number;
}

export interface InvestmentData {
  campaignId: number;
  amount: number;
}

export interface CampaignInfo {
  creator: string;
  title: string;
  description: string;
  targetAmount: string;
  raisedAmount: string;
  deadline: string;
  isActive: boolean;
  milestoneCount: string;
  totalInvestors: string;
}

export interface MilestoneInfo {
  title: string;
  description: string;
  targetAmount: string;
  isCompleted: boolean;
  votesFor: string;
  votesAgainst: string;
  votingDeadline: string;
}

// Provider setup
const getProvider = () => {
  const rpcUrl = HEDERA_NETWORK === 'mainnet' 
    ? 'https://mainnet.hashio.io/api'
    : 'https://testnet.hashio.io/api';
  
  return new ethers.JsonRpcProvider(rpcUrl);
};

export class FundFlowTransactions {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private signer: ethers.Signer | null;

  constructor(signer?: ethers.Signer) {
    this.provider = getProvider();
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, FUNDFLOW_ABI, this.provider);
    this.signer = signer || null;
    
    if (this.signer) {
      this.contract = this.contract.connect(this.signer);
    }
  }

  // Set signer (for wallet connection)
  setSigner(signer: ethers.Signer) {
    this.signer = signer;
    this.contract = this.contract.connect(signer);
  }

  // Campaign Management
  async createCampaign(campaignData: CampaignData): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    // Convert HBAR to wei (1 HBAR = 10^18 wei, like ETH)
    const targetAmountWei = ethers.parseEther(campaignData.targetAmount.toString());

    const tx = await this.contract.createCampaign(
      campaignData.title,
      campaignData.description,
      targetAmountWei,
      campaignData.durationDays
    );

    const receipt = await tx.wait();
    return receipt.hash;
  }

  async investInCampaign(investmentData: InvestmentData): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    // Convert HBAR to wei
    const amountWei = ethers.parseEther(investmentData.amount.toString());

    const tx = await this.contract.investInCampaign(investmentData.campaignId, {
      value: amountWei
    });

    const receipt = await tx.wait();
    return receipt.hash;
  }

  // Milestone Management
  async addMilestone(milestoneData: MilestoneData): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    // Convert HBAR to wei
    const targetAmountWei = ethers.parseEther(milestoneData.targetAmount.toString());

    const tx = await this.contract.addMilestone(
      milestoneData.campaignId,
      milestoneData.title,
      milestoneData.description,
      targetAmountWei,
      milestoneData.votingDurationDays
    );

    const receipt = await tx.wait();
    return receipt.hash;
  }

  async voteOnMilestone(campaignId: number, milestoneId: number, voteFor: boolean): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const tx = await this.contract.voteOnMilestone(campaignId, milestoneId, voteFor);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  async releaseMilestoneFunds(campaignId: number, milestoneId: number): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const tx = await this.contract.releaseMilestoneFunds(campaignId, milestoneId);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  // Read-only functions
  async getCampaign(campaignId: number): Promise<CampaignInfo> {
    try {
      const result = await this.contract.getCampaign(campaignId);
      return {
        creator: result[0],
        title: result[1],
        description: result[2],
        targetAmount: ethers.formatEther(result[3]),
        raisedAmount: ethers.formatEther(result[4]),
        deadline: result[5].toString(),
        isActive: result[6],
        milestoneCount: result[7].toString(),
        totalInvestors: result[8].toString()
      };
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  async getMilestone(campaignId: number, milestoneId: number): Promise<MilestoneInfo> {
    try {
      const result = await this.contract.getMilestone(campaignId, milestoneId);
      return {
        title: result[0],
        description: result[1],
        targetAmount: ethers.formatEther(result[2]),
        isCompleted: result[3],
        votesFor: ethers.formatEther(result[4]),
        votesAgainst: ethers.formatEther(result[5]),
        votingDeadline: result[6].toString()
      };
    } catch (error) {
      console.error('Error fetching milestone:', error);
      throw error;
    }
  }

  async getInvestment(campaignId: number, investorAddress: string): Promise<string> {
    try {
      const result = await this.contract.getInvestment(campaignId, investorAddress);
      return ethers.formatEther(result);
    } catch (error) {
      console.error('Error fetching investment:', error);
      throw error;
    }
  }

  async getPlatformFeePercent(): Promise<number> {
    try {
      const result = await this.contract.platformFeePercent();
      return parseInt(result.toString());
    } catch (error) {
      console.error('Error fetching platform fee:', error);
      throw error;
    }
  }

  async calculatePlatformFee(amount: number): Promise<string> {
    try {
      const amountWei = ethers.parseEther(amount.toString());
      const result = await this.contract.calculatePlatformFee(amountWei);
      return ethers.formatEther(result);
    } catch (error) {
      console.error('Error calculating platform fee:', error);
      throw error;
    }
  }

  async getNextCampaignId(): Promise<number> {
    try {
      const result = await this.contract.getNextCampaignId();
      return parseInt(result.toString());
    } catch (error) {
      console.error('Error fetching next campaign ID:', error);
      throw error;
    }
  }

  async getCampaignInvestors(campaignId: number): Promise<string[]> {
    try {
      const result = await this.contract.getCampaignInvestors(campaignId);
      return result;
    } catch (error) {
      console.error('Error fetching campaign investors:', error);
      throw error;
    }
  }

  // Event listening
  async listenForCampaignCreated(callback: (event: any) => void) {
    this.contract.on('CampaignCreated', callback);
  }

  async listenForInvestment(callback: (event: any) => void) {
    this.contract.on('InvestmentMade', callback);
  }

  async listenForMilestoneVoted(callback: (event: any) => void) {
    this.contract.on('MilestoneVoted', callback);
  }

  // Stop listening to events
  removeAllListeners() {
    this.contract.removeAllListeners();
  }

  // Utility functions
  async estimateGas(method: string, params: any[]): Promise<bigint> {
    try {
      const gasEstimate = await this.contract[method].estimateGas(...params);
      return gasEstimate;
    } catch (error) {
      console.error('Error estimating gas:', error);
      return BigInt(300000); // Default gas limit
    }
  }

  async getTransactionFee(): Promise<number> {
    try {
      const gasPrice = await this.provider.getFeeData();
      const gasLimit = BigInt(300000); // Estimated gas limit
      const totalFee = gasLimit * (gasPrice.gasPrice || BigInt(0));
      return parseFloat(ethers.formatEther(totalFee));
    } catch (error) {
      console.error('Error calculating transaction fee:', error);
      return 0.001; // Default fee in HBAR
    }
  }

  // Contract address and network info
  getContractAddress(): string {
    return CONTRACT_ADDRESS;
  }

  getNetworkName(): string {
    return HEDERA_NETWORK;
  }

  // Get provider for external use
  getProvider(): ethers.JsonRpcProvider {
    return this.provider;
  }
}

// Utility function to create transaction instance
export const createFundFlowTransactions = (signer?: ethers.Signer): FundFlowTransactions => {
  return new FundFlowTransactions(signer);
};