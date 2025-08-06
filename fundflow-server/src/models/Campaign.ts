import mongoose, { Document, Schema } from 'mongoose';

export interface IMilestone {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  isCompleted: boolean;
  votesFor: number;
  votesAgainst: number;
  votingDeadline: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvestment {
  investorAddress: string;
  amount: number;
  netAmount: number; // Amount after platform fee
  platformFee: number;
  timestamp: Date;
  transactionId?: string;
}

export interface ICampaign extends Document {
  // On-chain data
  chainId: number;
  creatorAddress: string;
  contractAddress: string;
  
  // Campaign details
  title: string;
  description: string;
  longDescription?: string;
  targetAmount: number;
  raisedAmount: number;
  deadline: Date;
  status: 'active' | 'completed' | 'cancelled' | 'failed';
  
  // Milestones
  milestones: IMilestone[];
  currentMilestone: number;
  
  // Investments
  investments: IInvestment[];
  investorCount: number;
  
  // Metadata
  category: string;
  tags: string[];
  industry: string;
  stage: 'idea' | 'mvp' | 'early-revenue' | 'growth' | 'scale';
  
  // Team information
  team: Array<{
    name: string;
    role: string;
    bio?: string;
    linkedin?: string;
    avatar?: string;
  }>;
  
  // Media
  media: {
    logo?: string;
    banner?: string;
    gallery: string[];
    video?: string;
    documents: Array<{
      name: string;
      url: string;
      type: 'pitch-deck' | 'business-plan' | 'financial-projections' | 'other';
    }>;
  };
  
  // Metrics
  metrics: {
    traction?: string;
    revenue?: string;
    growth?: string;
    users?: number;
    mrr?: number;
    runway?: number;
  };
  
  // Funding details
  fundingDetails: {
    useOfFunds: Array<{
      category: string;
      percentage: number;
      description: string;
    }>;
    minimumInvestment: number;
    maximumInvestment?: number;
    expectedROI?: string;
    exitStrategy?: string;
  };
  
  // Platform data
  views: number;
  likes: number;
  shares: number;
  featured: boolean;
  verified: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  launchedAt?: Date;
  completedAt?: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  id: { type: Number, required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 1000 },
  targetAmount: { type: Number, required: true, min: 0 },
  isCompleted: { type: Boolean, default: false },
  votesFor: { type: Number, default: 0, min: 0 },
  votesAgainst: { type: Number, default: 0, min: 0 },
  votingDeadline: { type: Date, required: true },
  completedAt: Date
}, { timestamps: true });

const InvestmentSchema = new Schema<IInvestment>({
  investorAddress: { type: String, required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  netAmount: { type: Number, required: true, min: 0 },
  platformFee: { type: Number, required: true, min: 0 },
  timestamp: { type: Date, default: Date.now },
  transactionId: String
});

const CampaignSchema = new Schema<ICampaign>({
  // On-chain data
  chainId: { type: Number, required: true, index: true },
  creatorAddress: { type: String, required: true, index: true },
  contractAddress: { type: String, required: true },
  
  // Campaign details
  title: { type: String, required: true, maxlength: 200, index: true },
  description: { type: String, required: true, maxlength: 500 },
  longDescription: { type: String, maxlength: 5000 },
  targetAmount: { type: Number, required: true, min: 1 },
  raisedAmount: { type: Number, default: 0, min: 0 },
  deadline: { type: Date, required: true, index: true },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'failed'],
    default: 'active',
    index: true
  },
  
  // Milestones
  milestones: [MilestoneSchema],
  currentMilestone: { type: Number, default: 0, min: 0 },
  
  // Investments
  investments: [InvestmentSchema],
  investorCount: { type: Number, default: 0, min: 0 },
  
  // Metadata
  category: { type: String, required: true, index: true },
  tags: [{ type: String, trim: true }],
  industry: { type: String, required: true, index: true },
  stage: {
    type: String,
    enum: ['idea', 'mvp', 'early-revenue', 'growth', 'scale'],
    required: true,
    index: true
  },
  
  // Team information
  team: [{
    name: { type: String, required: true, maxlength: 100 },
    role: { type: String, required: true, maxlength: 100 },
    bio: { type: String, maxlength: 500 },
    linkedin: String,
    avatar: String
  }],
  
  // Media
  media: {
    logo: String,
    banner: String,
    gallery: [String],
    video: String,
    documents: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      type: {
        type: String,
        enum: ['pitch-deck', 'business-plan', 'financial-projections', 'other'],
        required: true
      }
    }]
  },
  
  // Metrics
  metrics: {
    traction: String,
    revenue: String,
    growth: String,
    users: { type: Number, min: 0 },
    mrr: { type: Number, min: 0 },
    runway: { type: Number, min: 0 }
  },
  
  // Funding details
  fundingDetails: {
    useOfFunds: [{
      category: { type: String, required: true },
      percentage: { type: Number, required: true, min: 0, max: 100 },
      description: { type: String, required: true }
    }],
    minimumInvestment: { type: Number, required: true, min: 0 },
    maximumInvestment: { type: Number, min: 0 },
    expectedROI: String,
    exitStrategy: String
  },
  
  // Platform data
  views: { type: Number, default: 0, min: 0 },
  likes: { type: Number, default: 0, min: 0 },
  shares: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false, index: true },
  verified: { type: Boolean, default: false, index: true },
  
  // Timestamps
  launchedAt: Date,
  completedAt: Date
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Indexes for performance
CampaignSchema.index({ creatorAddress: 1, createdAt: -1 });
CampaignSchema.index({ status: 1, deadline: 1 });
CampaignSchema.index({ industry: 1, category: 1 });
CampaignSchema.index({ featured: 1, createdAt: -1 });
CampaignSchema.index({ raisedAmount: -1 });
CampaignSchema.index({ 'investments.investorAddress': 1 });

// Virtual for funding progress percentage
CampaignSchema.virtual('fundingProgress').get(function() {
  return this.targetAmount > 0 ? (this.raisedAmount / this.targetAmount) * 100 : 0;
});

// Virtual for days remaining
CampaignSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const diffTime = this.deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Instance methods
CampaignSchema.methods.addInvestment = function(investment: Partial<IInvestment>) {
  this.investments.push(investment);
  this.raisedAmount += investment.netAmount || 0;
  
  // Update investor count (unique investors)
  const uniqueInvestors = new Set(this.investments.map(inv => inv.investorAddress));
  this.investorCount = uniqueInvestors.size;
  
  return this.save();
};

CampaignSchema.methods.addMilestone = function(milestone: Partial<IMilestone>) {
  const newMilestone = {
    ...milestone,
    id: this.milestones.length,
    isCompleted: false,
    votesFor: 0,
    votesAgainst: 0
  };
  this.milestones.push(newMilestone);
  return this.save();
};

CampaignSchema.methods.updateStatus = function() {
  const now = new Date();
  
  if (now > this.deadline && this.status === 'active') {
    if (this.raisedAmount >= this.targetAmount) {
      this.status = 'completed';
      this.completedAt = now;
    } else {
      this.status = 'failed';
    }
  }
  
  return this.save();
};

// Static methods
CampaignSchema.statics.findByCreator = function(creatorAddress: string) {
  return this.find({ creatorAddress }).sort({ createdAt: -1 });
};

CampaignSchema.statics.findByInvestor = function(investorAddress: string) {
  return this.find({ 'investments.investorAddress': investorAddress }).sort({ createdAt: -1 });
};

CampaignSchema.statics.findActive = function() {
  return this.find({ status: 'active', deadline: { $gt: new Date() } }).sort({ createdAt: -1 });
};

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);