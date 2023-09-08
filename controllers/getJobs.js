const uuid = require('uuid')
const moment = require('moment')
const asyncHandler = require('express-async-handler')
const Job = require('../models/jobModel')

// GET all Jobs
const getJobs = asyncHandler(async (req, res) => {
    const { page, limit, company, position, location, sort } = req.query
    const skip = (page - 1) * limit
    const filter = {};
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
        query.sort({ company: 1 });
    } if (sort === "position") {
        query.sort({ position: 1 });
    } if (sort === "location") {
        query.sort({ location: 1 });
    }
    const job = await query.skip(skip).limit(Number(limit));
    let totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit)
    const response = {
        totalJobs: totalJobs,
        totalPages: totalPages || 0,
        currentPage: page,
        jobs: job
    }
    res.status(200).json(response)
})

// GET a single Job
const getJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id
    const job = await Job.findById(jobId)
    if (!job) {
        return res.status(400).json({ error: 'Job not found' })
    }
    res.status(200).json(job)
})

// POST a Job
const setJob = asyncHandler(async (req, res) => {
    const newJob = await Job.create({
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
    if (!newJob.company) {
        res.status(400).json({ message: `please add company name` })
    }
    else {
        res.status(201).json(newJob)
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
    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true })
    res.status(200).json(updatedJob)

})

// Delete Job
const deleteJob = asyncHandler(async (req, res) => {
    // res.send(req.params.id)
    const jobId = req.params.id
    const job = await Job.findById(jobId)
    if (!job) {
        res.status(400)
        res.json({ message: `Job with id:${req.params.id} not found` })
    }
    await Job.findByIdAndRemove(req.params.id)
    return res.status(200).json({
        id: req.params.id,
        name: job.company
    })
})

module.exports = { getJobs, getJob, setJob, updateJob, deleteJob }