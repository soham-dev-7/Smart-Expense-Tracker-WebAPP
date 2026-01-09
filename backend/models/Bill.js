const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    title: {
        type: String,
        required: [true, 'Bill title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0'],
        max: [1000000, 'Amount cannot exceed 1,000,000']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['utilities', 'rent', 'insurance', 'subscription', 'loan', 'mortgage', 'credit_card', 'phone', 'internet', 'other'],
            message: 'Invalid category. Choose from: utilities, rent, insurance, subscription, loan, mortgage, credit_card, phone, internet, other'
        }
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required'],
        validate: {
            validator: function(value) {
                return value >= new Date();
            },
            message: 'Due date cannot be in the past'
        }
    },
    frequency: {
        type: String,
        required: [true, 'Frequency is required'],
        enum: {
            values: ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly', 'once'],
            message: 'Invalid frequency. Choose from: weekly, biweekly, monthly, quarterly, yearly, once'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAutoPaid: {
        type: Boolean,
        default: false
    },
    lastPaid: {
        type: Date,
        default: null
    },
    nextDueDate: {
        type: Date,
        default: null
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'auto_debit', 'digital_wallet', 'other'],
        default: 'bank_transfer'
    },
    reminderDays: {
        type: Number,
        default: 3,
        min: [0, 'Reminder days cannot be negative'],
        max: [30, 'Reminder days cannot exceed 30']
    },
    gracePeriod: {
        type: Number,
        default: 0,
        min: [0, 'Grace period cannot be negative'],
        max: [30, 'Grace period cannot exceed 30 days']
    },
    lateFee: {
        type: Number,
        default: 0,
        min: [0, 'Late fee cannot be negative']
    },
    vendor: {
        type: String,
        trim: true,
        maxlength: [100, 'Vendor name cannot exceed 100 characters']
    },
    accountNumber: {
        type: String,
        trim: true,
        maxlength: [50, 'Account number cannot exceed 50 characters']
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    paymentHistory: [{
        paymentDate: {
            type: Date,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'auto_debit', 'digital_wallet', 'other']
        },
        reference: {
            type: String,
            trim: true,
            maxlength: [100, 'Reference cannot exceed 100 characters']
        }
    }],
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
billSchema.index({ userId: 1, isActive: 1, dueDate: 1 });
billSchema.index({ userId: 1, category: 1 });
billSchema.index({ userId: 1, frequency: 1 });
billSchema.index({ dueDate: 1 });
billSchema.index({ isActive: 1 });
billSchema.index({ nextDueDate: 1 });

// Virtual for days until due
billSchema.virtual('daysUntilDue').get(function() {
    if (!this.dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
billSchema.virtual('isOverdue').get(function() {
    if (!this.dueDate || !this.isActive) return false;
    return new Date() > new Date(this.dueDate);
});

// Virtual for is due soon (within reminder days)
billSchema.virtual('isDueSoon').get(function() {
    const daysUntil = this.daysUntilDue;
    return daysUntil !== null && daysUntil <= this.reminderDays && daysUntil >= 0;
});

// Virtual for total paid amount
billSchema.virtual('totalPaid').get(function() {
    return this.paymentHistory.reduce((total, payment) => total + payment.amount, 0);
});

// Instance method to calculate next due date
billSchema.methods.calculateNextDueDate = function(lastPaymentDate) {
    const date = new Date(lastPaymentDate);
    
    switch (this.frequency) {
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'biweekly':
            date.setDate(date.getDate() + 14);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'quarterly':
            date.setMonth(date.getMonth() + 3);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
        case 'once':
            return this.dueDate;
        default:
            return this.dueDate;
    }
    
    return date;
};

// Instance method to mark as paid
billSchema.methods.markAsPaid = function(paymentAmount, paymentMethod, reference) {
    this.lastPaid = new Date();
    this.paymentHistory.push({
        paymentDate: this.lastPaid,
        amount: paymentAmount,
        paymentMethod: paymentMethod,
        reference: reference
    });
    
    // For one-time bills, deactivate after payment
    if (this.frequency === 'once') {
        this.isActive = false;
    } else {
        // Calculate next due date for recurring bills
        this.dueDate = this.calculateNextDueDate(this.lastPaid);
    }
    
    return this.save();
};

module.exports = mongoose.model('Bill', billSchema);
