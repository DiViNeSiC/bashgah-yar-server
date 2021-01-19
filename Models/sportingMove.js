const mongoose = require('mongoose')
const path = require('path')
const gifsBasePath = 'Uploads/SportingMoveGifs'

const sportingMoveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        main: Number,
        sub: Number
    },
    notes: String,
    gifName: String,
    gifPath: String,
}, { timestamps: true })

sportingMoveSchema.pre('save', function() {
    if (this.gifName !== '' && this.gifName != null) {
        return this.gifPath = path.join('/', gifsBasePath, this.gifName)
    }
})

module.exports = mongoose.model('SportingMove', sportingMoveSchema)
module.exports.gifsBasePath = gifsBasePath