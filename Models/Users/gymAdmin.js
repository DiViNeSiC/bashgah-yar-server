const mongoose = require('mongoose')
const path = require('path')
const { GYM_ADMIN_ROLE } = require('../../Handlers/Constants/roles')

const avatarImageBasePath = 'Uploads/GymAdminAvatars'

const gymAdminSchema = new mongoose.Schema({
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
    email: {
        type: String,
        minlength: 5,
        required: 'Email Is Required'
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
        default: GYM_ADMIN_ROLE,
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
    gyms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gym'
        }
    ],
    avatarName: String,
    avatarImagePath: String
})

gymAdminSchema.pre('save', function() {
    if (this.avatarName !== '' && this.avatarName != null) {
        return (
            this.avatarImagePath = 
                path.join('/', avatarImageBasePath, this.avatarName)
        )
    }
})

module.exports = mongoose.model('GymAdmin', gymAdminSchema)
module.exports.avatarImageBasePath = avatarImageBasePath