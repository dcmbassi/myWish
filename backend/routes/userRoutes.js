const express = require('express')
const { registerUser, loginUser, followUser, unfollowAll, unfollowOne } = require('../controllers/userController')
const {verifyToken} = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', registerUser)

router.post('/login', loginUser)

router.post('/follow/:userId', verifyToken, followUser)

router.post('/unfollow', verifyToken, unfollowAll)
router.post('/unfollow/:userId', verifyToken, unfollowOne)

module.exports = router