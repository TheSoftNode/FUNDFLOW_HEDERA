import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  // Payment identification
  paymentId: string;
  reference: string;
  
  // Parties involved
  payerId: mongoose.Types.ObjectId;
  payerAddress: string;
  payerType: 'investor' | 'startup';
  
  payeeId: mongoose.Types.ObjectId;
  payeeAddress: string;
  payeeType: 'investor' | 'startup';
  
  // Payment details
  amount: number;
  currency: string;
  paymentType: 'investment' | 'milestone' | 'dividend' | 'refund' | 'fee' | 'withdrawal';
  
  // Related entities
  campaignId?: mongoose.Types.ObjectId;
  investmentId?: mongoose.Types.ObjectId;
  milestoneId?: mongoose.Types.ObjectId;
  
  // Transaction information
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
  gasPrice: number;
  
  // Payment status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  confirmations: number;
  requiredConfirmations: number;
  
  // Fee breakdown
  platformFee: number;
  networkFee: number;
  netAmount: number;
  
  // Metadata
  description: string;
  metadata: Record<string, any>;
  
  // Timestamps
  initiatedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  // Payment identification
  paymentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  reference: {
    type: String,
    required: true,
    index: true
  },
  
  // Parties involved
  payerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  payerAddress: {
    type: String,
    required: true,
    index: true
  },
  payerType: {
    type: String,
    enum: ['investor', 'startup'],
    required: true,
    index: true
  },
  
  payeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  payeeAddress: {
    type: String,
    required: true,
    index: true
  },
  payeeType: {
    type: String,
    enum: ['investor', 'startup'],
    required: true,
    index: true
  },
  
  // Payment details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'HBAR',
    uppercase: true
  },
  paymentType: {
    type: String,
    enum: ['investment', 'milestone', 'dividend', 'refund', 'fee', 'withdrawal'],
    required: true,
    index: true
  },
  
  // Related entities
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  investmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Investment'
  },
  milestoneId: {
    type: Schema.Types.ObjectId,
    ref: 'Milestone'
  },
  
  // Transaction information
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  blockNumber: {
    type: Number,
    required: true,
    index: true
  },
  gasUsed: {
    type: Number,
    required: true,
    min: 0
  },
  gasPrice: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Payment status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  confirmations: {
    type: Number,
    default: 0,
    min: 0
  },
  requiredConfirmations: {
    type: Number,
    default: 12,
    min: 1
  },
  
  // Fee breakdown
  platformFee: {
    type: Number,
    required: true,
    min: 0
  },
  networkFee: {
    type: Number,
    required: true,
    min: 0
  },
  netAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Metadata
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  metadata: Schema.Types.Mixed,
  
  // Timestamps
  initiatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  processedAt: Date,
  completedAt: Date,
  failedAt: Date
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
PaymentSchema.index({ payerId: 1, createdAt: -1 });
PaymentSchema.index({ payeeId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ paymentType: 1, createdAt: -1 });
PaymentSchema.index({ campaignId: 1, createdAt: -1 });
PaymentSchema.index({ transactionHash: 1 }, { unique: true });
PaymentSchema.index({ blockNumber: -1 });

// Virtual for total fees
PaymentSchema.virtual('totalFees').get(function() {
  return this.platformFee + this.networkFee;
});

// Virtual for payment age
PaymentSchema.virtual('age').get(function() {
  const now = new Date();
  const diffTime = now.getTime() - this.createdAt.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
});

// Instance methods
PaymentSchema.methods.updateStatus = function(status: string, confirmations?: number) {
  this.status = status;
  
  if (confirmations !== undefined) {
    this.confirmations = confirmations;
  }
  
  switch (status) {
    case 'processing':
      this.processedAt = new Date();
      break;
    case 'completed':
      this.completedAt = new Date();
      break;
    case 'failed':
      this.failedAt = new Date();
      break;
  }
  
  return this.save();
};

PaymentSchema.methods.isConfirmed = function() {
  return this.confirmations >= this.requiredConfirmations;
};

// Static methods
PaymentSchema.statics.findByUser = function(userId: string, options: {
  page?: number;
  limit?: number;
  status?: string;
  paymentType?: string;
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const { page = 1, limit = 20, status, paymentType, startDate, endDate } = options;
  const skip = (page - 1) * limit;
  
  const query: any = {
    $or: [
      { payerId: userId },
      { payeeId: userId }
    ]
  };
  
  if (status) {
    query.status = status;
  }
  
  if (paymentType) {
    query.paymentType = paymentType;
  }
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

PaymentSchema.statics.getPaymentStats = function(userId: string) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { payerId: mongoose.Types.ObjectId(userId) },
          { payeeId: mongoose.Types.ObjectId(userId) }
        ],
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalSent: {
          $sum: {
            $cond: [
              { $eq: ['$payerId', mongoose.Types.ObjectId(userId)] },
              '$amount',
              0
            ]
          }
        },
        totalReceived: {
          $sum: {
            $cond: [
              { $eq: ['$payeeId', mongoose.Types.ObjectId(userId)] },
              '$amount',
              0
            ]
          }
        },
        totalFees: { $sum: '$platformFee' },
        paymentCount: { $sum: 1 }
      }
    }
  ]);
};

export default mongoose.model<IPayment>('Payment', PaymentSchema);
