import { Request, Response } from 'express';
import { CommunityService } from '../services/CommunityService';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

const communityService = new CommunityService();

export class CommunityController {
    /**
     * Get all communities
     */
    static async getCommunities(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, type, focus, geographicScope } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                type: type as string,
                focus: focus as string,
                geographicScope: geographicScope as string
            };

            const communities = await communityService.getCommunities(filters);
            return ApiResponse.success(res, 'Communities retrieved successfully', communities);
        } catch (error) {
            logger.error('Error getting communities:', error);
            return ApiResponse.error(res, 'Failed to retrieve communities', 500);
        }
    }

    /**
     * Get community by slug
     */
    static async getCommunityBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;

            const community = await communityService.getCommunityBySlug(slug);
            if (!community) {
                return ApiResponse.error(res, 'Community not found', 404);
            }

            return ApiResponse.success(res, 'Community retrieved successfully', community);
        } catch (error) {
            logger.error('Error getting community by slug:', error);
            return ApiResponse.error(res, 'Failed to retrieve community', 500);
        }
    }

    /**
     * Create a new community
     */
    static async createCommunity(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                name,
                description,
                type,
                focus,
                geographicScope,
                isPublic = true,
                requiresApproval = false,
                logo,
                banner,
                colors
            } = req.body;

            if (!name || !description || !type || !focus) {
                return ApiResponse.error(res, 'Name, description, type, and focus are required', 400);
            }

            const communityData = {
                name,
                description,
                type,
                focus,
                geographicScope,
                isPublic,
                requiresApproval,
                logo,
                banner,
                colors,
                createdBy: userId
            };

            const community = await communityService.createCommunity(communityData);
            return ApiResponse.success(res, 'Community created successfully', community, 201);
        } catch (error) {
            logger.error('Error creating community:', error);
            return ApiResponse.error(res, 'Failed to create community', 500);
        }
    }

    /**
     * Update community
     */
    static async updateCommunity(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const community = await communityService.getCommunityBySlug(slug);
            if (!community) {
                return ApiResponse.error(res, 'Community not found', 404);
            }

            // Check if user is admin or moderator of this community
            const member = community.members.find(m => m.userId.toString() === userId);
            if (!member || !['admin', 'moderator'].includes(member.role)) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            const updateData = req.body;
            const updatedCommunity = await communityService.updateCommunity(slug, updateData);
            return ApiResponse.success(res, 'Community updated successfully', updatedCommunity);
        } catch (error) {
            logger.error('Error updating community:', error);
            return ApiResponse.error(res, 'Failed to update community', 500);
        }
    }

    /**
     * Join community
     */
    static async joinCommunity(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { role = 'member', bio } = req.body;

            const community = await communityService.addMember(slug, userId, role, bio);
            return ApiResponse.success(res, 'Successfully joined community', community);
        } catch (error) {
            logger.error('Error joining community:', error);
            return ApiResponse.error(res, 'Failed to join community', 500);
        }
    }

    /**
     * Leave community
     */
    static async leaveCommunity(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const community = await communityService.removeMember(slug, userId);
            return ApiResponse.success(res, 'Successfully left community', community);
        } catch (error) {
            logger.error('Error leaving community:', error);
            return ApiResponse.error(res, 'Failed to leave community', 500);
        }
    }

    /**
     * Get community members
     */
    static async getCommunityMembers(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const { page = 1, limit = 20, role } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                role: role as string
            };

            const members = await communityService.getCommunityMembers(slug, filters);
            return ApiResponse.success(res, 'Community members retrieved successfully', members);
        } catch (error) {
            logger.error('Error getting community members:', error);
            return ApiResponse.error(res, 'Failed to retrieve community members', 500);
        }
    }

    /**
     * Create community event
     */
    static async createEvent(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                title,
                description,
                startDate,
                endDate,
                location,
                maxAttendees,
                eventType,
                isPublic = true
            } = req.body;

            if (!title || !description || !startDate || !endDate) {
                return ApiResponse.error(res, 'Title, description, start date, and end date are required', 400);
            }

            const eventData = {
                title,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                location,
                maxAttendees,
                eventType,
                isPublic,
                createdBy: userId
            };

            const community = await communityService.createEvent(slug, eventData);
            return ApiResponse.success(res, 'Event created successfully', community, 201);
        } catch (error) {
            logger.error('Error creating community event:', error);
            return ApiResponse.error(res, 'Failed to create event', 500);
        }
    }

    /**
     * Get community events
     */
    static async getCommunityEvents(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const { page = 1, limit = 10, eventType, upcoming = true } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                eventType: eventType as string,
                upcoming: upcoming === 'true'
            };

            const events = await communityService.getCommunityEvents(slug, filters);
            return ApiResponse.success(res, 'Community events retrieved successfully', events);
        } catch (error) {
            logger.error('Error getting community events:', error);
            return ApiResponse.error(res, 'Failed to retrieve community events', 500);
        }
    }

    /**
     * Register for community event
     */
    static async registerForEvent(req: Request, res: Response) {
        try {
            const { slug, eventId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const community = await communityService.registerForEvent(slug, eventId, userId);
            return ApiResponse.success(res, 'Successfully registered for event', community);
        } catch (error) {
            logger.error('Error registering for event:', error);
            return ApiResponse.error(res, 'Failed to register for event', 500);
        }
    }

    /**
     * Create community discussion
     */
    static async createDiscussion(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { title, content, tags = [], isPinned = false } = req.body;

            if (!title || !content) {
                return ApiResponse.error(res, 'Title and content are required', 400);
            }

            const discussionData = {
                title,
                content,
                tags,
                isPinned,
                createdBy: userId
            };

            const community = await communityService.createDiscussion(slug, discussionData);
            return ApiResponse.success(res, 'Discussion created successfully', community, 201);
        } catch (error) {
            logger.error('Error creating community discussion:', error);
            return ApiResponse.error(res, 'Failed to create discussion', 500);
        }
    }

    /**
     * Get community discussions
     */
    static async getCommunityDiscussions(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const { page = 1, limit = 10, sortBy = 'latest', tags } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                sortBy: sortBy as string,
                tags: tags ? (tags as string).split(',') : undefined
            };

            const discussions = await communityService.getCommunityDiscussions(slug, filters);
            return ApiResponse.success(res, 'Community discussions retrieved successfully', discussions);
        } catch (error) {
            logger.error('Error getting community discussions:', error);
            return ApiResponse.error(res, 'Failed to retrieve community discussions', 500);
        }
    }

    /**
     * Add reply to discussion
     */
    static async addReply(req: Request, res: Response) {
        try {
            const { slug, discussionId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { content } = req.body;

            if (!content) {
                return ApiResponse.error(res, 'Content is required', 400);
            }

            const community = await communityService.addReply(slug, discussionId, userId, content);
            return ApiResponse.success(res, 'Reply added successfully', community);
        } catch (error) {
            logger.error('Error adding reply:', error);
            return ApiResponse.error(res, 'Failed to add reply', 500);
        }
    }

    /**
     * Get community analytics
     */
    static async getCommunityAnalytics(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const community = await communityService.getCommunityBySlug(slug);
            if (!community) {
                return ApiResponse.error(res, 'Community not found', 404);
            }

            // Check if user is admin or moderator of this community
            const member = community.members.find(m => m.userId.toString() === userId);
            if (!member || !['admin', 'moderator'].includes(member.role)) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            const analytics = await communityService.getCommunityAnalytics(slug);
            return ApiResponse.success(res, 'Community analytics retrieved successfully', analytics);
        } catch (error) {
            logger.error('Error getting community analytics:', error);
            return ApiResponse.error(res, 'Failed to retrieve community analytics', 500);
        }
    }
}
