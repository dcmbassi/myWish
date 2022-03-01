const mongoose = require("mongoose");


const wishSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    description: {
        type: String
    },
    priceRange: [{
        type: Number
    }],
    deadline: {
        type: Date
    },
    visibility: {
        type: String,
        default: 'public'
    },
    isAcquired: {
        type: Boolean,
        default: false
    },
    taggedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Wish', wishSchema)