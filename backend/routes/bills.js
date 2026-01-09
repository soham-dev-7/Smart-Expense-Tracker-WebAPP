const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const { auth } = require('../middleware/auth');

// Get all bills for a user with filtering and pagination
router.get('/', auth, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            frequency,
            isActive,
            isOverdue,
            isDueSoon,
            sortBy = 'dueDate',
            sortOrder = 'asc'
        } = req.query;
        
        // Build filter query
        const filter = { userId: req.userId };
        
        if (category) filter.category = category;
        if (frequency) filter.frequency = frequency;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        
        // Additional filters for overdue and due soon
        if (isOverdue === 'true') {
            filter.dueDate = { $lt: new Date() };
            filter.isActive = true;
        }
        
        if (isDueSoon === 'true') {
            const dueSoonDate = new Date();
            dueSoonDate.setDate(dueSoonDate.getDate() + 7); // Next 7 days
            filter.dueDate = {
                $gte: new Date(),
                $lte: dueSoonDate
            };
            filter.isActive = true;
        }
        
        // Build sort options
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        // Execute query with pagination
        const bills = await Bill.find(filter)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        
        // Get total count for pagination
        const total = await Bill.countDocuments(filter);
        
        // Calculate statistics
        const stats = await Bill.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: null,
                    totalBills: { $sum: 1 },
                    activeBills: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    },
                    overdueBills: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$isActive', true] },
                                        { $lt: ['$dueDate', new Date()] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    totalAmount: { $sum: '$amount' },
                    averageAmount: { $avg: '$amount' }
                }
            }
        ]);
        
        res.json({
            success: true,
            bills,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit
            },
            stats: stats[0] || {
                totalBills: 0,
                activeBills: 0,
                overdueBills: 0,
                totalAmount: 0,
                averageAmount: 0
            }
        });
    } catch (error) {
        console.error('Get bills error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bills',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get single bill by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const bill = await Bill.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        res.json({
            success: true,
            bill
        });
    } catch (error) {
        console.error('Get bill error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bill',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Create new bill
router.post('/', auth, async (req, res) => {
    try {
        const {
            title,
            description,
            amount,
            category,
            dueDate,
            frequency,
            isAutoPaid,
            paymentMethod,
            reminderDays,
            gracePeriod,
            lateFee,
            vendor,
            accountNumber,
            tags
        } = req.body;
        
        // Validate required fields
        if (!title || !amount || !category || !dueDate || !frequency) {
            return res.status(400).json({
                success: false,
                message: 'Title, amount, category, due date, and frequency are required'
            });
        }
        
        // Validate amount
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }
        
        // Validate due date
        if (new Date(dueDate) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Due date cannot be in the past'
            });
        }
        
        const bill = new Bill({
            userId: req.userId,
            title: title.trim(),
            description: description ? description.trim() : '',
            amount: parseFloat(amount),
            category,
            dueDate: new Date(dueDate),
            frequency,
            isAutoPaid: isAutoPaid || false,
            paymentMethod: paymentMethod || 'bank_transfer',
            reminderDays: reminderDays || 3,
            gracePeriod: gracePeriod || 0,
            lateFee: lateFee || 0,
            vendor: vendor ? vendor.trim() : '',
            accountNumber: accountNumber ? accountNumber.trim() : '',
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : []
        });
        
        await bill.save();
        
        res.status(201).json({
            success: true,
            message: 'Bill created successfully',
            bill
        });
    } catch (error) {
        console.error('Create bill error:', error);
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
            message: 'Failed to create bill',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Update bill
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
        if (updateData.dueDate) {
            updateData.dueDate = new Date(updateData.dueDate);
        }
        
        // Convert numeric fields
        ['reminderDays', 'gracePeriod', 'lateFee'].forEach(field => {
            if (updateData[field] !== undefined) {
                updateData[field] = parseFloat(updateData[field]);
                if (updateData[field] < 0) {
                    return res.status(400).json({
                        success: false,
                        message: `${field} cannot be negative`
                    });
                }
            }
        });
        
        // Process tags if present
        if (updateData.tags) {
            updateData.tags = Array.isArray(updateData.tags) 
                ? updateData.tags 
                : updateData.tags.split(',').map(tag => tag.trim());
        }
        
        // Trim string fields
        ['title', 'description', 'vendor', 'accountNumber'].forEach(field => {
            if (updateData[field]) {
                updateData[field] = updateData[field].trim();
            }
        });
        
        const bill = await Bill.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Bill updated successfully',
            bill
        });
    } catch (error) {
        console.error('Update bill error:', error);
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
            message: 'Failed to update bill',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Delete bill
router.delete('/:id', auth, async (req, res) => {
    try {
        const bill = await Bill.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Bill deleted successfully'
        });
    } catch (error) {
        console.error('Delete bill error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete bill',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Mark bill as paid
router.patch('/:id/mark-paid', auth, async (req, res) => {
    try {
        const { paymentAmount, paymentMethod, reference } = req.body;
        
        const bill = await Bill.findOne({
            _id: req.params.id,
            userId: req.userId
        });
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }
        
        // Use the instance method to mark as paid
        await bill.markAsPaid(
            paymentAmount || bill.amount,
            paymentMethod || bill.paymentMethod,
            reference
        );
        
        res.json({
            success: true,
            message: 'Bill marked as paid successfully',
            bill
        });
    } catch (error) {
        console.error('Mark paid error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark bill as paid',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get upcoming bills (next 30 days)
router.get('/upcoming/summary', auth, async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        const upcomingBills = await Bill.find({
            userId: req.userId,
            isActive: true,
            dueDate: {
                $gte: today,
                $lte: thirtyDaysFromNow
            }
        }).sort({ dueDate: 1 });
        
        // Calculate totals
        const totalAmount = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
        
        // Group by week
        const weeklyBreakdown = [];
        for (let i = 0; i < 4; i++) {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() + (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            const weekBills = upcomingBills.filter(bill => {
                const billDate = new Date(bill.dueDate);
                return billDate >= weekStart && billDate <= weekEnd;
            });
            
            weeklyBreakdown.push({
                week: i + 1,
                startDate: weekStart,
                endDate: weekEnd,
                bills: weekBills,
                totalAmount: weekBills.reduce((sum, bill) => sum + bill.amount, 0)
            });
        }
        
        res.json({
            success: true,
            upcomingBills,
            summary: {
                totalBills: upcomingBills.length,
                totalAmount,
                averageAmount: upcomingBills.length > 0 ? totalAmount / upcomingBills.length : 0
            },
            weeklyBreakdown
        });
    } catch (error) {
        console.error('Get upcoming bills error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch upcoming bills',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get overdue bills
router.get('/overdue/summary', auth, async (req, res) => {
    try {
        const overdueBills = await Bill.find({
            userId: req.userId,
            isActive: true,
            dueDate: { $lt: new Date() }
        }).sort({ dueDate: 1 });
        
        // Calculate totals including late fees
        const totalAmount = overdueBills.reduce((sum, bill) => {
            const daysOverdue = Math.floor((new Date() - new Date(bill.dueDate)) / (1000 * 60 * 60 * 24));
            const lateFeeAmount = daysOverdue > bill.gracePeriod ? bill.lateFee : 0;
            return sum + bill.amount + lateFeeAmount;
        }, 0);
        
        res.json({
            success: true,
            overdueBills,
            summary: {
                totalBills: overdueBills.length,
                totalAmount,
                averageAmount: overdueBills.length > 0 ? totalAmount / overdueBills.length : 0
            }
        });
    } catch (error) {
        console.error('Get overdue bills error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch overdue bills',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get bill statistics
router.get('/stats/summary', auth, async (req, res) => {
    try {
        const stats = await Bill.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: null,
                    totalBills: { $sum: 1 },
                    activeBills: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    },
                    inactiveBills: {
                        $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
                    },
                    overdueBills: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$isActive', true] },
                                        { $lt: ['$dueDate', new Date()] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    totalAmount: { $sum: '$amount' },
                    averageAmount: { $avg: '$amount' },
                    totalPaid: { $sum: '$totalPaid' }
                }
            }
        ]);
        
        // Category breakdown
        const categoryStats = await Bill.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    averageAmount: { $avg: '$amount' },
                    activeCount: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);
        
        // Frequency breakdown
        const frequencyStats = await Bill.aggregate([
            { $match: { userId: req.userId } },
            {
                $group: {
                    _id: '$frequency',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { count: -1 } }
        ]);
        
        res.json({
            success: true,
            stats: stats[0] || {
                totalBills: 0,
                activeBills: 0,
                inactiveBills: 0,
                overdueBills: 0,
                totalAmount: 0,
                averageAmount: 0,
                totalPaid: 0
            },
            categoryStats,
            frequencyStats
        });
    } catch (error) {
        console.error('Get bill stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bill statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router;
