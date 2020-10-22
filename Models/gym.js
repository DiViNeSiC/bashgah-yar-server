const mongoose = require('mongoose')
const path = require('path')

const gymImageBasePath = 'Uploads/GymImages'

const gymSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    managers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    coaches: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    athletes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    name: {
        type: String,
        required: 'Name Is Required'
    },
    city: {
        type: Number,
        required: 'City Is Required'
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
    entryPassword: {
        type: String,
        minlength: 8,
        required: true
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

gymSchema.pre('save', function() {
    if (this.gymImageNames != null && this.admin != null) {
        return this.gymImagePaths = this.gymImageNames.map(name => 
            path.join('/', gymImageBasePath, name)
        )
    }
})

module.exports = mongoose.model('Gym', gymSchema)
module.exports.gymImageBasePath = gymImageBasePath