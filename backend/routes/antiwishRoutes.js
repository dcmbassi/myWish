const express = require('express')
const { fetchMyWackList, addNewAntiwish, updateAntiwish, deleteAntiwish, fetchFriendWacklist } = require('../controllers/antiwishController')
const { verifyToken } = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/')
    .get(verifyToken, fetchMyWackList)
    .post(verifyToken, addNewAntiwish)

router.route('/:antiwishId')
    .put(verifyToken, updateAntiwish)
    .delete(verifyToken, deleteAntiwish)

router.get('/:userId', verifyToken, fetchFriendWacklist)

module.exports = router