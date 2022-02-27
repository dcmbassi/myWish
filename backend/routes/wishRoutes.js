const express = require('express')
const { fetchMyWishList, fetchFriendWishList, addNewWish } = require('../controllers/wishController')
const {verifyToken} = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').get(verifyToken, fetchMyWishList).post(verifyToken, addNewWish)
router.get('/:userId', verifyToken, fetchFriendWishList)

module.exports = router