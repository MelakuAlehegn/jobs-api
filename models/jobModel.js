const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    company: String,
    logo: String,
    isnew: Boolean,
    featured: Boolean,
    position: String,
    role: String,
    level: String,
    postedAt: Date,
    contract: String,
    location: String,
    languages: [String],
    tools: [String]
})

module.exports = mongoose.model('Jobs', jobSchema)