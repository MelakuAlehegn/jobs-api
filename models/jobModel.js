const mongoose = require('mongoose')
const Joi = require('joi')

const Job = mongoose.model(
    "Jobs",
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            company: {
                type: String,
                required: true,
            },
            logo: {
                type: String,
            },
            isnew: {
                type: Boolean,
            },
            featured: Boolean,
            position: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                required: true,
            },
            level: {
                type: String,
                required: true,
            },
            postedAt: {
                type: String,
                required: true,
            },
            contract: {
                type: String,
                required: true,
            },
            location: {
                type: String,
                required: true,
            },
            languages: [String],
            tools: [String]
        }, {
        timestamps: true
    }
    )
)
function validateJobs(job) {
    const schema = Joi.object({
        company: Joi.string().min(1).max(50).required(),
        logo: Joi.string().min(1).max(50),
        isnew: Joi.boolean(),
        featured: Joi.boolean(),
        position: Joi.string().min(1).max(50).required(),
        role: Joi.string().min(1).max(50).required(),
        level: Joi.string().min(1).max(50).required(),
        postedAt: Joi.date().min(1).max(50),
        contract: Joi.string().min(1).max(50).required(),
        location: Joi.string().min(1).max(50).required(),
        languages: Joi.array().items(Joi.string()),
        tools: Joi.array().items(Joi.string())
    })
    return schema.validate(job)
}
exports.Job = Job
exports.validate = validateJobs