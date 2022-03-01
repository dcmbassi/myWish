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
    if (req.params.userId === req.user.id) {
        res.redirect('../wishes')
    } else {
        const wishList = await Wish.find({owner: req.params.userId})
        res.status(200).json(wishList)
    }
    
})

/*
  @desc     Create new wish
  @route    POST /api/wishes
  @access   Private
*/
const addNewWish = asyncHandler(async (req, res) => {
    const {name, description, minPrice, maxPrice} = req.body

    if (!name) {
        res.status(400)
        throw new Error('Please fill in the name field')
    } else {
        const wish = await Wish.create({
            name,
            description,
            priceRange: [minPrice, maxPrice],
            owner: req.user.id
        })

        res.status(201).json(wish)
    }
})

/*
  @desc     Update user wish
  @route    PUT /api/wishes/:wishID
  @access   Private
*/
const updateWish = asyncHandler(async (req, res) => {
    if (!req.wish) {
        res.status(400)
        throw new Error('Wish not found')
    }

    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    const updatedWish = await Wish.findByIdAndUpdate(req.params.wishId, req.body, {new: true})
    res.status(200).json(updatedWish)
})

/*
  @desc     Delete user wish
  @route    DELETE /api/wishes/:wishID
  @access   Private
*/
const deleteWish = asyncHandler(async (req, res) => {
    if (!req.wish) {
        res.status(400)
        throw new Error('Wish not found')
    }

    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    await req.wish.remove()
    res.status(200).json({deletedWishId: req.params.wishId})
})

/*
  @desc     Tag a wish
  @route    PUT /api/wishes/tag/:wishID
  @access   Private
*/
const tagWish = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401)
        throw new Error('User not authorised')
    }

    const wish = await Wish.findById(req.params.wishId)
    
    if (!wish) {
        res.status(400)
        throw new Error('Wish not found')
    }

    if (wish.owner.toString() === req.user.id) {
        res.status(400)
        throw new Error('Cannot tag own wish')
    }

    const user = await User.findById(req.user.id)

    if (user.taggedItems.includes(req.params.wishId) || wish.taggedBy.includes(req.user.id)) {
        res.status(400)
        throw new Error('You already tagged this wish')
    }
    user.taggedItems.push(req.params.wishId)
    user.save()
    wish.taggedBy.push(req.user.id)
    wish.save()

    res.status(200).json({tagged: user.taggedItems.slice(-1)[0]})
})

/*
  @desc     Tag a wish
  @route    PUT /api/wishes/tag/:wishID/remove
  @access   Private
*/
const untagWish = asyncHandler(async (req, res) => {
    if (!req.user) {
        res.status(401)
        throw new Error('User not authorised')
    }

    const result = await Wish.updateOne({'_id': req.params.wishId}, {
        $pullAll: {
            taggedBy: [req.user.id]
        }
    })

    if (result.matchedCount === 0) {
        res.status(400)
        throw new Error('You had not tagged this wish')
    }

    const pulled = await User.updateOne({'_id': req.user.id}, {
        $pullAll: {
            taggedItems: [req.params.wishId]
        }
    })

    res.status(200).json({untagged: req.params.wishId})
})


module.exports = {
    fetchMyWishList,
    fetchFriendWishList,
    addNewWish,
    updateWish,
    deleteWish,
    tagWish,
    untagWish
}