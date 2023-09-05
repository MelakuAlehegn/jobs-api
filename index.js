const express = require('express')
const jobs = require('./Jobs')

const app = express()

// Get all Jobs
app.get('/api/jobs', (req, res) => {
    res.json(jobs)
})

// Get a Single Job
app.get('/api/jobs/:id', (req, res) => {
    // res.send(req.params.id)
    const found = jobs.some(job => job.id === parseInt(req.params.id))
    if (!found) {
        res.status(400)
        res.json({ message: `Job with id:${req.params.id} not found` })
    }
    res.json(jobs.filter(job => job.id === parseInt(req.params.id)))
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))