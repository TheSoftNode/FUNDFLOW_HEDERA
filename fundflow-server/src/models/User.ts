import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  accountId: string;
  walletType: 'hashpack' | 'metamask' | 'walletconnect';
  role: 'investor' | 'startup';
  profile: {
    name: string;
    email?: string;
    company?: string;
    jobTitle?: string;
    experience?: 'first-time' | 'experienced' | 'veteran';
    bio?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    avatar?: string;
    // Investor-specific fields
    isAccredited?: boolean;
    investmentRange?: {
      min: number;
      max: number;
    };
    investmentFocus?: string[]; // Array of industries/sectors
    // Startup-specific fields
    companyName?: string;
    industry?: string;
    foundedYear?: number;
    teamSize?: number;
    stage?: 'idea' | 'mvp' | 'early-revenue' | 'growth' | 'scale';
  };
  preferences: {
    interests: string[];
    goals: string[];
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'connections';
      showInvestments: boolean;
      showCampaigns: boolean;
    };
  };
  stats: {
    // Investor stats
    totalInvested?: number;
    activeInvestments?: number;
    completedInvestments?: number;
    averageReturn?: number;
    // Startup stats
    totalRaised?: number;
    activeCampaigns?: number;
    completedCampaigns?: number;
    totalInvestors?: number;
  };
  verification: {
    email: {
      verified: boolean;
      verifiedAt?: Date;
    };
    kyc: {
      status: 'pending' | 'approved' | 'rejected' | 'not-started';
      submittedAt?: Date;
      approvedAt?: Date;
      documents?: string[];
    };
  };
  settings: {
    currency: string;
    timezone: string;
    language: string;
    twoFactorEnabled: boolean;
  };
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  walletAddress: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  accountId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  walletType: {
    type: String,
    enum: ['hashpack', 'metamask', 'walletconnect'],
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['investor', 'startup'],
    required: true,
    index: true
  },
  profile: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: 100
    },
    experience: {
      type: String,
      enum: ['first-time', 'experienced', 'veteran']
    },
    bio: {
      type: String,
      maxlength: 500
    },
    website: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      trim: true
    },
    // Investor-specific
    isAccredited: {
      type: Boolean,
      default: false
    },
    investmentRange: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      }
    },
    investmentFocus: [{
      type: String,
      trim: true
    }],
    // Startup-specific
    companyName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    industry: {
      type: String,
      trim: true
    },
    foundedYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear()
    },
    teamSize: {
      type: Number,
      min: 1
    },
    stage: {
      type: String,
      enum: ['idea', 'mvp', 'early-revenue', 'growth', 'scale']
    }
  },
  preferences: {
    interests: [{
      type: String,
      trim: true
    }],
    goals: [{
      type: String,
      trim: true
    }],
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'connections'],
        default: 'public'
      },
      showInvestments: {
        type: Boolean,
        default: true
      },
      showCampaigns: {
        type: Boolean,
        default: true
      }
    }
  },
  stats: {
    // Investor stats
    totalInvested: {
      type: Number,
      default: 0,
      min: 0
    },
    activeInvestments: {
      type: Number,
      default: 0,
      min: 0
    },
    completedInvestments: {
      type: Number,
      default: 0,
      min: 0
    },
    averageReturn: {
      type: Number,
      default: 0
    },
    // Startup stats
    totalRaised: {
      type: Number,
      default: 0,
      min: 0
    },
    activeCampaigns: {
      type: Number,
      default: 0,
      min: 0
    },
    completedCampaigns: {
      type: Number,
      default: 0,
      min: 0
    },
    totalInvestors: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  verification: {
    email: {
      verified: {
        type: Boolean,
        default: false
      },
      verifiedAt: Date
    },
    kyc: {
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'not-started'],
        default: 'not-started'
      },
      submittedAt: Date,
      approvedAt: Date,
      documents: [String]
    }
  },
  settings: {
    currency: {
      type: String,
      default: 'HBAR',
      uppercase: true
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en',
      lowercase: true
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    }
  },
  lastActive: {
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
UserSchema.index({ walletAddress: 1 });
UserSchema.index({ accountId: 1 });
UserSchema.index({ walletType: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'profile.email': 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastActive: -1 });

// Pre-save middleware to update lastActive
UserSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

// Instance methods
UserSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

UserSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  
  // Remove sensitive information
  delete user.verification;
  delete user.settings.twoFactorEnabled;
  
  // Apply privacy settings
  if (user.preferences.privacy.profileVisibility === 'private') {
    return {
      _id: user._id,
      walletAddress: user.walletAddress,
      profile: {
        name: user.profile.name,
        avatar: user.profile.avatar
      },
      role: user.role,
      createdAt: user.createdAt
    };
  }
  
  return user;
};

export default mongoose.model<IUser>('User', UserSchema);