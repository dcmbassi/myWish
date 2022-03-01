const asyncHandler = require("express-async-handler");
const Antiwish = require("../models/antiwishModel");
const User = require('../models/userModel')


/*
  @desc     Get user's antiwishes
  @route    GET /api/antiwishes
  @access   Private
*/
const fetchMyWackList = asyncHandler(async (req, res) => {
    const wacklist = await Antiwish.find({owner: req.user.id})
    res.status(200).json(wacklist)
})

/*
  @desc     Get friend's antiwishes
  @route    GET /api/antiwishes/:userId
  @access   Private
*/
const fetchFriendWacklist = asyncHandler(async (req, res) => {
    if (req.params.userId === req.user.id) {
        res.redirect('../antiwishes')
    } else {
        const wacklist = await Antiwish.find({owner: req.params.userId})
        res.status(200).json(wacklist)
    }
})

/*
  @desc     Create new antiwish
  @route    POST /api/antiwishes
  @access   Private
*/
const addNewAntiwish = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if (!name) {
        res.status(400)
        throw new Error('Please fill in the name field')
    }

    const antiwish = await Antiwish.create({
        name,
        description,
        owner: req.user.id
    })

    res.status(201).json(antiwish)
})

/*
  @desc     Update user antiwish
  @route    PUT /api/antiwishes/:antiwishId
  @access   Private
*/
const updateAntiwish = asyncHandler(async (req, res) => {
    const antiwish = await Antiwish.findById(req.params.antiwishId)
    
    if (!antiwish) {
        res.status(400)
        throw new Error('Antiwish not found')
    }

    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (req.user.id !== antiwish.owner) {
        res.status(401)
        throw new Error('User does not own this resource')
    }

    const updatedAntiwish = await Antiwish.findByIdAndUpdate(
        req.params.antiwishId, 
        req.body, 
        {new: true}
    )
    res.status(201).json(updatedAntiwish)
})

/*
  @desc     Delete user antiwish
  @route    DELETE /api/antiwishes/:antiwishId
  @access   Private
*/
const deleteAntiwish = asyncHandler(async (req, res) => {
    const antiwish = await Antiwish.findById(req.params.antiwishId)
    
    if (!antiwish) {
        res.status(400)
        throw new Error('Antiwish not found')
    }

    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (req.user.id !== antiwish.owner) {
        res.status(401)
        throw new Error('User does not own this resource')
    }

    await antiwish.remove()
    res.status(201).json({deletedAntiwishId: req.params.antiwishId})
})

module.exports = {
    fetchMyWackList,
    fetchFriendWacklist,
    addNewAntiwish,
    updateAntiwish,
    deleteAntiwish
}