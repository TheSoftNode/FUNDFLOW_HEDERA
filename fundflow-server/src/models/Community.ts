import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityMember {
  userId: mongoose.Types.ObjectId;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: Date;
  lastActive: Date;
  contributionScore: number;
  badges: string[];
}

export interface ICommunityEvent {
  title: string;
  description: string;
  type: 'meetup' | 'webinar' | 'conference' | 'workshop' | 'networking' | 'pitch-day';
  startDate: Date;
  endDate: Date;
  location: {
    type: 'physical' | 'virtual' | 'hybrid';
    address?: string;
    city?: string;
    country?: string;
    virtualUrl?: string;
    coordinates?: [number, number]; // [longitude, latitude]
  };
  capacity: number;
  registeredAttendees: mongoose.Types.ObjectId[];
  organizers: mongoose.Types.ObjectId[];
  tags: string[];
  status: 'draft' | 'published' | 'registration-closed' | 'cancelled' | 'completed';
  registrationDeadline: Date;
  isPublic: boolean;
  coverImage?: string;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export interface ICommunityDiscussion {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  category: 'general' | 'investment' | 'startup' | 'technology' | 'market' | 'regulatory';
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  replies: Array<{
    authorId: mongoose.Types.ObjectId;
    content: string;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
  }>;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  lastActivity: Date;
}

export interface ICommunity extends Document {
  // Basic information
  name: string;
  description: string;
  slug: string;
  
  // Community type and focus
  type: 'general' | 'investor-focused' | 'startup-focused' | 'industry-specific' | 'geographic';
  focus: string[]; // Industries, technologies, or focus areas
  geographicScope: {
    type: 'local' | 'regional' | 'national' | 'international';
    regions?: string[];
    countries?: string[];
  };
  
  // Membership
  members: ICommunityMember[];
  memberCount: number;
  maxMembers?: number;
  isPublic: boolean;
  requiresApproval: boolean;
  
  // Content and activities
  events: ICommunityEvent[];
  discussions: ICommunityDiscussion[];
  
  // Community settings
  settings: {
    allowMemberInvites: boolean;
    allowEventCreation: boolean;
    allowDiscussionCreation: boolean;
    moderationLevel: 'open' | 'moderated' | 'restricted';
    autoApproveMembers: boolean;
    maxEventsPerMonth: number;
    maxDiscussionsPerDay: number;
  };
  
  // Community metrics
  metrics: {
    totalEvents: number;
    totalDiscussions: number;
    activeMembers: number;
    averageEngagement: number;
    growthRate: number;
  };
  
  // Media and branding
  logo?: string;
  banner?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
}

const CommunityMemberSchema = new Schema<ICommunityMember>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'moderator', 'admin'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  contributionScore: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [String]
});

const CommunityEventSchema = new Schema<ICommunityEvent>({
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
  type: {
    type: String,
    enum: ['meetup', 'webinar', 'conference', 'workshop', 'networking', 'pitch-day'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['physical', 'virtual', 'hybrid'],
      required: true
    },
    address: String,
    city: String,
    country: String,
    virtualUrl: String,
    coordinates: [Number]
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  registeredAttendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  organizers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'registration-closed', 'cancelled', 'completed'],
    default: 'draft'
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  coverImage: String,
  attachments: [{
    name: String,
    url: String,
    type: String
  }]
});

const CommunityDiscussionSchema = new Schema<ICommunityDiscussion>({
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
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'investment', 'startup', 'technology', 'market', 'regulatory'],
    required: true
  },
  tags: [String],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

