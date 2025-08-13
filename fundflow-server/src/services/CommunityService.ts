import Community, { ICommunity, ICommunityEvent, ICommunityDiscussion, ICommunityMember } from '../models/Community';
import User from '../models/User';
import { logger } from '../utils/logger';

export interface CreateCommunityData {
    name: string;
    description: string;
    type: 'general' | 'investor-focused' | 'startup-focused' | 'industry-specific' | 'geographic';
    focus: string[];
    geographicScope: {
        type: 'local' | 'regional' | 'national' | 'international';
        regions?: string[];
        countries?: string[];
    };
    isPublic: boolean;
    requiresApproval: boolean;
    maxMembers?: number;
    settings?: {
        allowMemberInvites: boolean;
        allowEventCreation: boolean;
        allowDiscussionCreation: boolean;
        moderationLevel: 'open' | 'moderated' | 'restricted';
        autoApproveMembers: boolean;
        maxEventsPerMonth: number;
        maxDiscussionsPerDay: number;
    };
    logo?: string;
    banner?: string;
    colors?: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

export interface CreateEventData {
    communityId: string;
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
        coordinates?: [number, number];
    };
    capacity: number;
    organizers: string[];
    tags: string[];
    registrationDeadline: Date;
    isPublic: boolean;
    coverImage?: string;
}

export interface CreateDiscussionData {
    communityId: string;
    title: string;
    content: string;
    authorId: string;
    category: 'general' | 'investment' | 'startup' | 'technology' | 'market' | 'regulatory';
    tags: string[];
}

export interface CommunityFilters {
    page?: number;
    limit?: number;
    type?: string;
    focus?: string[];
    geographicScope?: string;
    isPublic?: boolean;
    memberCount?: { min?: number; max?: number };
}

export interface EventFilters {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    location?: string;
    tags?: string[];
}

export interface DiscussionFilters {
    page?: number;
    limit?: number;
    category?: string;
    tags?: string[];
    authorId?: string;
    isPinned?: boolean;
}

export class CommunityService {
    constructor() {
        logger.info('CommunityService initialized');
    }

    // ==================== COMMUNITY CREATION & MANAGEMENT ====================

    /**
     * Create a new community
     */
    async createCommunity(data: CreateCommunityData, creatorId: string): Promise<ICommunity> {
        try {
            // Validate creator exists
            const creator = await User.findById(creatorId);
            if (!creator) {
                throw new Error('Community creator not found');
            }

            // Generate unique slug
            const slug = await this.generateUniqueSlug(data.name);

            const community = new Community({
                ...data,
                slug,
                members: [{
                    userId: creatorId,
                    role: 'admin',
                    joinedAt: new Date(),
                    lastActive: new Date(),
                    contributionScore: 0,
                    badges: []
                }],
                memberCount: 1,
                settings: {
                    allowMemberInvites: true,
                    allowEventCreation: true,
                    allowDiscussionCreation: true,
                    moderationLevel: 'moderated',
                    autoApproveMembers: false,
                    maxEventsPerMonth: 10,
                    maxDiscussionsPerDay: 5,
                    ...data.settings
                },
                metrics: {
                    totalEvents: 0,
                    totalDiscussions: 0,
                    activeMembers: 1,
                    averageEngagement: 0,
                    growthRate: 0
                }
            });

            const savedCommunity = await community.save();
            logger.info(`Community created: ${slug} by ${creatorId}`);

            return savedCommunity;
        } catch (error) {
            logger.error('Error creating community:', error);
            throw error;
        }
    }

