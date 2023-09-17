const mongoose = require('mongoose')
const Joi = require('joi')

const User = mongoose.model(
    "Users",
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                enum: ['admin', 'superadmin', 'candidate'],
                default: 'admin'
            }
        }, {
        timestamps: true
    }
    )
)
function validateUsers(user) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(1).max(50).required(),
        password: Joi.string().min(1).max(50).required(),
    })
    return schema.validate(user)
}
exports.User = User
exports.validateUser = validateUsers