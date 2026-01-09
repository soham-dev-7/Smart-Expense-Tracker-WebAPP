const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access denied. No token provided.' 
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Check if user exists and is active
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token. User not found.' 
            });
        }
        
        if (!user.isActive) {
            return res.status(401).json({ 
                success: false,
                message: 'Account is deactivated.' 
            });
        }
        
        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token.' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expired.' 
            });
        }
        res.status(500).json({ 
            success: false,
            message: 'Server error during authentication.' 
        });
    }
};

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findById(decoded.userId).select('-password');
            
            if (user && user.isActive) {
                req.user = user;
                req.userId = user._id;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication for optional routes
        next();
    }
};

// Admin authentication middleware (for future admin features)
const adminAuth = async (req, res, next) => {
    try {
        // First run regular auth
        await auth(req, res, () => {
            // Check if user is admin (you can add isAdmin field to User model)
            if (!req.user.isAdmin) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Access denied. Admin privileges required.' 
                });
            }
            next();
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error during admin authentication.' 
        });
    }
};

module.exports = { auth, optionalAuth, adminAuth };
