const mongoose = require('mongoose')

const gymSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GymAdmin',
        required: true
    },
    managers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GymManager'
        }
    ],
    coaches: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GymCoach'
        }
    ],
    athletes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Athlete'
        }
    ],
    entryPassword: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: 'Address Is Required'
    },
    capacity: {
        type: Number,
        required: 'Capacity Is Required'
    },
    phoneNumber: {
        type: String,
        required: 'Phone Number Is Required'
    },
    gymImageNames: {
        type: Array,
        maxlength: 12,
        default: []
    },
    gymImagePaths: {
        type: Array, 
        maxlength: 12,
        default: []
    }
})

module.exports = mongoose.model('Gym', gymSchema)