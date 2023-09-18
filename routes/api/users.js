const express = require('express')
const { registerUser, loginUser, getUsers, getUser, updateUser, deleteUser, getMe } = require('../../controllers/userController')
const { protect } = require('../../middleware/auth')

const router = express.Router()

router.post('/', protect('superadmin'), registerUser)
router.post('/login', protect('admin'), loginUser)
router.get('/', protect('admin'), getUsers)
router.get('/:id', protect(), getUser)
router.put('/:id', protect('superadmin'), updateUser)
router.delete('/:id', protect('superadmin'), deleteUser)
router.get('/me', protect, getMe)

module.exports = router