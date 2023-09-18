const express = require('express')
const { getJobs, getJob, setJob, updateJob, deleteJob } = require('../../controllers/jobController')
const { protect } = require('../../middleware/auth')


const router = express.Router();

router.get('/', getJobs)
router.get('/:id', getJob)
router.post('/', protect('admin'), setJob)
router.put('/:id', protect('admin'), updateJob)
router.delete('/:id', protect('admin'), deleteJob)

module.exports = router