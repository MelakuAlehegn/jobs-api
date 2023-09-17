const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { User, validateUser } = require('../models/userModel')

const protect = (role) => asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.payload.id).select('-password')
            userRole = decoded.payload.role
            if (userRole !== role) {
                return res.status(403).json({ message: 'You do not have the necessary permissions.' });
            }
            req.userRole = userRole
            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({ message: 'Not Authorized' })
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not Authorized, No token' })
    }
})

module.exports = { protect }