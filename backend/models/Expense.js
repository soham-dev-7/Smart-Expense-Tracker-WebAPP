const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    title: {
        type: String,
        required: [true, 'Expense title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
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
            values: ['food', 'transport', 'entertainment', 'utilities', 'healthcare', 'shopping', 'education', 'travel', 'other'],
            message: 'Invalid category. Choose from: food, transport, entertainment, utilities, healthcare, shopping, education, travel, other'
        }
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
        validate: {
            validator: function(value) {
                return !value || value <= new Date();
            },
            message: 'Expense date cannot be in the future'
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    isRecurring: {
        type: Boolean,
        default: false
    },
    receiptUrl: {
        type: String,
        default: null
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'digital_wallet', 'other'],
        default: 'cash'
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
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
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, amount: -1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ tags: 1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
    return this.amount.toFixed(2);
});

module.exports = mongoose.model('Expense', expenseSchema);
