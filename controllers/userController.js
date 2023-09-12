const { User, validate } = require('../models/userModel')


const registerUser = (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).json(error.details[0].message)
    res.json({ message: 'user Registered' })
}

module.exports = {
    registerUser,
}