const mongoose = require('mongoose')
const path = require('path')

const gifBasePath = 'Uploads/MovementGifs'

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

movementSchema.pre('save', function() {
    if (this.gifName !== '' && this.gifName != null) {
        return (
            this.gifPath = path.join('/', gifBasePath, this.gifName)
        )
    }
})

module.exports = mongoose.model('Movement', movementSchema)
module.exports.gifBasePath = gifBasePath