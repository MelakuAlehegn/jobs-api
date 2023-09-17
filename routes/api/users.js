const express = require('express')
const { registerUser, loginUser, getMe } = require('../../controllers/userController')
const { protect } = require('../../middleware/auth')

const router = express.Router()

router.post('/', protect('superadmin'), registerUser)
router.post('/login', protect('admin'), loginUser)
router.get('/me', protect, getMe)



module.exports = router