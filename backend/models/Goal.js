const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    title: {
        type: String,
        required: [true, 'Goal title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Target amount is required'],
        min: [1, 'Target amount must be at least 1'],
        max: [10000000, 'Target amount cannot exceed 10,000,000']
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: [0, 'Current amount cannot be negative']
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline is required'],
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'Deadline must be in the future'
        }
    },
    category: {
        type: String,
        enum: {
            values: ['savings', 'investment', 'purchase', 'emergency', 'education', 'travel', 'retirement', 'other'],
            message: 'Invalid category. Choose from: savings, investment, purchase, emergency, education, travel, retirement, other'
        },
        default: 'savings'
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'completed', 'paused', 'cancelled'],
            message: 'Invalid status. Choose from: active, completed, paused, cancelled'
        },
        default: 'active'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    autoUpdate: {
        type: Boolean,
        default: false
    },
    milestones: [{
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        description: {
            type: String,
            trim: true,
            maxlength: [200, 'Milestone description cannot exceed 200 characters']
        },
        achieved: {
            type: Boolean,
            default: false
        },
        achievedDate: {
            type: Date,
            default: null
        }
    }],
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    completedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, deadline: 1 });
goalSchema.index({ userId: 1, category: 1 });
goalSchema.index({ userId: 1, priority: 1 });
goalSchema.index({ deadline: 1 });
goalSchema.index({ status: 1 });

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function() {
    if (this.targetAmount === 0) return 0;
    return Math.round((this.currentAmount / this.targetAmount) * 100);
});

// Virtual for remaining amount
goalSchema.virtual('remainingAmount').get(function() {
    return this.targetAmount - this.currentAmount;
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
    if (!this.deadline) return null;
    const today = new Date();
    const deadline = new Date(this.deadline);
    const diffTime = deadline - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
goalSchema.virtual('isOverdue').get(function() {
    if (!this.deadline || this.status === 'completed') return false;
    return new Date() > new Date(this.deadline);
});

// Instance method to add funds
goalSchema.methods.addFunds = function(amount) {
    this.currentAmount += amount;
    if (this.currentAmount >= this.targetAmount) {
        this.status = 'completed';
        this.completedAt = new Date();
    }
    return this.save();
};

module.exports = mongoose.model('Goal', goalSchema);
