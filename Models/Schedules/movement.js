const mongoose = require('mongoose')

const movementSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: true
    },
    description: String,
    gifName: String,
    gifPath: String,
    hints: String
})

module.exports = mongoose.model('Movement', movementSchema)