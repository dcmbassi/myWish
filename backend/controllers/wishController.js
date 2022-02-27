const asyncHandler = require('express-async-handler')
const Wish = require('../models/wishModel')
const User = require('../models/userModel')

/*
  @desc     Get user's wishes
  @route    GET /api/wishes
  @access   Private
*/
const fetchMyWishList = asyncHandler(async (req, res) => {
    const wishList = await Wish.find({owner: req.user.id})
    res.status(200).json(wishList)
})

/*
  @desc     Get friend's wishes
  @route    GET /api/wishes/:userId
  @access   Private
*/
const fetchFriendWishList = asyncHandler(async (req, res) => {
    const wishList = await Wish.find({owner: req.params.userId})
    res.status(200).json(wishList)
})

/*
  @desc     Create new wish
  @route    POST /api/wishes
  @access   Private
*/
const addNewWish = asyncHandler(async (req, res) => {
    const {name, description, price} = req.body

    if (!name) {
        res.status(400)
        throw new Error('Please fill in the name field')
    } else {
        const wish = await Wish.create({
            name,
            description,
            price,
            owner: req.user.id
        })

        res.status(201).json(wish)
    }
})


module.exports = {
    fetchMyWishList,
    fetchFriendWishList,
    addNewWish
}