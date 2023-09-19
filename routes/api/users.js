const express = require('express')
const { registerUser, loginUser, getUsers, getUser, updateUser, deleteUser, getMe } = require('../../controllers/userController')
const { protect, checkSuperAdmin } = require('../../middleware/auth')

const router = express.Router()

router.get('/me', protect, getMe)
router.post('/login', loginUser)
router.post('/', protect, checkSuperAdmin, registerUser)
router.get('/', protect, checkSuperAdmin, getUsers)
router.get('/:id', protect, checkSuperAdmin, getUser)
router.delete('/:id', protect, checkSuperAdmin, deleteUser)
router.put('/:id', protect, checkSuperAdmin, updateUser)

module.exports = router