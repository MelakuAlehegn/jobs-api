const express = require('express')
const { getJobs, getJob, setJob, updateJob, deleteJob } = require('../../controllers/getJobs')
const uuid = require('uuid')
const moment = require('moment')


const router = express.Router();

// Get all Jobs
router.get('/', getJobs)
router.get('/:id', getJob)
router.post('/', setJob)
router.put('/:id', updateJob)
router.delete('/:id', deleteJob)

module.exports = router