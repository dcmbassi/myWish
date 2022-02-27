const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    firstName:  {
        type: String
    },
    lastName: {
        type: String,
        required: [true, 'Please enter a name']
    },
    email: {
        type: String,
        required: [true, 'Please enter a valid email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password']
    },
    friends: [{userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    }],
    following: [{userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    }],
    followers: [{userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    }],
    taggedItems: [{wishId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wish'
        }}]
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)