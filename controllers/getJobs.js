const uuid = require('uuid')
const moment = require('moment')
const jobs = require('../Jobs')
const asyncHandler = require('express-async-handler')
const Job = require('../models/jobModel')
// Get all Jobs controller
const getJobs = asyncHandler(async (req, res) => {
    const job = await Job.find()
    res.status(200).json(job)
})

// Get a single Job
const getJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id
    const job = await Job.findById(jobId)
    if (!job) {
        return res.status(400).json({ error: 'Job not found' })
    }
    res.status(200).json(job)
})

// Post a Job 
const setJob = asyncHandler(async (req, res) => {
    const newJob = {
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
    }
    if (!newJob.company) {
        res.status(400).json({ message: `please add company name` })
    }
    else {
        const job = new Job(newJob)
        try {
            const saveJob = await job.save()
            res.json(saveJob)
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Failed to post job' })
        }
    }
})

// Update a job
const updateJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id
    const job = await Job.findById(jobId)
    if (!job) {
        res.status(400)
        res.json({ message: `Job with id:${req.params.id} not found` })
    }
    else {
        res.json(found)
    }
})
// Delete Job
const deleteJob = asyncHandler(async (req, res) => {
    // res.send(req.params.id)
    const found = jobs.some(job => job.id === parseInt(req.params.id))
    if (!found) {
        res.status(400)
        res.json({ message: `Job with id:${req.params.id} not found` })
    }
    else {
        res.json(jobs.filter(job => job.id !== parseInt(req.params.id)))
    }
})
module.exports = { getJobs, getJob, setJob, updateJob, deleteJob }