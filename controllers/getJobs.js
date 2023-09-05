const uuid = require('uuid')
const moment = require('moment')
const jobs = require('../Jobs')
const asyncHandler = require('express-async-handler')

// Get all Jobs controller
const getJobs = asyncHandler(async (req, res) => {
    res.json(jobs)
})

// Get a single Job
const getJob = asyncHandler(async (req, res) => {
    const found = jobs.some(job => job.id === parseInt(req.params.id))
    if (!found) {
        res.status(400)
        res.json({ message: `Job with id:${req.params.id} not found` })
    }
    else {
        res.json(jobs.filter(job => job.id === parseInt(req.params.id)))
    }
})

// Add a Job 
const setJob = asyncHandler(async (req, res) => {
    const newJob = {
        id: uuid.v4(),
        "company": req.body.company,
        "logo": req.body.logo,
        "isnew": req.body.isTrue,
        "featured": req.body.featured,
        "position": req.body.position,
        "role": req.body.role,
        "level": req.body.level,
        "postedAt": moment().format(),
        "contract": req.body.contract,
        "location": req.body.location,
        "languages": req.body.languages,
        "tools": req.body.tools
    }
    if (!newJob.company) {
        res.status(400)
        res.json({ message: `please add company name` })
    }
    else {
        jobs.push(newJob)
        res.json(jobs)
    }
    res.send(req.body)
})

// Update a job
const updateJob = asyncHandler(async (req, res) => {
    const found = jobs.some(job => job.id === parseInt(req.params.id))
    if (!found) {
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