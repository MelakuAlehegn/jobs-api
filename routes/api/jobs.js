const express = require('express')
const { getJobs, getJob, setJob, updateJob, deleteJob } = require('../../controllers/jobController')
const { protect, checkSuperAdmin, checkAdmin } = require('../../middleware/auth')


const router = express.Router();

router.get('/', getJobs)
router.get('/:id', getJob)
router.post('/', protect, checkAdmin, setJob)
router.put('/:id', protect, checkAdmin, updateJob)
router.delete('/:id', protect, checkAdmin, deleteJob)

module.exports = router