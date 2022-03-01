const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


/*
  @desc     Register new user
  @route    POST /api/users
  @access   Public
*/
const registerUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password} = req.body
    if (!lastName || !email || !password) {
        res.status(400)
        throw new Error('Please add all required fields.')
    }

    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        firstName, 
        lastName, 
        email, 
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})


/*
  @desc     Login user
  @route    POST /api/users/login
  @access   Public
*/
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error('Please add all required fields.')
    }

    const user = await User.findOne({email})
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})


/*
  @desc     Add target user to following list and add self to target follower list
  @route    POST /api/users/follow/:userId
  @access   Private
*/
const followUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401)
        throw new Error('User not authorised')
    }
    
    const target = await User.findById(req.params.userId)
    if (!target) {
        res.status(400)
        throw new Error('Target user not found')
    }

    if (target.id === req.user.id) {
        res.status(400)
        throw new Error('Cannot follow self')
    }

    const user = await User.findById(req.user.id)

    if (user.following.includes(target.id)) {
        res.status(400)
        throw new Error('You already follow this user')
    }

    user.following.push(target.id)
    user.save()

    if (!target.followers.includes(req.user.id)) {
        target.followers.push(req.user.id)
        target.save()
    }

    res.status(200).send({followed: user.following.slice(-1)[0]})
})


/*
  @desc     Remove all entries from following list and remove self from all follower lists
  @route    POST /api/users/unfollow
  @access   Private
*/
const unfollowAll = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401)
        throw new Error('User not authorised')
    }
    
    const user = await User.findById(req.user.id)
    
    const result = await User.updateMany({'_id': { $in:  user.following}}, {
        $pullAll: {
            followers: [user.id]
        }
    })
    
    if (result.matchedCount === 0) {
        res.status(400)
        throw new Error('Not following anyone')
    }

    if (result.matchedCount !== result.modifiedCount) {
        res.status(500)
        throw new Error('Something went wrong')
    }

    user.following = []
    user.save()

    res.status(200).json({message: 'Success'})
})


/*
  @desc     Remove target user from following list and remove self from target follower list
  @route    POST /api/users/unfollow/:userId
  @access   Private
*/
const unfollowOne = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401)
        throw new Error('User not authorised')
    }
    
    const result = await User.updateOne({'_id': req.params.userId}, {
        $pullAll: {
            followers: [req.user.id]
        }
    })
    
    if (result.matchedCount === 0) {
        res.status(400)
        throw new Error('Not following anyone')
    }

    if (result.matchedCount !== result.modifiedCount) {
        res.status(500)
        throw new Error('Something went wrong')
    }

    const pulled = await User.updateOne({'_id': req.user.id}, {
        $pullAll: {
            following: [req.params.userId]
        }
    })

    res.status(200).json({unfollowed: req.params.userId})
})


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


module.exports = {
    registerUser,
    loginUser,
    followUser,
    unfollowAll,
    unfollowOne
}