const express = require('express')
const { fetchMyWishList, fetchFriendWishList, addNewWish, updateWish, deleteWish, tagWish, untagWish } = require('../controllers/wishController')
const {verifyToken, verifyWishOwnership} = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/')
    .get(verifyToken, fetchMyWishList)
    .post(verifyToken, addNewWish)

router.route('/:wishId')
    .put(verifyToken, verifyWishOwnership, updateWish)
    .delete(verifyToken, verifyWishOwnership, deleteWish)

router.get('/:userId', verifyToken, fetchFriendWishList)

router.put('/tag/:wishId', verifyToken, tagWish)
router.put('/tag/:wishId/remove', verifyToken, untagWish)

module.exports = router