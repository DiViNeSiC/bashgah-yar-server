const mongoose = require('mongoose')
const path = require('path')
const { ATHLETE_ROLE } = require('../../Handlers/Constants/roles')

const avatarImageBasePath = 'Uploads/AthleteAvatars'

const athleteSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 6,
        required: 'Username Is Required'
    },
    name: {
        type: String,
        required: 'Name Is Required'
    },
    lastname: {
        type: String,
        required: 'Lastname Is Required'
    },
    password: {
        type: String,
        minlength: 8,
        required: 'Password Is Required'
    },
    phoneNumber: {
        type: String,
        required: 'Phone Number Is Required'
    },
    role: {
        type: String,
        default: ATHLETE_ROLE,
        required: true
    },
    entryToken: {
        data: String,
        default: ''
    },
    refreshToken: {
        data: String,
        default: ''
    },
    resetPassToken: {
        data: String,
        default: ''
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym'
    },
    email: String,
    avatarName: String,
    avatarImagePath: String
})

athleteSchema.pre('save', function() {
    if (this.avatarName !== '' && this.avatarName != null) {
        return (
            this.avatarImagePath = 
                path.join('/', avatarImageBasePath, this.avatarName)
        )
    }
})

module.exports = mongoose.model('Athlete', athleteSchema)
module.exports.avatarImageBasePath = avatarImageBasePath