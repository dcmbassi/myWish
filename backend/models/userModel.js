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
    friends: [{userId: mongoose.Schema.Types.ObjectId}],
    requested: [{userId: mongoose.Schema.Types.ObjectId}],
    pending: [{userId: mongoose.Schema.Types.ObjectId}],
    taggedItems: [{userId: mongoose.Schema.Types.ObjectId}]
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)