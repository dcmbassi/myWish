const mongoose = require("mongoose");


const antiwishSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Antiwish', antiwishSchema)