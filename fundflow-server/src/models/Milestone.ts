import mongoose, { Document, Schema } from 'mongoose';

export interface IMilestoneVote {
  investorAddress: string;
  investmentAmount: number; // For weighted voting
  vote: 'for' | 'against';
  timestamp: Date;
  transactionId?: string;
}

export interface IMilestone extends Document {
  // Basic milestone info
  campaignId: mongoose.Types.ObjectId;
  milestoneIndex: number; // Index in the campaign's milestone array
  
  // Milestone details
  title: string;
  description: string;
  targetAmount: number;
  deliverables: string[];
  
  // Timeline
  startDate: Date;
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  votingDeadline: Date;
  
  // Status
  status: 'pending' | 'in-progress' | 'submitted' | 'voting' | 'approved' | 'rejected' | 'completed';
  isCompleted: boolean;
  
  // Evidence and submission
  evidence: Array<{
    type: 'document' | 'image' | 'video' | 'link';
    url: string;
    title: string;
    description?: string;
    uploadedAt: Date;
  }>;
  submissionNotes?: string;
  submittedAt?: Date;
  
  // Voting data
  votes: IMilestoneVote[];
  votesFor: number;
  votesAgainst: number;
  totalVotingPower: number;
  votingPowerFor: number;
  votingPowerAgainst: number;
  
  // Funding release
  fundsReleased: boolean;
  releasedAmount: number;
  releaseTransactionId?: string;
  releasedAt?: Date;
  
  // Approval requirements
  requiredApprovalPercentage: number; // Default 50%
  minimumVotingPower: number; // Minimum voting power needed for quorum
  
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneVoteSchema = new Schema<IMilestoneVote>({
  investorAddress: {
    type: String,
    required: true,
    index: true
  },
  investmentAmount: {
    type: Number,
    required: true,
    min: 0
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
});

const MilestoneSchema = new Schema<IMilestone>({
  // Basic milestone info
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    index: true
  },
  milestoneIndex: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Milestone details
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deliverables: [{
    type: String,
    maxlength: 500
  }],
  
  // Timeline
  startDate: {
    type: Date,
    required: true
  },
  expectedCompletionDate: {
    type: Date,
    required: true
  },
  actualCompletionDate: Date,
  votingDeadline: {
    type: Date,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'submitted', 'voting', 'approved', 'rejected', 'completed'],
    default: 'pending',
    index: true
  },
  isCompleted: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Evidence and submission
  evidence: [{
    type: {
      type: String,
      enum: ['document', 'image', 'video', 'link'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    description: {
      type: String,
      maxlength: 500
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  submissionNotes: {
    type: String,
    maxlength: 2000
  },
  submittedAt: Date,
  
  // Voting data
  votes: [MilestoneVoteSchema],
  votesFor: {
    type: Number,
    default: 0,
    min: 0
  },
  votesAgainst: {
    type: Number,
    default: 0,
    min: 0
  },
  totalVotingPower: {
    type: Number,
    default: 0,
    min: 0
  },
  votingPowerFor: {
    type: Number,
    default: 0,
    min: 0
  },
  votingPowerAgainst: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Funding release
  fundsReleased: {
    type: Boolean,
    default: false
  },
  releasedAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  releaseTransactionId: String,
  releasedAt: Date,
  
  // Approval requirements
  requiredApprovalPercentage: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  minimumVotingPower: {
    type: Number,
    default: 0,
    min: 0
  }
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
MilestoneSchema.index({ campaignId: 1, milestoneIndex: 1 });
MilestoneSchema.index({ status: 1, votingDeadline: 1 });
MilestoneSchema.index({ 'votes.investorAddress': 1 });
MilestoneSchema.index({ isCompleted: 1, completedAt: -1 });

// Virtual for approval percentage
MilestoneSchema.virtual('approvalPercentage').get(function() {
  return this.totalVotingPower > 0 ? (this.votingPowerFor / this.totalVotingPower) * 100 : 0;
});

// Virtual for voting progress
MilestoneSchema.virtual('votingProgress').get(function() {
  const totalVotes = this.votesFor + this.votesAgainst;
  return totalVotes;
});

// Virtual for time remaining for voting
MilestoneSchema.virtual('votingTimeRemaining').get(function() {
  const now = new Date();
  const diffTime = this.votingDeadline.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24))); // Days remaining
});

// Instance methods
MilestoneSchema.methods.addVote = function(investorAddress: string, investmentAmount: number, vote: 'for' | 'against', transactionId?: string) {
  // Check if investor already voted
  const existingVoteIndex = this.votes.findIndex(v => v.investorAddress === investorAddress);
  if (existingVoteIndex !== -1) {
    // Update existing vote
    const oldVote = this.votes[existingVoteIndex];
    
    // Remove old vote counts
    if (oldVote.vote === 'for') {
      this.votesFor -= 1;
      this.votingPowerFor -= oldVote.investmentAmount;
    } else {
      this.votesAgainst -= 1;
      this.votingPowerAgainst -= oldVote.investmentAmount;
    }
    
    // Update vote
    this.votes[existingVoteIndex] = {
      investorAddress,
      investmentAmount,
      vote,
      timestamp: new Date(),
      transactionId
    };
  } else {
    // Add new vote
    this.votes.push({
      investorAddress,
      investmentAmount,
      vote,
      timestamp: new Date(),
      transactionId
    });
  }
  
  // Update vote counts
  if (vote === 'for') {
    this.votesFor += 1;
    this.votingPowerFor += investmentAmount;
  } else {
    this.votesAgainst += 1;
    this.votingPowerAgainst += investmentAmount;
  }
  
  // Update total voting power if this is a new voter
  if (existingVoteIndex === -1) {
    this.totalVotingPower += investmentAmount;
  }
  
  return this.save();
};

MilestoneSchema.methods.submitForVoting = function(evidence: any[], submissionNotes?: string) {
  this.status = 'voting';
  this.evidence = evidence;
  this.submissionNotes = submissionNotes;
  this.submittedAt = new Date();
  
  return this.save();
};

MilestoneSchema.methods.checkApprovalStatus = function() {
  const approvalPercentage = this.totalVotingPower > 0 ? (this.votingPowerFor / this.totalVotingPower) * 100 : 0;
  const hasQuorum = this.totalVotingPower >= this.minimumVotingPower;
  const votingEnded = new Date() > this.votingDeadline;
  
  if (votingEnded && hasQuorum) {
    if (approvalPercentage >= this.requiredApprovalPercentage) {
      this.status = 'approved';
    } else {
      this.status = 'rejected';
    }
    return this.save();
  }
  
  return Promise.resolve(this);
};

MilestoneSchema.methods.releaseFunds = function(amount: number, transactionId: string) {
  this.fundsReleased = true;
  this.releasedAmount = amount;
  this.releaseTransactionId = transactionId;
  this.releasedAt = new Date();
  this.status = 'completed';
  this.isCompleted = true;
  this.actualCompletionDate = new Date();
  
  return this.save();
};

// Static methods
MilestoneSchema.statics.findByCampaign = function(campaignId: string) {
  return this.find({ campaignId }).sort({ milestoneIndex: 1 });
};

MilestoneSchema.statics.findPendingVoting = function() {
  return this.find({
    status: 'voting',
    votingDeadline: { $gt: new Date() }
  }).populate('campaignId');
};

MilestoneSchema.statics.findExpiredVoting = function() {
  return this.find({
    status: 'voting',
    votingDeadline: { $lte: new Date() }
  }).populate('campaignId');
};

export default mongoose.model<IMilestone>('Milestone', MilestoneSchema);