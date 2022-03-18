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

const verifyRefreshToken = asyncHandler(async (req, res, next) => {
    const {headers: {cookie}} = req
    if (cookie) {
        const cookies = cookie.split(';').reduce((acc, current) => {
            const [key, value] = current.trim().split('=')
            return {...acc, key: value}
        }, {})
        const refreshToken = cookies.__refresh_token
        try {
            const decoded = jwt.decode(refreshToken, process.env.JWT_REFRESH_SECRET)
            const user = User.findById(decoded.id)
            if (user) {
                req.user = user
                next()
            } else {
                res.status(400)
                throw new Error('User not found')
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401)
                throw new Error('Refresh token expired')
            } else {
                res.status(500)
                throw new Error('A server error has occurred')
            }
        }
    } else {
        res.status(400)
        throw new Error('Missing headers')
    }
})

module.exports = {
    verifyToken,
    verifyRefreshToken,
    verifyWishOwnership
}