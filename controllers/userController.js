const { User, validateUser } = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')



// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).json(error.details[0].message)

    const { name, email, password } = req.body
    const userExisits = await User.findOne({ email })
    if (userExisits) {
        return res.status(400).json({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generatToken(user._id)
        })
    }
    else {
        res.status(400).json({ message: 'Invalid User data' })
    }
})

// Login User
const loginUser = asyncHandler(async (req, res) => {
    // const { error } = validate(req.body)
    // if (error) return res.status(400).json(error.details[0].message)

    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!password || !email) {
        res.json({ message: 'Please add your credentials' })
    }
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generatToken(user._id)
        })
    }
    else {
        res.status(400).json({ message: 'Invalid User details' })
    }
})

// Get currentely logged in user
const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email } = await User.findById(req.user._id)

    res.status(200).json({
        id: _id,
        name,
        email
    })
})

// Generate token
const generatToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser, loginUser, getMe
}