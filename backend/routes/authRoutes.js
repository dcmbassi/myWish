const express = require('express')
const { registerUser, loginUser, logoutUser } = require('../controllers/authController')
const { verifyToken } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', registerUser)

router.post('/login', loginUser)

router.post('/logout', verifyToken, logoutUser)

module.exports = router