const CommunitySchema = new Schema<ICommunity>({
  // Basic information
  name: {
    type: String,
    required: true,
    maxlength: 100,
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Community type and focus
  type: {
    type: String,
    enum: ['general', 'investor-focused', 'startup-focused', 'industry-specific', 'geographic'],
    required: true,
    index: true
  },
  focus: [{
    type: String,
    trim: true
  }],
  geographicScope: {
    type: {
      type: String,
      enum: ['local', 'regional', 'national', 'international'],
      required: true
    },
    regions: [String],
    countries: [String]
  },
  
  // Membership
  members: [CommunityMemberSchema],
  memberCount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxMembers: Number,
  isPublic: {
    type: Boolean,
    default: true,
    index: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  
  // Content and activities
  events: [CommunityEventSchema],
  discussions: [CommunityDiscussionSchema],
  
  // Community settings
  settings: {
    allowMemberInvites: {
      type: Boolean,
      default: true
    },
    allowEventCreation: {
      type: Boolean,
      default: true
    },
    allowDiscussionCreation: {
      type: Boolean,
      default: true
    },
    moderationLevel: {
      type: String,
      enum: ['open', 'moderated', 'restricted'],
      default: 'moderated'
    },
    autoApproveMembers: {
      type: Boolean,
      default: false
    },
    maxEventsPerMonth: {
      type: Number,
      default: 10
    },
    maxDiscussionsPerDay: {
      type: Number,
      default: 5
    }
  },
  
  // Community metrics
  metrics: {
    totalEvents: {
      type: Number,
      default: 0,
      min: 0
    },
    totalDiscussions: {
      type: Number,
      default: 0,
      min: 0
    },
    activeMembers: {
      type: Number,
      default: 0,
      min: 0
    },
    averageEngagement: {
      type: Number,
      default: 0,
      min: 0
    },
    growthRate: {
      type: Number,
      default: 0
    }
  },
  
  // Media and branding
  logo: String,
  banner: String,
  colors: {
    primary: {
      type: String,
      default: '#3B82F6'
    },
    secondary: {
      type: String,
      default: '#1E40AF'
    },
    accent: {
      type: String,
      default: '#F59E0B'
    }
  },
  
  // Timestamps
  lastActivity: {
    type: Date,
    default: Date.now
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
CommunitySchema.index({ slug: 1 }, { unique: true });
CommunitySchema.index({ type: 1, focus: 1 });
CommunitySchema.index({ 'geographicScope.type': 1, 'geographicScope.countries': 1 });
CommunitySchema.index({ isPublic: 1, memberCount: -1 });
CommunitySchema.index({ lastActivity: -1 });
CommunitySchema.index({ 'members.userId': 1 });

// Virtual for community status
CommunitySchema.virtual('status').get(function() {
  if (this.memberCount >= (this.maxMembers || Infinity)) {
    return 'full';
  }
  if (this.memberCount < 10) {
    return 'new';
  }
  if (this.memberCount < 50) {
    return 'growing';
  }
  return 'established';
});

// Instance methods
CommunitySchema.methods.addMember = function(userId: string, role: string = 'member') {
  const existingMember = this.members.find((m: any) => m.userId.toString() === userId);
  if (existingMember) {
    throw new Error('User is already a member');
  }
  
  this.members.push({
    userId: new mongoose.Types.ObjectId(userId),
    role,
    joinedAt: new Date(),
    lastActive: new Date(),
    contributionScore: 0,
    badges: []
  });
  
  this.memberCount = this.members.length;
  this.lastActivity = new Date();
  
  return this.save();
};

CommunitySchema.methods.removeMember = function(userId: string) {
  const memberIndex = this.members.findIndex((m: any) => m.userId.toString() === userId);
  if (memberIndex === -1) {
    throw new Error('User is not a member');
  }
  
  this.members.splice(memberIndex, 1);
  this.memberCount = this.members.length;
  this.lastActivity = new Date();
  
  return this.save();
};

CommunitySchema.methods.updateMemberRole = function(userId: string, newRole: string) {
  const member = this.members.find((m: any) => m.userId.toString() === userId);
  if (!member) {
    throw new Error('User is not a member');
  }
  
  member.role = newRole;
  this.lastActivity = new Date();
  
  return this.save();
};

// Static methods
CommunitySchema.statics.findByFocus = function(focus: string[], options: {
  page?: number;
  limit?: number;
  type?: string;
  geographicScope?: string;
} = {}) {
  const { page = 1, limit = 20, type, geographicScope } = options;
  const skip = (page - 1) * limit;
  
  const query: any = { isPublic: true };
  
  if (focus && focus.length > 0) {
    query.focus = { $in: focus };
  }
  
  if (type) {
    query.type = type;
  }
  
  if (geographicScope) {
    query['geographicScope.type'] = geographicScope;
  }
  
  return this.find(query)
    .sort({ memberCount: -1, lastActivity: -1 })
    .skip(skip)
    .limit(limit);
};

export default mongoose.model<ICommunity>('Community', CommunitySchema);
