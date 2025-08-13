import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsEvent {
  eventType: string;
  userId?: mongoose.Types.ObjectId;
  userRole?: 'investor' | 'startup' | 'admin';
  sessionId: string;
  timestamp: Date;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

export interface IAnalyticsMetric {
  name: string;
  value: number;
  unit: string;
  category: 'user' | 'campaign' | 'investment' | 'platform' | 'financial';
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface IAnalyticsDashboard {
  userId: mongoose.Types.ObjectId;
  userRole: 'investor' | 'startup' | 'admin';
  name: string;
  description?: string;
  widgets: Array<{
    id: string;
    type: 'chart' | 'metric' | 'table' | 'list';
    title: string;
    config: {
      metric?: string;
      chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
      timeRange?: string;
      filters?: Record<string, any>;
      refreshInterval?: number;
    };
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    isVisible: boolean;
  }>;
  layout: 'grid' | 'flexible';
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnalytics extends Document {
  // Analytics identification
  analyticsId: string;
  name: string;
  description?: string;
  
  // Analytics type and scope
  type: 'user' | 'campaign' | 'investment' | 'platform' | 'custom';
  scope: 'individual' | 'campaign' | 'platform' | 'global';
  
  // Data source and configuration
  dataSource: {
    type: 'database' | 'smart-contract' | 'external-api' | 'calculated';
    source: string;
    query?: string;
    parameters?: Record<string, any>;
  };
  
  // Time configuration
  timeConfig: {
    granularity: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    timezone: string;
    startDate?: Date;
    endDate?: Date;
    isRealTime: boolean;
    updateFrequency: number; // in minutes
  };
  
  // Metrics and dimensions
  metrics: string[];
  dimensions: string[];
  filters: Record<string, any>;
  
  // Visualization settings
  visualization: {
    type: 'chart' | 'table' | 'metric' | 'list';
    chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';
    colors?: string[];
    options?: Record<string, any>;
  };
  
  // Access control
  isPublic: boolean;
  accessList: mongoose.Types.ObjectId[];
  ownerId: mongoose.Types.ObjectId;
  
  // Caching and performance
  cache: {
    isEnabled: boolean;
    ttl: number; // in seconds
    lastUpdated?: Date;
    data?: any;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  eventType: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  userRole: {
    type: String,
    enum: ['investor', 'startup', 'admin']
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  metadata: Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  referrer: String
});

const AnalyticsMetricSchema = new Schema<IAnalyticsMetric>({
  name: {
    type: String,
    required: true,
    index: true
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['user', 'campaign', 'investment', 'platform', 'financial'],
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  metadata: Schema.Types.Mixed
});

const AnalyticsDashboardSchema = new Schema<IAnalyticsDashboard>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userRole: {
    type: String,
    enum: ['investor', 'startup', 'admin'],
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  widgets: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['chart', 'metric', 'table', 'list'],
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 100
    },
    config: {
      metric: String,
      chartType: {
        type: String,
        enum: ['line', 'bar', 'pie', 'doughnut', 'area']
      },
      timeRange: String,
      filters: Schema.Types.Mixed,
      refreshInterval: Number
    },
    position: {
      x: {
        type: Number,
        required: true,
        min: 0
      },
      y: {
        type: Number,
        required: true,
        min: 0
      },
      width: {
        type: Number,
        required: true,
        min: 1
      },
      height: {
        type: Number,
        required: true,
        min: 1
      }
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  }],
  layout: {
    type: String,
    enum: ['grid', 'flexible'],
    default: 'grid'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const AnalyticsSchema = new Schema<IAnalytics>({
  // Analytics identification
  analyticsId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 200,
    index: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  
  // Analytics type and scope
  type: {
    type: String,
    enum: ['user', 'campaign', 'investment', 'platform', 'custom'],
    required: true,
    index: true
  },
  scope: {
    type: String,
    enum: ['individual', 'campaign', 'platform', 'global'],
    required: true,
    index: true
  },
  
  // Data source and configuration
  dataSource: {
    type: {
      type: String,
      enum: ['database', 'smart-contract', 'external-api', 'calculated'],
      required: true
    },
    source: {
      type: String,
      required: true
    },
    query: String,
    parameters: Schema.Types.Mixed
  },
  
  // Time configuration
  timeConfig: {
    granularity: {
      type: String,
      enum: ['minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'],
      required: true
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    startDate: Date,
    endDate: Date,
    isRealTime: {
      type: Boolean,
      default: false
    },
    updateFrequency: {
      type: Number,
      default: 60,
      min: 1
    }
  },
  
  // Metrics and dimensions
  metrics: [{
    type: String,
    trim: true
  }],
  dimensions: [{
    type: String,
    trim: true
  }],
  filters: Schema.Types.Mixed,
  
  // Visualization settings
  visualization: {
    type: {
      type: String,
      enum: ['chart', 'table', 'metric', 'list'],
      required: true
    },
    chartType: {
      type: String,
      enum: ['line', 'bar', 'pie', 'doughnut', 'area', 'scatter']
    },
    colors: [String],
    options: Schema.Types.Mixed
  },
  
  // Access control
  isPublic: {
    type: Boolean,
    default: false,
    index: true
  },
  accessList: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Caching and performance
  cache: {
    isEnabled: {
      type: Boolean,
      default: true
    },
    ttl: {
      type: Number,
      default: 300, // 5 minutes
      min: 60
    },
    lastUpdated: Date,
    data: Schema.Types.Mixed
  },
  
  // Timestamps
  lastExecuted: Date
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
AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });
AnalyticsEventSchema.index({ userId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ sessionId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ userRole: 1, timestamp: -1 });

AnalyticsMetricSchema.index({ name: 1, category: 1, period: 1, timestamp: -1 });
AnalyticsMetricSchema.index({ category: 1, timestamp: -1 });

AnalyticsDashboardSchema.index({ userId: 1, isDefault: 1 });
AnalyticsDashboardSchema.index({ userRole: 1, isDefault: 1 });

AnalyticsSchema.index({ analyticsId: 1 }, { unique: true });
AnalyticsSchema.index({ type: 1, scope: 1 });
AnalyticsSchema.index({ ownerId: 1, createdAt: -1 });
AnalyticsSchema.index({ isPublic: 1, type: 1 });

// Static methods for AnalyticsEvent
AnalyticsEventSchema.statics.trackEvent = function(eventData: Partial<IAnalyticsEvent>) {
  const event = new this({
    ...eventData,
    timestamp: new Date()
  });
  return event.save();
};

AnalyticsEventSchema.statics.getEventStats = function(options: {
  startDate?: Date;
  endDate?: Date;
  eventType?: string;
  userRole?: string;
} = {}) {
  const { startDate, endDate, eventType, userRole } = options;
  
  const matchStage: any = {};
  if (startDate || endDate) {
    matchStage.timestamp = {};
    if (startDate) matchStage.timestamp.$gte = startDate;
    if (endDate) matchStage.timestamp.$lte = endDate;
  }
  if (eventType) matchStage.eventType = eventType;
  if (userRole) matchStage.userRole = userRole;
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        uniqueSessions: { $addToSet: '$sessionId' }
      }
    },
    {
      $project: {
        eventType: '$_id',
        count: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        uniqueSessions: { $size: '$uniqueSessions' }
      }
    }
  ]);
};

// Static methods for AnalyticsMetric
AnalyticsMetricSchema.statics.getMetricHistory = function(metricName: string, options: {
  startDate?: Date;
  endDate?: Date;
  period?: string;
  category?: string;
} = {}) {
  const { startDate, endDate, period, category } = options;
  
  const query: any = { name: metricName };
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }
  if (period) query.period = period;
  if (category) query.category = category;
  
  return this.find(query)
    .sort({ timestamp: 1 })
    .limit(1000);
};

// Static methods for Analytics
AnalyticsSchema.statics.findByOwner = function(ownerId: string, options: {
  page?: number;
  limit?: number;
  type?: string;
  scope?: string;
} = {}) {
  const { page = 1, limit = 20, type, scope } = options;
  const skip = (page - 1) * limit;
  
  const query: any = { ownerId };
  
  if (type) {
    query.type = type;
  }
  
  if (scope) {
    query.scope = scope;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

AnalyticsSchema.statics.findPublic = function(options: {
  page?: number;
  limit?: number;
  type?: string;
  scope?: string;
} = {}) {
  const { page = 1, limit = 20, type, scope } = options;
  const skip = (page - 1) * limit;
  
  const query: any = { isPublic: true };
  
  if (type) {
    query.type = type;
  }
  
  if (scope) {
    query.scope = scope;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
