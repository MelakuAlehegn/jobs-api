const express = require('express')
const { getJobs, getJob, setJob, updateJob, deleteJob } = require('../../controllers/jobController')
const { protect } = require('../../middleware/auth')


const router = express.Router();

// Get all Jobs
router.get('/', protect, getJobs)
router.get('/:id', protect, getJob)
router.post('/', protect, setJob)
router.put('/:id', protect, updateJob)
router.delete('/:id', protect, deleteJob)

module.exports = router