const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { auth } = require('../middleware/auth');

// Get all goals for a user with filtering and pagination
router.get('/', auth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            category,
            priority,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        
        // Build filter query
        const filter = { userId: req.userId };
        
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        
        // Build sort options
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        // Execute query with pagination
        const goals = await Goal.find(filter)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        
        // Get total count for pagination
        const total = await Goal.countDocuments(filter);
        
        // Calculate statistics
        const stats = await Goal.aggregate([
            { $match: { userId: req.userId } },
            {
            $group: {
                _id: null,
                totalGoals: { $sum: 1 },
                activeGoals: {
                $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                },
                completedGoals: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                totalTargetAmount: { $sum: '$targetAmount' },
                totalCurrentAmount: { $sum: '$currentAmount' },
                averageProgress: {
                $avg: {
                    $multiply: [
                    { $divide: ['$currentAmount', '$targetAmount'] },
                    100
                    ]
                }
                }
            }
            }
        ]);
        
        res.json({
            success: true,
            goals,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit
            },
            stats: stats[0] || {
                totalGoals: 0,
                activeGoals: 0,
                completedGoals: 0,
                totalTargetAmount: 0,
                totalCurrentAmount: 0,
                averageProgress: 0
            }
        });
    } catch (error) {
        console.error('Get goals error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch goals',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get single goal by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }
        
        res.json({
            success: true,
            goal
        });
    } catch (error) {
        console.error('Get goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch goal',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Create new goal
router.post('/', auth, async (req, res) => {
    try {
        const {
            title,
            description,
            targetAmount,
            currentAmount,
            deadline,
            category,
            priority,
            milestones,
            tags
        } = req.body;
        
        // Validate required fields
        if (!title || !targetAmount || !deadline) {
            return res.status(400).json({
                success: false,
                message: 'Title, target amount, and deadline are required'
            });
        }
        
        // Validate amounts
        if (targetAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Target amount must be greater than 0'
            });
        }
        
        // Validate deadline
        if (new Date(deadline) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Deadline must be in the future'
            });
        }
        
        // Validate current amount vs target amount
        const currentAmt = parseFloat(currentAmount || 0);
        const targetAmt = parseFloat(targetAmount);
        if (currentAmt > targetAmt) {
            return res.status(400).json({
                success: false,
                message: 'Current amount cannot exceed target amount'
            });
        }
        
        const goal = new Goal({
            userId: req.userId,
            title: title.trim(),
            description: description ? description.trim() : '',
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount || 0),
            deadline: new Date(deadline),
            category: category || 'savings',
            priority: priority || 'medium',
            milestones: milestones || [],
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : []
        });
        
        await goal.save();
        
        res.status(201).json({
            success: true,
            message: 'Goal created successfully',
            goal
        });
    } catch (error) {
        console.error('Create goal error:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create goal',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Update goal
router.put('/:id', auth, async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Remove userId from updateData to prevent unauthorized changes
        delete updateData.userId;
        
        // Convert amounts to numbers if present
        if (updateData.targetAmount) {
            updateData.targetAmount = parseFloat(updateData.targetAmount);
            if (updateData.targetAmount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Target amount must be greater than 0'
                });
            }
        }
        
        if (updateData.currentAmount !== undefined) {
            updateData.currentAmount = parseFloat(updateData.currentAmount);
            if (updateData.currentAmount < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Current amount cannot be negative'
                });
            }
            
            // Check if currentAmount exceeds targetAmount
            const targetAmt = updateData.targetAmount || (await Goal.findById(req.params.id)).targetAmount;
            if (updateData.currentAmount > targetAmt) {
                return res.status(400).json({
                    success: false,
                    message: 'Current amount cannot exceed target amount'
                });
            }
        }
        
        // Convert date if present
        if (updateData.deadline) {
            updateData.deadline = new Date(updateData.deadline);
            if (updateData.deadline <= new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Deadline must be in the future'
                });
            }
        }
        
        // Process tags if present
        if (updateData.tags) {
            updateData.tags = Array.isArray(updateData.tags) 
                ? updateData.tags 
                : updateData.tags.split(',').map(tag => tag.trim());
        }
        
        // Trim string fields
        ['title', 'description'].forEach(field => {
            if (updateData[field]) {
                updateData[field] = updateData[field].trim();
            }
        });
        
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true, runValidators: false }
        );
        
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Goal updated successfully',
            goal
        });
    } catch (error) {
        console.error('Update goal error:', error);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update goal',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Delete goal
router.delete('/:id', auth, async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Goal deleted successfully'
        });
    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete goal',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Add funds to goal
router.patch('/:id/add-funds', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }
        
        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }
        
        // Use the instance method to add funds
        await goal.addFunds(parseFloat(amount));
        
        res.json({
            success: true,
            message: `Added ${amount} to goal successfully`,
            goal
        });
    } catch (error) {
        console.error('Add funds error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add funds to goal',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Withdraw funds from goal
router.patch('/:id/withdraw-funds', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }
        
        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }
        
        if (goal.currentAmount < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient funds in goal'
            });
        }
        
        goal.currentAmount -= parseFloat(amount);
        await goal.save();
        
        res.json({
            success: true,
            message: `Withdrew ${amount} from goal successfully`,
            goal
        });
    } catch (error) {
        console.error('Withdraw funds error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to withdraw funds from goal',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Update goal status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['active', 'completed', 'paused', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: active, completed, paused, or cancelled'
            });
        }
        
        const updateData = { status };
        
        if (status === 'completed') {
            updateData.completedAt = new Date();
            updateData.currentAmount = goal.targetAmount; // Auto-complete to 100%
        }
        
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }
        
        res.json({
            success: true,
            message: `Goal status updated to ${status}`,
            goal
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update goal status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get goal statistics
router.get('/stats/summary', auth, async (req, res) => {
    try {
        const stats = await Goal.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: null,
                    totalGoals: { $sum: 1 },
                    activeGoals: {
                        $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                    },
                    completedGoals: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    pausedGoals: {
                        $sum: { $cond: [{ $eq: ['$status', 'paused'] }, 1, 0] }
                    },
                    totalTargetAmount: { $sum: '$targetAmount' },
                    totalCurrentAmount: { $sum: '$currentAmount' },
                    averageProgress: {
                        $avg: {
                            $multiply: [
                                { $divide: ['$currentAmount', '$targetAmount'] },
                                100
                            ]
                        }
                    }
                }
            }
        ]);
        
        // Category breakdown
        const categoryStats = await Goal.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalTargetAmount: { $sum: '$targetAmount' },
                    totalCurrentAmount: { $sum: '$currentAmount' },
                    averageProgress: {
                        $avg: {
                            $multiply: [
                                { $divide: ['$currentAmount', '$targetAmount'] },
                                100
                            ]
                        }
                    }
                }
            },
            { $sort: { totalTargetAmount: -1 } }
        ]);
        
        // Priority breakdown
        const priorityStats = await Goal.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 },
                    totalTargetAmount: { $sum: '$targetAmount' },
                    totalCurrentAmount: { $sum: '$currentAmount' }
                }
            },
            { $sort: { count: -1 } }
        ]);
        
        res.json({
            success: true,
            stats: stats[0] || {
                totalGoals: 0,
                activeGoals: 0,
                completedGoals: 0,
                pausedGoals: 0,
                totalTargetAmount: 0,
                totalCurrentAmount: 0,
                averageProgress: 0
            },
            categoryStats,
            priorityStats
        });
    } catch (error) {
        console.error('Get goal stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch goal statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;
