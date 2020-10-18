const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({ 
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GymCoach',
        required: true
    },
    athlete: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Athlete',
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    bloodType: {
        type: Number,
        required: true
    },
    disease: {
        type: Array,
        default: []
    },
    movements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movement'
        }
    ],
})

module.exports = mongoose.model('Schedule', scheduleSchema)