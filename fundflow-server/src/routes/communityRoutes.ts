import { Router } from 'express';
import { CommunityController } from '../controllers/CommunityController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// ==================== COMMUNITY RETRIEVAL ====================

/**
 * @route   GET /api/communities
 * @desc    Get all communities
 * @access  Public
 */
router.get('/', CommunityController.getCommunities);

/**
 * @route   GET /api/communities/:slug
 * @desc    Get community by slug
 * @access  Public
 */
router.get('/:slug', CommunityController.getCommunityBySlug);

/**
 * @route   GET /api/communities/:slug/members
 * @desc    Get community members
 * @access  Public
 */
router.get('/:slug/members', CommunityController.getCommunityMembers);

/**
 * @route   GET /api/communities/:slug/events
 * @desc    Get community events
 * @access  Public
 */
router.get('/:slug/events', CommunityController.getCommunityEvents);

/**
 * @route   GET /api/communities/:slug/discussions
 * @desc    Get community discussions
 * @access  Public
 */
router.get('/:slug/discussions', CommunityController.getCommunityDiscussions);

// ==================== COMMUNITY MANAGEMENT ====================

/**
 * @route   POST /api/communities
 * @desc    Create a new community
 * @access  Private
 */
router.post('/', authenticateToken, CommunityController.createCommunity);

/**
 * @route   PUT /api/communities/:slug
 * @desc    Update community
 * @access  Private (Admin/Moderator only)
 */
router.put('/:slug', authenticateToken, CommunityController.updateCommunity);

// ==================== COMMUNITY MEMBERSHIP ====================

/**
 * @route   POST /api/communities/:slug/join
 * @desc    Join community
 * @access  Private
 */
router.post('/:slug/join', authenticateToken, CommunityController.joinCommunity);

/**
 * @route   POST /api/communities/:slug/leave
 * @desc    Leave community
 * @access  Private
 */
router.post('/:slug/leave', authenticateToken, CommunityController.leaveCommunity);

// ==================== COMMUNITY EVENTS ====================

/**
 * @route   POST /api/communities/:slug/events
 * @desc    Create community event
 * @access  Private
 */
router.post('/:slug/events', authenticateToken, CommunityController.createEvent);

/**
 * @route   POST /api/communities/:slug/events/:eventId/register
 * @desc    Register for community event
 * @access  Private
 */
router.post('/:slug/events/:eventId/register', authenticateToken, CommunityController.registerForEvent);

// ==================== COMMUNITY DISCUSSIONS ====================

/**
 * @route   POST /api/communities/:slug/discussions
 * @desc    Create community discussion
 * @access  Private
 */
router.post('/:slug/discussions', authenticateToken, CommunityController.createDiscussion);

/**
 * @route   POST /api/communities/:slug/discussions/:discussionId/replies
 * @desc    Add reply to discussion
 * @access  Private
 */
router.post('/:slug/discussions/:discussionId/replies', authenticateToken, CommunityController.addReply);

// ==================== COMMUNITY ANALYTICS ====================

/**
 * @route   GET /api/communities/:slug/analytics
 * @desc    Get community analytics
 * @access  Private (Admin/Moderator only)
 */
router.get('/:slug/analytics', authenticateToken, CommunityController.getCommunityAnalytics);

export default router;
