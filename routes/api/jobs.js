const express = require('express')
const jobs = require('../../Jobs')

const router = express.Router()

// Get all Jobs
router.get('/', (req, res) => {
    res.json(jobs)
})

// Get a Single Job
router.get('/:id', (req, res) => {
    // res.send(req.params.id)
    const found = jobs.some(job => job.id === parseInt(req.params.id))
    if (!found) {
        res.status(400)
        res.json({ message: `Job with id:${req.params.id} not found` })
    }
    res.json(jobs.filter(job => job.id === parseInt(req.params.id)))
})


module.exports = router