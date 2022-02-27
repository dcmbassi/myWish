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

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser
}