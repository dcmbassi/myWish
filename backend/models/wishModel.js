const mongoose = require("mongoose");


const wishSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    tags: {
        type: Number
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Wish', wishSchema)