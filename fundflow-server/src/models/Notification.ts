import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  // Recipient information
  recipientId: mongoose.Types.ObjectId;
  recipientType: 'investor' | 'startup';
  recipientAddress: string;

  // Notification content
  title: string;
  message: string;
  type: 'investment' | 'milestone' | 'campaign' | 'payment' | 'system' | 'reminder' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Related entities
  relatedCampaignId?: mongoose.Types.ObjectId;
  relatedInvestmentId?: mongoose.Types.ObjectId;
  relatedMilestoneId?: mongoose.Types.ObjectId;
  
  // Action data
  actionUrl?: string;
  actionText?: string;
  actionData?: Record<string, any>;
  
  // Status and metadata
  isRead: boolean;
  isArchived: boolean;
  readAt?: Date;
  archivedAt?: Date;
  
  // Delivery settings
  deliveryChannels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  
  // Timestamps
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  // Recipient information
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipientType: {
    type: String,
    enum: ['investor', 'startup'],
    required: true,
    index: true
  },
  recipientAddress: {
    type: String,
    required: true,
    index: true
  },

  // Notification content
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['investment', 'milestone', 'campaign', 'payment', 'system', 'reminder', 'alert'],
    required: true,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  
  // Related entities
  relatedCampaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  relatedInvestmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Investment'
  },
  relatedMilestoneId: {
    type: Schema.Types.ObjectId,
    ref: 'Milestone'
  },
  
  // Action data
  actionUrl: String,
  actionText: String,
  actionData: Schema.Types.Mixed,
  
  // Status and metadata
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date,
  archivedAt: Date,
  
  // Delivery settings
  deliveryChannels: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    inApp: {
      type: Boolean,
      default: true
    }
  },
  
  // Timestamps
  scheduledAt: Date,
  sentAt: Date
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
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ recipientAddress: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, priority: 1, createdAt: -1 });
NotificationSchema.index({ isRead: 1, isArchived: 1 });
NotificationSchema.index({ scheduledAt: 1, sentAt: 1 });

// Virtual for notification age
NotificationSchema.virtual('age').get(function() {
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
NotificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

NotificationSchema.methods.archive = function() {
  this.isArchived = true;
  this.archivedAt = new Date();
  return this.save();
};

NotificationSchema.methods.markAsSent = function() {
  this.sentAt = new Date();
  return this.save();
};

// Static methods
NotificationSchema.statics.findByRecipient = function(recipientId: string, options: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: string;
  priority?: string;
} = {}) {
  const { page = 1, limit = 20, unreadOnly = false, type, priority } = options;
  const skip = (page - 1) * limit;
  
  const query: any = { recipientId };
  
  if (unreadOnly) {
    query.isRead = false;
  }
  
  if (type) {
    query.type = type;
  }
  
  if (priority) {
    query.priority = priority;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

NotificationSchema.statics.getUnreadCount = function(recipientId: string) {
  return this.countDocuments({
    recipientId,
    isRead: false,
    isArchived: false
  });
};

NotificationSchema.statics.markAllAsRead = function(recipientId: string) {
  return this.updateMany(
    { recipientId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

export default mongoose.model<INotification>('Notification', NotificationSchema);
