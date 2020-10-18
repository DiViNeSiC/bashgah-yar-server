const mongoose = require('mongoose')
const path = require('path')
const { GYM_MANAGER_ROLE } = require('../../Handlers/Constants/roles')

const avatarImageBasePath = 'Uploads/GymManagerAvatars'

const gymManagerSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 4,
        required: 'Username Is Required'
    },
    name: {
        type: String,
        minlength: 3,
        required: 'Name Is Required'
    },
    lastname: {
        type: String,
        minlength: 3,
        required: 'Lastname Is Required'
    },
    email: {
        type: String,
        minlength: 6,
        required: 'Email Is Required'
    },
    password: {
        type: String,
        required: 'Password Is Required'
    },
    phoneNumber: {
        type: String,
        required: 'Phone Number Is Required'
    },
    role: {
        type: String,
        default: GYM_MANAGER_ROLE,
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
    avatarName: String,
    avatarImagePath: String
})

gymManagerSchema.pre('save', function() {
    if (this.avatarName !== '' && this.avatarName != null) {
        return (
            this.avatarImagePath = 
                path.join('/', avatarImageBasePath, this.avatarName)
        )
    }
})

module.exports = mongoose.model('GymManager', gymManagerSchema)
module.exports.avatarImageBasePath = avatarImageBasePath