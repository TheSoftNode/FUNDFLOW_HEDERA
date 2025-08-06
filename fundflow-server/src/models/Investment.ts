import mongoose, { Document, Schema } from 'mongoose';

export interface IInvestment extends Document {
  // Basic investment info
  campaignId: mongoose.Types.ObjectId;
  investorAddress: string;
  creatorAddress: string;
  
  // Investment amounts
  amount: number; // Total investment amount in microSTX
  netAmount: number; // Amount after platform fee
  platformFee: number; // Platform fee paid
  
  // Transaction details
  transactionId: string;
  blockHeight: number;
  timestamp: Date;
  
  // Investment status
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  confirmations: number;
  
  // Voting power and governance
  votingPower: number; // Based on investment amount
  votes: Array<{
    milestoneId: number;
    vote: 'for' | 'against';
    timestamp: Date;
    transactionId?: string;
  }>;
  
  // Returns and payouts
  expectedReturns: number;
  actualReturns: number;
  payouts: Array<{
    amount: number;
    timestamp: Date;
    transactionId: string;
    milestoneId?: number;
    type: 'milestone' | 'dividend' | 'exit';
  }>;
  
  // Metadata
  source: 'web' | 'mobile' | 'api';
  userAgent?: string;
  ipAddress?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>({
  // Basic investment info
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    index: true
  },
  investorAddress: {
    type: String,
    required: true,
    index: true
  },
  creatorAddress: {
    type: String,
    required: true,
    index: true
  },
  
  // Investment amounts
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  netAmount: {
    type: Number,
    required: true,
    min: 0
  },
  platformFee: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Transaction details
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  blockHeight: {
    type: Number,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  
  // Investment status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed', 'refunded'],
    default: 'pending',
    index: true
  },
  confirmations: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Voting power and governance
  votingPower: {
    type: Number,
    required: true,
    min: 0
  },
  votes: [{
    milestoneId: {
      type: Number,
      required: true
    },
    vote: {
      type: String,
      enum: ['for', 'against'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    transactionId: String
  }],
  
  // Returns and payouts
  expectedReturns: {
    type: Number,
    default: 0,
    min: 0
  },
  actualReturns: {
    type: Number,
    default: 0
  },
  payouts: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    timestamp: {
      type: Date,
      required: true
    },
    transactionId: {
      type: String,
      required: true
    },
    milestoneId: Number,
    type: {
      type: String,
      enum: ['milestone', 'dividend', 'exit'],
      required: true
    }
  }],
  
  // Metadata
  source: {
    type: String,
    enum: ['web', 'mobile', 'api'],
    default: 'web'
  },
  userAgent: String,
  ipAddress: String
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete (ret as any).__v;
      delete ret.userAgent;
      delete ret.ipAddress;
      return ret;
    }
  }
});

// Indexes for performance
InvestmentSchema.index({ investorAddress: 1, createdAt: -1 });
InvestmentSchema.index({ campaignId: 1, investorAddress: 1 });
InvestmentSchema.index({ status: 1, timestamp: -1 });
InvestmentSchema.index({ transactionId: 1 }, { unique: true });
InvestmentSchema.index({ blockHeight: -1 });

// Virtual for ROI percentage
InvestmentSchema.virtual('roiPercentage').get(function() {
  return this.netAmount > 0 ? ((this.actualReturns - this.netAmount) / this.netAmount) * 100 : 0;
});

// Instance methods
InvestmentSchema.methods.addVote = function(milestoneId: number, vote: 'for' | 'against', transactionId?: string) {
  // Check if already voted on this milestone
  const existingVote = this.votes.find(v => v.milestoneId === milestoneId);
  if (existingVote) {
    throw new Error('Already voted on this milestone');
  }
  
  this.votes.push({
    milestoneId,
    vote,
    timestamp: new Date(),
    transactionId
  });
  
  return this.save();
};

InvestmentSchema.methods.addPayout = function(amount: number, transactionId: string, type: 'milestone' | 'dividend' | 'exit', milestoneId?: number) {
  this.payouts.push({
    amount,
    timestamp: new Date(),
    transactionId,
    milestoneId,
    type
  });
  
  this.actualReturns += amount;
  return this.save();
};

InvestmentSchema.methods.updateStatus = function(status: 'pending' | 'confirmed' | 'failed' | 'refunded', confirmations?: number) {
  this.status = status;
  if (confirmations !== undefined) {
    this.confirmations = confirmations;
  }
  return this.save();
};

// Static methods
InvestmentSchema.statics.findByInvestor = function(investorAddress: string) {
  return this.find({ investorAddress }).populate('campaignId').sort({ createdAt: -1 });
};

InvestmentSchema.statics.findByCampaign = function(campaignId: string) {
  return this.find({ campaignId }).sort({ timestamp: -1 });
};

InvestmentSchema.statics.getTotalInvestmentByInvestor = function(investorAddress: string) {
  return this.aggregate([
    { $match: { investorAddress, status: 'confirmed' } },
    { $group: { _id: null, total: { $sum: '$netAmount' } } }
  ]);
};

InvestmentSchema.statics.getPortfolioStats = function(investorAddress: string) {
  return this.aggregate([
    { $match: { investorAddress, status: 'confirmed' } },
    {
      $group: {
        _id: null,
        totalInvested: { $sum: '$netAmount' },
        totalReturns: { $sum: '$actualReturns' },
        totalPayouts: { $sum: { $sum: '$payouts.amount' } },
        investmentCount: { $sum: 1 },
        avgInvestment: { $avg: '$netAmount' }
      }
    }
  ]);
};

export default mongoose.model<IInvestment>('Investment', InvestmentSchema);