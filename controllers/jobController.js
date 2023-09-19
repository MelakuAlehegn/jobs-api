const moment = require('moment')
const asyncHandler = require('express-async-handler')
const { Job, validate, validateUpdate } = require('../models/jobModel')
const { User, validateUser } = require('../models/userModel')
// GET all Jobs
const getJobs = asyncHandler(async (req, res) => {
    let { page, limit, company, position, location, sort } = req.query
    limit = Number(limit)
    page = Number(page)
    const skip = (page - 1) * limit
    const filter = {};
    const sorted = {}
    let query;
    if (company) {
        filter.company = company;
    } if (position) {
        filter.position = position;
    } if (location) {
        filter.location = location;
    }
    query = Job.find(filter)
    if (sort === "company") {
        sorted.company = company
    } if (sort === "position") {
        sorted.position = position
    } if (sort === "location") {
        sorted.location = location
    }

    const sortedJobs = query.sort(sorted)
    const job = await sortedJobs.skip(skip).limit(Number(limit));
    let totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit)
    const response = {
        allRecords: totalJobs,
        pages: totalPages || 0,
        currentPage: page || 0,
        records: job
    }
    res.status(200).json(response)
})

// GET a single Job
const getJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id
    if (jobId.length !== 24) {
        return res.status(400).json({ error: 'Invalid job ID' });
    }
    const job = await Job.findById(jobId)
    if (!job) {
        return res.status(400).json({ error: 'Job not found' })
    }
    res.status(200).json(job)
})

// POST a Job
const setJob = asyncHandler(async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).json(error.details[0].message)
    const job = await Job.create({
        user: req.user.id,
        company: req.body.company,
        logo: req.body.logo,
        isnew: req.body.isTrue,
        featured: req.body.featured,
        position: req.body.position,
        role: req.body.role,
        level: req.body.level,
        postedAt: moment().format(),
        contract: req.body.contract,
        location: req.body.location,
        languages: req.body.languages,
        tools: req.body.tools
    })
    res.status(201).json(job)
})

// Update a job
const updateJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id
    if (jobId.length !== 24) {
        return res.status(400).json({ error: 'Invalid job ID' });
    }
    const { error } = validateUpdate(req.body)
    if (error) return res.status(400).json(error.details[0].message)
    const job = await Job.findById(jobId)
    if (!job) {
        res.status(400)
        res.json({ message: `Job with id:${req.params.id} not found` })
    }
    const user = User.findById(req.user.id)
    if (!user) {
        res.status(401).json('User not found')
    }
    if (job.user.toString() !== req.user.id) {
        res.status(401).json('User not authorized')
    }
    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true })
    res.status(200).json(updatedJob)

})

// Delete Job
const deleteJob = asyncHandler(async (req, res) => {
    // res.send(req.params.id)
    const jobId = req.params.id
    if (jobId.length !== 24) {
        return res.status(400).json({ error: 'Invalid job ID' });
    }
    const job = await Job.findById(jobId)
    if (!job) {
        return res.status(400).json({ message: `Job with id:${req.params.id} not found` })
    }
    const user = await User.findById(req.user.id)
    if (!user) {
        return res.status(401).json('User not found')
    }
    if (job.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' })
    }
    await Job.findByIdAndRemove(req.params.id)
    res.status(200).json({
        id: req.params.id,
        name: job.company
    })
})

module.exports = { getJobs, getJob, setJob, updateJob, deleteJob }