const express = require('express')
const { registerUser, loginUser, logoutUser, refreshToken } = require('../controllers/authController')
const { verifyToken, verifyRefreshToken } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', registerUser)

router.post('/login', loginUser)

router.post('/logout', verifyToken, logoutUser)

router.post('/refresh', verifyRefreshToken, refreshToken)

module.exports = router
