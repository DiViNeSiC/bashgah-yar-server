const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    athlete: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movesList: [
        {
            move: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SportingMove'
            },
            checked: {
                type: Boolean,
                default: false
            }
        }
    ],
    progress: {
        type: Number,
        default: 0
    },
}, { timestamps: true })

scheduleSchema.pre('updateOne', function() {
    if (this.movesList.length) {
        const completedMoves = this.movesList.filter(move => move.checked)
        const progressRatio = completedMoves.length / this.movesList.length
        return this.progress = progressRatio * 100
    }
})

module.exports = mongoose.model('Schedule', scheduleSchema)