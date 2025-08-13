import mongoose, { Document, Schema } from 'mongoose';

export interface ISupportTicket extends Document {
  // Ticket identification
  ticketId: string;
  title: string;
  description: string;
  
  // Ticket classification
  category: 'technical' | 'billing' | 'account' | 'investment' | 'campaign' | 'general' | 'bug' | 'feature-request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting-for-user' | 'resolved' | 'closed';
  
  // User information
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userRole: 'investor' | 'startup' | 'admin';
  
  // Assignment and handling
  assignedTo?: mongoose.Types.ObjectId;
  assignedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  
  // Related entities
  campaignId?: mongoose.Types.ObjectId;
  investmentId?: mongoose.Types.ObjectId;
  milestoneId?: mongoose.Types.ObjectId;
  
  // Ticket details
  tags: string[];
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }>;
  
  // Communication history
  messages: Array<{
    senderId: mongoose.Types.ObjectId;
    senderType: 'user' | 'support' | 'system';
    message: string;
    isInternal: boolean;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
    createdAt: Date;
  }>;
  
  // Resolution information
  resolution?: {
    summary: string;
    steps: string[];
    category: 'resolved' | 'workaround' | 'duplicate' | 'not-a-bug' | 'by-design';
    feedback?: {
      rating: number;
      comment?: string;
      submittedAt: Date;
    };
  };
  
  // SLA and timing
  sla: {
    targetResolutionTime: number; // in hours
    firstResponseTime?: number; // in hours
    resolutionTime?: number; // in hours
    isOverdue: boolean;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
  closedAt?: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
  // Ticket identification
  ticketId: {
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
    maxlength: 5000
  },
  
  // Ticket classification
  category: {
    type: String,
    enum: ['technical', 'billing', 'account', 'investment', 'campaign', 'general', 'bug', 'feature-request'],
    required: true,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'waiting-for-user', 'resolved', 'closed'],
    default: 'open',
    index: true
  },
  
  // User information
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  userRole: {
    type: String,
    enum: ['investor', 'startup', 'admin'],
    required: true,
    index: true
  },
  
  // Assignment and handling
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  
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
  
  // Ticket details
  tags: [{
    type: String,
    trim: true
  }],
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
  
  // Communication history
  messages: [{
    senderId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    senderType: {
      type: String,
      enum: ['user', 'support', 'system'],
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    attachments: [{
      name: String,
      url: String,
      type: String
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Resolution information
  resolution: {
    summary: {
      type: String,
      maxlength: 2000
    },
    steps: [String],
    category: {
      type: String,
      enum: ['resolved', 'workaround', 'duplicate', 'not-a-bug', 'by-design']
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      submittedAt: Date
    }
  },
  
  // SLA and timing
  sla: {
    targetResolutionTime: {
      type: Number,
      default: 24, // 24 hours default
      min: 1
    },
    firstResponseTime: Number,
    resolutionTime: Number,
    isOverdue: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  
  // Timestamps
  lastActivity: {
    type: Date,
    default: Date.now
  },
  closedAt: Date
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
SupportTicketSchema.index({ ticketId: 1 }, { unique: true });
SupportTicketSchema.index({ userId: 1, createdAt: -1 });
SupportTicketSchema.index({ status: 1, priority: 1, createdAt: -1 });
SupportTicketSchema.index({ category: 1, status: 1 });
SupportTicketSchema.index({ assignedTo: 1, status: 1 });
SupportTicketSchema.index({ 'sla.isOverdue': 1, priority: 1 });
SupportTicketSchema.index({ lastActivity: -1 });

// Virtual for ticket age
SupportTicketSchema.virtual('age').get(function() {
  const now = new Date();
  const diffTime = now.getTime() - this.createdAt.getTime();
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
});

// Virtual for response time
SupportTicketSchema.virtual('responseTime').get(function() {
  if (this.messages.length < 2) return null;
  
  const firstUserMessage = this.messages[0];
  const firstSupportMessage = this.messages.find(m => m.senderType === 'support');
  
  if (!firstSupportMessage) return null;
  
  const responseTime = firstSupportMessage.createdAt.getTime() - firstUserMessage.createdAt.getTime();
  return Math.floor(responseTime / (1000 * 60 * 60)); // in hours
});

// Instance methods
SupportTicketSchema.methods.addMessage = function(senderId: string, senderType: string, message: string, isInternal: boolean = false, attachments?: any[]) {
  this.messages.push({
    senderId: new mongoose.Types.ObjectId(senderId),
    senderType: senderType as any,
    message,
    isInternal,
    attachments: attachments || [],
    createdAt: new Date()
  });
  
  this.lastActivity = new Date();
  
  // Update first response time if this is the first support message
  if (senderType === 'support' && this.messages.filter(m => m.senderType === 'support').length === 1) {
    const firstUserMessage = this.messages[0];
    const responseTime = this.lastActivity.getTime() - firstUserMessage.createdAt.getTime();
    this.sla.firstResponseTime = Math.floor(responseTime / (1000 * 60 * 60));
  }
  
  return this.save();
};

SupportTicketSchema.methods.assignTo = function(agentId: string) {
  this.assignedTo = new mongoose.Types.ObjectId(agentId);
  this.assignedAt = new Date();
  this.status = 'in-progress';
  this.lastActivity = new Date();
  
  return this.save();
};

SupportTicketSchema.methods.resolve = function(resolverId: string, summary: string, steps: string[], category: string) {
  this.status = 'resolved';
  this.resolvedBy = new mongoose.Types.ObjectId(resolverId);
  this.resolvedAt = new Date();
  this.lastActivity = new Date();
  
  this.resolution = {
    summary,
    steps,
    category: category as any
  };
  
  // Calculate resolution time
  const resolutionTime = this.resolvedAt.getTime() - this.createdAt.getTime();
  this.sla.resolutionTime = Math.floor(resolutionTime / (1000 * 60 * 60));
  
  return this.save();
};

SupportTicketSchema.methods.close = function() {
  this.status = 'closed';
  this.closedAt = new Date();
  this.lastActivity = new Date();
  
  return this.save();
};

// Static methods
SupportTicketSchema.statics.findByUser = function(userId: string, options: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
} = {}) {
  const { page = 1, limit = 20, status, category, priority } = options;
  const skip = (page - 1) * limit;
  
  const query: any = { userId };
  
  if (status) {
    query.status = status;
  }
  
  if (category) {
    query.category = category;
  }
  
  if (priority) {
    query.priority = priority;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

SupportTicketSchema.statics.findAssigned = function(agentId: string, options: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
} = {}) {
  const { page = 1, limit = 20, status, priority } = options;
  const skip = (page - 1) * limit;
  
  const query: any = { assignedTo: agentId };
  
  if (status) {
    query.status = status;
  }
  
  if (priority) {
    query.priority = priority;
  }
  
  return this.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

SupportTicketSchema.statics.getTicketStats = function(userId?: string) {
  const matchStage: any = {};
  if (userId) {
    matchStage.userId = new mongoose.Types.ObjectId(userId);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalTickets: { $sum: 1 },
        openTickets: {
          $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
        },
        inProgressTickets: {
          $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
        },
        resolvedTickets: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        closedTickets: {
          $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
        },
        averageResolutionTime: { $avg: '$sla.resolutionTime' }
      }
    }
  ]);
};

export default mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
