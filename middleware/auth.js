const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { User, validateUser } = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        let token
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.payload.id).select('-password')
            req.user.role = decoded.payload.role
            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({ message: 'Not Authorized' })
        }
    }
    else {
        res.status(401).json({ message: 'Not Authorized, No token' })
    }
})

const checkSuperAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'superadmin') {
            return res.status(403).json({ message: 'You do not have the necessary permissions for this' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const checkAdmin = async (req, res, next) => {
    try {
        if (!req.user || !['admin', 'superadmin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have the necessary permissions for this' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { protect, checkSuperAdmin, checkAdmin }