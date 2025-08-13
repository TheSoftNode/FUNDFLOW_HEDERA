import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  // Report identification
  reportId: string;
  title: string;
  description: string;
  
  // Report type and category
  reportType: 'performance' | 'financial' | 'milestone' | 'tax' | 'due-diligence' | 'compliance' | 'analytics';
  category: 'investor' | 'startup' | 'campaign' | 'platform' | 'regulatory';
  
  // Report owner and access
  ownerId: mongoose.Types.ObjectId;
  ownerType: 'investor' | 'startup' | 'admin';
  isPublic: boolean;
  accessList: mongoose.Types.ObjectId[]; // Users who can access this report
  
  // Related entities
  campaignId?: mongoose.Types.ObjectId;
  investmentId?: mongoose.Types.ObjectId;
  milestoneId?: mongoose.Types.ObjectId;
  
  // Report content and data
  content: {
    sections: Array<{
      title: string;
      content: string;
      data?: any;
      charts?: Array<{
        type: string;
        data: any;
        options?: any;
      }>;
    }>;
    summary: string;
    keyMetrics: Record<string, any>;
    recommendations?: string[];
  };
  
  // Report metadata
  status: 'draft' | 'generated' | 'published' | 'archived';
  version: string;
  tags: string[];
  
  // File attachments
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }>;
  
  // Generation settings
  generationSettings: {
    frequency: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    lastGenerated?: Date;
    nextGeneration?: Date;
    autoGenerate: boolean;
    template?: string;
  };
  
  // Timestamps
  generatedAt?: Date;
  publishedAt?: Date;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  // Report identification
  reportId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Report type and category
  reportType: {
    type: String,
    enum: ['performance', 'financial', 'milestone', 'tax', 'due-diligence', 'compliance', 'analytics'],
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['investor', 'startup', 'campaign', 'platform', 'regulatory'],
    required: true,
    index: true
  },
  
  // Report owner and access
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  ownerType: {
    type: String,
    enum: ['investor', 'startup', 'admin'],
    required: true,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: false,
    index: true
  },
  accessList: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  
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
  
  // Report content and data
  content: {
    sections: [{
      title: {
        type: String,
        required: true,
        maxlength: 200
      },
      content: {
        type: String,
        required: true,
        maxlength: 10000
      },
      data: Schema.Types.Mixed,
      charts: [{
        type: String,
        data: Schema.Types.Mixed,
        options: Schema.Types.Mixed
      }]
    }],
    summary: {
      type: String,
      required: true,
      maxlength: 2000
    },
    keyMetrics: Schema.Types.Mixed,
    recommendations: [String]
  },
  
  // Report metadata
  status: {
    type: String,
    enum: ['draft', 'generated', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // File attachments
  attachments: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true,
      min: 0
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Generation settings
  generationSettings: {
    frequency: {
      type: String,
      enum: ['one-time', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
      default: 'one-time'
    },
    lastGenerated: Date,
    nextGeneration: Date,
    autoGenerate: {
      type: Boolean,
      default: false
    },
    template: String
  },
  
  // Timestamps
  generatedAt: Date,
  publishedAt: Date,
  archivedAt: Date
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
ReportSchema.index({ ownerId: 1, createdAt: -1 });
ReportSchema.index({ reportType: 1, category: 1, createdAt: -1 });
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ isPublic: 1, createdAt: -1 });
ReportSchema.index({ tags: 1 });
ReportSchema.index({ 'generationSettings.frequency': 1, 'generationSettings.nextGeneration': 1 });

// Virtual for report age
ReportSchema.virtual('age').get(function() {
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
ReportSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

ReportSchema.methods.archive = function() {
  this.status = 'archived';
  this.archivedAt = new Date();
  return this.save();
};

ReportSchema.methods.generate = function() {
  this.status = 'generated';
  this.generatedAt = new Date();
  
  if (this.generationSettings.frequency !== 'one-time') {
    this.generationSettings.lastGenerated = new Date();
    // Calculate next generation date based on frequency
    const nextDate = new Date();
    switch (this.generationSettings.frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    this.generationSettings.nextGeneration = nextDate;
  }
  
  return this.save();
};

// Static methods
ReportSchema.statics.findByOwner = function(ownerId: string, options: {
  page?: number;
  limit?: number;
  reportType?: string;
  status?: string;
  category?: string;
} = {}) {
  const { page = 1, limit = 20, reportType, status, category } = options;
  const skip = (page - 1) * limit;
  
  const query: any = { ownerId };
  
  if (reportType) {
    query.reportType = reportType;
  }
  
  if (status) {
    query.status = status;
  }
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

ReportSchema.statics.findPublic = function(options: {
  page?: number;
  limit?: number;
  reportType?: string;
  category?: string;
  tags?: string[];
} = {}) {
  const { page = 1, limit = 20, reportType, category, tags } = options;
  const skip = (page - 1) * limit;
  
  const query: any = { isPublic: true, status: 'published' };
  
  if (reportType) {
    query.reportType = reportType;
  }
  
  if (category) {
    query.category = category;
  }
  
  if (tags && tags.length > 0) {
    query.tags = { $in: tags };
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export default mongoose.model<IReport>('Report', ReportSchema);
