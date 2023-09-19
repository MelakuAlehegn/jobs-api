const { User, validateUser } = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

// Register User
const registerUser = asyncHandler(async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).json(error.details[0].message)
    const { name, email, password, role } = req.body
    // if (role === 'superadmin') {
    //     return res.status(403).json({ message: 'You can not register Superadmin' });
    // }
    const userExisits = await User.findOne({ email })
    if (userExisits) {
        return res.status(400).json({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role
    })
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generatToken(user),
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
        res.json({ message: 'Please add your all credentials' })
    }
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generatToken(user)
        })
    }
    else {
        res.status(400).json({ message: 'Invalid User details' })
    }
})

// Get All Users
const getUsers = asyncHandler(async (req, res) => {
    const user = await User.find()
    let totalUser = await User.countDocuments();
    const response = {
        allRecords: totalUser,
        records: user
    }
    res.status(200).json(response)
})

// GET a single User
const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.id
    if (userId.length !== 24) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }
    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({ error: 'User not found' })
    }
    res.status(200).json(user)
})
// Update User
const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id
    if (userId.length !== 24) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }
    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({ message: `User with id:${req.params.id} not found` })
    }
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword
    }
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true })
    res.status(200).json(updatedUser)
})

// Delete a User
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id
    if (userId.length !== 24) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }
    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({ message: `User with id:${req.params.id} not found` })
    }
    await User.findByIdAndRemove(userId)
    res.status(200).json({
        id: userId,
        name: user.name
    })
})

// Get currentely logged in user
const getMe = asyncHandler(async (req, res) => {
    const { id, name, email } = await User.findById(req.user._id);
    console.log(id)
    res.status(200).json({
        id: id,
        name,
        email
    })
})

// Generate token
const generatToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role
    }
    return jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser, loginUser, getUsers, getUser, updateUser, deleteUser, getMe
}