    /**
     * Get communities with filters
     */
    async getCommunities(filters: CommunityFilters = {}): Promise<{ communities: ICommunity[]; total: number; page: number; totalPages: number }> {
        try {
            const { page = 1, limit = 20, type, focus, geographicScope, isPublic, memberCount } = filters;
            const skip = (page - 1) * limit;

            const query: any = {};

            if (type) {
                query.type = type;
            }

            if (focus && focus.length > 0) {
                query.focus = { $in: focus };
            }

            if (geographicScope) {
                query['geographicScope.type'] = geographicScope;
            }

            if (isPublic !== undefined) {
                query.isPublic = isPublic;
            }

            if (memberCount) {
                if (memberCount.min !== undefined) {
                    query.memberCount = { $gte: memberCount.min };
                }
                if (memberCount.max !== undefined) {
                    query.memberCount = { ...query.memberCount, $lte: memberCount.max };
                }
            }

            const [communities, total] = await Promise.all([
                Community.find(query)
                    .sort({ memberCount: -1, lastActivity: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('members.userId', 'profile.name profile.avatar role'),
                Community.countDocuments(query)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                communities,
                total,
                page,
                totalPages
            };
        } catch (error) {
            logger.error('Error fetching communities:', error);
            throw error;
        }
    }

    /**
     * Get community by slug
     */
    async getCommunityBySlug(slug: string): Promise<ICommunity | null> {
        try {
            const community = await Community.findOne({ slug })
                .populate('members.userId', 'profile.name profile.avatar role')
                .populate('events.organizers', 'profile.name profile.avatar')
                .populate('discussions.authorId', 'profile.name profile.avatar');

            return community;
        } catch (error) {
            logger.error('Error fetching community by slug:', error);
            throw error;
        }
    }

    /**
     * Update community
     */
    async updateCommunity(communityId: string, updates: Partial<ICommunity>, userId: string): Promise<ICommunity> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            // Check if user is admin
            const member = community.members.find(m => m.userId.toString() === userId);
            if (!member || member.role !== 'admin') {
                throw new Error('Admin access required');
            }

            const updatedCommunity = await Community.findByIdAndUpdate(
                communityId,
                { ...updates, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!updatedCommunity) {
                throw new Error('Community not found');
            }

            logger.info(`Community updated: ${communityId} by ${userId}`);
            return updatedCommunity;
        } catch (error) {
            logger.error('Error updating community:', error);
            throw error;
        }
    }

    // ==================== MEMBERSHIP MANAGEMENT ====================

    /**
     * Add member to community
     */
    async addMember(communityId: string, userId: string, role: string = 'member'): Promise<ICommunity> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            // Check if user is already a member
            const existingMember = community.members.find(m => m.userId.toString() === userId);
            if (existingMember) {
                throw new Error('User is already a member');
            }

            // Check if community is full
            if (community.maxMembers && community.memberCount >= community.maxMembers) {
                throw new Error('Community is at maximum capacity');
            }

            const updatedCommunity = await community.addMember(userId, role);
            logger.info(`Member added to community: ${userId} -> ${communityId}`);

            return updatedCommunity;
        } catch (error) {
            logger.error('Error adding member to community:', error);
            throw error;
        }
    }

    /**
     * Remove member from community
     */
    async removeMember(communityId: string, userId: string, adminId: string): Promise<ICommunity> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            // Check if user is admin
            const adminMember = community.members.find(m => m.userId.toString() === adminId);
            if (!adminMember || adminMember.role !== 'admin') {
                throw new Error('Admin access required');
            }

            // Prevent admin from removing themselves if they're the only admin
            if (userId === adminId) {
                const adminCount = community.members.filter(m => m.role === 'admin').length;
                if (adminCount === 1) {
                    throw new Error('Cannot remove the only admin from community');
                }
            }

            const updatedCommunity = await community.removeMember(userId);
            logger.info(`Member removed from community: ${userId} <- ${communityId}`);

