const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { auth } = require('../middleware/auth');

// Get all expenses for a user with filtering and pagination
router.get('/', auth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            startDate,
            endDate,
            minAmount,
            maxAmount,
            tags,
            search,
            sortBy = 'date',
            sortOrder = 'desc'
        } = req.query;
        
        // Build filter query
        const filter = { userId: req.userId };
        
        if (category) filter.category = category;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }
        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount) filter.amount.$gte = parseFloat(minAmount);
            if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
        }
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            filter.tags = { $in: tagArray };
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Build sort options
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        // Execute query with pagination
        const expenses = await Expense.find(filter)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        
        // Get total count for pagination
        const total = await Expense.countDocuments(filter);
        
        // Calculate statistics
        const stats = await Expense.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: '$amount' },
                    averageExpense: { $avg: '$amount' },
                    maxExpense: { $max: '$amount' },
                    minExpense: { $min: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        res.json({
            success: true,
            expenses,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit
            },
            stats: stats[0] || {
                totalExpenses: 0,
                averageExpense: 0,
                maxExpense: 0,
                minExpense: 0,
                count: 0
            }
        });
    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expenses',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get single expense by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }
        
        res.json({
            success: true,
            expense
        });
    } catch (error) {
        console.error('Get expense error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expense',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Create new expense
router.post('/', auth, async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            date,
            description,
            tags,
            isRecurring,
            receiptUrl,
            paymentMethod,
            location
        } = req.body;
        
        // Validate required fields
        if (!title || !amount || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, amount, and category are required'
            });
        }
        
        // Validate amount
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }
        
        const expense = new Expense({
            userId: req.userId,
            title: title.trim(),
            amount: parseFloat(amount),
            category,
            date: date ? new Date(date) : new Date(),
            description: description ? description.trim() : '',
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
            isRecurring: isRecurring || false,
            receiptUrl: receiptUrl || null,
            paymentMethod: paymentMethod || 'cash',
            location: location ? location.trim() : ''
        });
        
        await expense.save();
        
        res.status(201).json({
            success: true,
            message: 'Expense created successfully',
            expense
        });
    } catch (error) {
        console.error('Create expense error:', error);
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
            message: 'Failed to create expense',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Remove userId from updateData to prevent unauthorized changes
        delete updateData.userId;
        
        // Convert amount to number if present
        if (updateData.amount) {
            updateData.amount = parseFloat(updateData.amount);
            if (updateData.amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount must be greater than 0'
                });
            }
        }
        
        // Convert date if present
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        
        // Process tags if present
        if (updateData.tags) {
            updateData.tags = Array.isArray(updateData.tags) 
                ? updateData.tags 
                : updateData.tags.split(',').map(tag => tag.trim());
        }
        
        // Trim string fields
        ['title', 'description', 'location'].forEach(field => {
            if (updateData[field]) {
                updateData[field] = updateData[field].trim();
            }
        });
        
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Expense updated successfully',
            expense
        });
    } catch (error) {
        console.error('Update expense error:', error);
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
            message: 'Failed to update expense',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Expense deleted successfully'
        });
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete expense',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get expense statistics
router.get('/stats/summary', auth, async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        let groupBy;
        switch (period) {
            case 'day':
                groupBy = {
                    $dateToString: { format: '%Y-%m-%d', date: '$date' }
                };
                break;
            case 'week':
                groupBy = {
                    $dateToString: { format: '%Y-%U', date: '$date' }
                };
                break;
            case 'month':
                groupBy = {
                    $dateToString: { format: '%Y-%m', date: '$date' }
                };
                break;
            case 'year':
                groupBy = {
                    $dateToString: { format: '%Y', date: '$date' }
                };
                break;
            default:
                groupBy = {
                    $dateToString: { format: '%Y-%m', date: '$date' }
                };
        }
        
        const stats = await Expense.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: groupBy,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    averageAmount: { $avg: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Category breakdown
        const categoryStats = await Expense.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    averageAmount: { $avg: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);
        
        res.json({
            success: true,
            stats,
            categoryStats
        });
    } catch (error) {
        console.error('Get expense stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expense statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;
