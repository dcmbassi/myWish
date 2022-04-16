const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Wish = require('../models/wishModel')

const verifyToken = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_AUTH_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorised')
        }
    } else {
        res.status(401)
        throw new Error('Unauthorised: no token supplied')
    }
})

const verifyWishOwnership = asyncHandler(async (req, res, next) => {
    if (req.params.wishId) {
        req.wish = await Wish.findById(req.params.wishId)

        if (req.wish.owner.toString() !== req.user.id) {
            res.status(401)
            throw new Error('User does not own this wish')
        } else {
            next()
        }
    } else {
        res.status(400)
        throw new Error('Missing wish reference')
    }
})


module.exports = {
    verifyToken,
    verifyWishOwnership
}