            return updatedCommunity;
        } catch (error) {
            logger.error('Error removing member from community:', error);
            throw error;
        }
    }

    /**
     * Update member role
     */
    async updateMemberRole(communityId: string, userId: string, newRole: string, adminId: string): Promise<ICommunity> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            // Check if user is admin
            const adminMember = community.members.find(m => m.userId.toString() === adminId);
            if (!adminMember || adminMember.role !== 'admin') {
                throw new Error('Admin access required');
            }

            const updatedCommunity = await community.updateMemberRole(userId, newRole);
            logger.info(`Member role updated: ${userId} -> ${newRole} in ${communityId}`);

            return updatedCommunity;
        } catch (error) {
            logger.error('Error updating member role:', error);
            throw error;
        }
    }

    /**
     * Get community members
     */
    async getCommunityMembers(communityId: string, filters: { page?: number; limit?: number; role?: string } = {}): Promise<{ members: ICommunityMember[]; total: number; page: number; totalPages: number }> {
        try {
            const { page = 1, limit = 20, role } = filters;
            const skip = (page - 1) * limit;

            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            let members = community.members;

            if (role) {
                members = members.filter(m => m.role === role);
            }

            const total = members.length;
            const paginatedMembers = members.slice(skip, skip + limit);
            const totalPages = Math.ceil(total / limit);

            // Populate user details
            const populatedMembers = await Promise.all(
                paginatedMembers.map(async (member) => {
                    const user = await User.findById(member.userId).select('profile.name profile.avatar role');
                    return {
                        ...member.toObject(),
                        user
                    };
                })
            );

            return {
                members: populatedMembers,
                total,
                page,
                totalPages
            };
        } catch (error) {
            logger.error('Error fetching community members:', error);
            throw error;
        }
    }

    // ==================== EVENT MANAGEMENT ====================

    /**
     * Create community event
     */
    async createEvent(communityId: string, data: CreateEventData): Promise<ICommunity> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            // Check if user can create events
            if (!community.settings.allowEventCreation) {
                throw new Error('Event creation is not allowed in this community');
            }

            // Check monthly event limit
            const currentMonth = new Date();
            currentMonth.setMonth(currentMonth.getMonth() - 1);
            const monthlyEvents = community.events.filter(e => e.createdAt > currentMonth);
            if (monthlyEvents.length >= community.settings.maxEventsPerMonth) {
                throw new Error('Monthly event limit reached');
            }

            const event: ICommunityEvent = {
                title: data.title,
                description: data.description,
                type: data.type,
                startDate: data.startDate,
                endDate: data.endDate,
                location: data.location,
                capacity: data.capacity,
                registeredAttendees: [],
                organizers: data.organizers.map(id => new (require('mongoose').Types.ObjectId)(id)),
                tags: data.tags,
                status: 'draft',
                registrationDeadline: data.registrationDeadline,
                isPublic: data.isPublic,
                coverImage: data.coverImage,
                attachments: []
            };

            community.events.push(event);
            community.metrics.totalEvents = community.events.length;
            community.lastActivity = new Date();

            const updatedCommunity = await community.save();
            logger.info(`Event created in community: ${data.title} in ${communityId}`);

            return updatedCommunity;
        } catch (error) {
            logger.error('Error creating community event:', error);
            throw error;
        }
    }

    /**
     * Get community events
     */
    async getCommunityEvents(communityId: string, filters: EventFilters = {}): Promise<{ events: ICommunityEvent[]; total: number; page: number; totalPages: number }> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            const { page = 1, limit = 20, type, status, startDate, endDate, location, tags } = filters;
            const skip = (page - 1) * limit;

            let events = community.events;

            // Apply filters
            if (type) {
                events = events.filter(e => e.type === type);
            }

            if (status) {
                events = events.filter(e => e.status === status);
            }

            if (startDate) {
                events = events.filter(e => e.startDate >= startDate);
            }

            if (endDate) {
                events = events.filter(e => e.endDate <= endDate);
            }

            if (location) {
                events = events.filter(e =>
                    e.location.city?.toLowerCase().includes(location.toLowerCase()) ||
                    e.location.country?.toLowerCase().includes(location.toLowerCase())
                );
            }

            if (tags && tags.length > 0) {
                events = events.filter(e => e.tags.some(tag => tags.includes(tag)));
            }

            const total = events.length;
            const paginatedEvents = events.slice(skip, skip + limit);
            const totalPages = Math.ceil(total / limit);

            // Populate organizer details
            const populatedEvents = await Promise.all(
                paginatedEvents.map(async (event) => {
                    const organizers = await Promise.all(
                        event.organizers.map(async (id) => {
                            const user = await User.findById(id).select('profile.name profile.avatar');
                            return user;
                        })
                    );
                    return {
                        ...event.toObject(),
                        organizers
                    };
                })
            );

            return {
                events: populatedEvents,
                total,
                page,
                totalPages
            };
        } catch (error) {
            logger.error('Error fetching community events:', error);
            throw error;
        }
    }

    /**
     * Register for event
     */
    async registerForEvent(communityId: string, eventIndex: number, userId: string): Promise<ICommunity> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            const event = community.events[eventIndex];
            if (!event) {
                throw new Error('Event not found');
            }

            if (event.status !== 'published') {
                throw new Error('Event is not open for registration');
            }

            if (event.registeredAttendees.length >= event.capacity) {
                throw new Error('Event is at full capacity');
            }

            if (event.registrationDeadline < new Date()) {
                throw new Error('Registration deadline has passed');
            }

            if (event.registeredAttendees.some(id => id.toString() === userId)) {
                throw new Error('User is already registered for this event');
            }

            event.registeredAttendees.push(new (require('mongoose').Types.ObjectId)(userId));
            community.lastActivity = new Date();

            const updatedCommunity = await community.save();
            logger.info(`User registered for event: ${userId} -> ${event.title}`);

            return updatedCommunity;
        } catch (error) {
            logger.error('Error registering for event:', error);
            throw error;
        }
    }

    // ==================== DISCUSSION MANAGEMENT ====================

    /**
     * Create community discussion
     */
    async createDiscussion(communityId: string, data: CreateDiscussionData): Promise<ICommunity> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            // Check if user can create discussions
            if (!community.settings.allowDiscussionCreation) {
                throw new Error('Discussion creation is not allowed in this community');
            }

            // Check daily discussion limit
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dailyDiscussions = community.discussions.filter(d => d.createdAt >= today);
            if (dailyDiscussions.length >= community.settings.maxDiscussionsPerDay) {
                throw new Error('Daily discussion limit reached');
            }

            const discussion: ICommunityDiscussion = {
                title: data.title,
                content: data.content,
                authorId: new (require('mongoose').Types.ObjectId)(data.authorId),
                category: data.category,
                tags: data.tags,
                likes: [],
                replies: [],
                isPinned: false,
                isLocked: false,
                viewCount: 0,
                lastActivity: new Date()
            };

            community.discussions.push(discussion);
            community.metrics.totalDiscussions = community.discussions.length;
            community.lastActivity = new Date();

            const updatedCommunity = await community.save();
            logger.info(`Discussion created in community: ${data.title} in ${communityId}`);

            return updatedCommunity;
        } catch (error) {
            logger.error('Error creating community discussion:', error);
            throw error;
        }
    }

    /**
     * Get community discussions
     */
    async getCommunityDiscussions(communityId: string, filters: DiscussionFilters = {}): Promise<{ discussions: ICommunityDiscussion[]; total: number; page: number; totalPages: number }> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            const { page = 1, limit = 20, category, tags, authorId, isPinned } = filters;
            const skip = (page - 1) * limit;

            let discussions = community.discussions;

            // Apply filters
            if (category) {
                discussions = discussions.filter(d => d.category === category);
            }

            if (tags && tags.length > 0) {
                discussions = discussions.filter(d => d.tags.some(tag => tags.includes(tag)));
            }

            if (authorId) {
                discussions = discussions.filter(d => d.authorId.toString() === authorId);
            }

            if (isPinned !== undefined) {
                discussions = discussions.filter(d => d.isPinned === isPinned);
            }

            // Sort: pinned first, then by last activity
            discussions.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return b.lastActivity.getTime() - a.lastActivity.getTime();
            });

            const total = discussions.length;
            const paginatedDiscussions = discussions.slice(skip, skip + limit);
            const totalPages = Math.ceil(total / limit);

            // Populate author details
            const populatedDiscussions = await Promise.all(
                paginatedDiscussions.map(async (discussion) => {
                    const author = await User.findById(discussion.authorId).select('profile.name profile.avatar');
                    return {
                        ...discussion.toObject(),
                        author
                    };
                })
            );

            return {
                discussions: populatedDiscussions,
                total,
                page,
                totalPages
            };
        } catch (error) {
            logger.error('Error fetching community discussions:', error);
            throw error;
        }
    }

    /**
     * Add reply to discussion
     */
    async addReply(communityId: string, discussionIndex: number, authorId: string, content: string): Promise<ICommunity> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            const discussion = community.discussions[discussionIndex];
            if (!discussion) {
                throw new Error('Discussion not found');
            }

            if (discussion.isLocked) {
                throw new Error('Discussion is locked');
            }

            discussion.replies.push({
                authorId: new (require('mongoose').Types.ObjectId)(authorId),
                content,
                likes: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });

            discussion.lastActivity = new Date();
            community.lastActivity = new Date();

            const updatedCommunity = await community.save();
            logger.info(`Reply added to discussion: ${authorId} -> ${discussion.title}`);

            return updatedCommunity;
        } catch (error) {
            logger.error('Error adding reply to discussion:', error);
            throw error;
        }
    }

    // ==================== COMMUNITY ANALYTICS ====================

    /**
     * Get community analytics
     */
    async getCommunityAnalytics(communityId: string): Promise<any> {
        try {
            const community = await Community.findById(communityId);
            if (!community) {
                throw new Error('Community not found');
            }

            // Calculate engagement metrics
            const totalInteractions = community.discussions.reduce((sum, d) =>
                sum + d.likes.length + d.replies.length, 0
            );

            const averageEngagement = community.memberCount > 0 ?
                totalInteractions / community.memberCount : 0;

            // Calculate growth rate (members per month)
            const now = new Date();
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            const recentMembers = community.members.filter(m => m.joinedAt >= threeMonthsAgo);
            const growthRate = recentMembers.length / 3; // per month

            return {
                memberCount: community.memberCount,
                totalEvents: community.metrics.totalEvents,
                totalDiscussions: community.metrics.totalDiscussions,
                activeMembers: community.metrics.activeMembers,
                averageEngagement,
                growthRate,
                memberBreakdown: {
                    admins: community.members.filter(m => m.role === 'admin').length,
                    moderators: community.members.filter(m => m.role === 'moderator').length,
                    members: community.members.filter(m => m.role === 'member').length
                },
                recentActivity: {
                    lastEvent: community.events.length > 0 ?
                        Math.max(...community.events.map(e => e.createdAt.getTime())) : null,
                    lastDiscussion: community.discussions.length > 0 ?
                        Math.max(...community.discussions.map(d => d.lastActivity.getTime())) : null
                }
            };
        } catch (error) {
            logger.error('Error getting community analytics:', error);
            throw error;
        }
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Generate unique community slug
     */
    private async generateUniqueSlug(name: string): Promise<string> {
        let slug = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        let counter = 1;
        let uniqueSlug = slug;

        while (await Community.findOne({ slug: uniqueSlug })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        return uniqueSlug;
    }
}

export const communityService = new CommunityService();
export default communityService;
