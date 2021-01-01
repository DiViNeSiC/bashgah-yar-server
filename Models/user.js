const mongoose = require('mongoose')
const path = require('path')
const avatarImageBasePath = 'Uploads/UserAvatars'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        default: '',
        lowercase: true
    },
    verifiedEmail: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
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
    forgotPassToken: {
        data: String,
        default: ''
    },
    confirmationToken: {
        data: String,
        default: ''
    },
    timeBasedCode: {
        type: String,
        default: ''
    },
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym'
    },
    adminGyms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gym'
        }
    ],
    name: String,
    lastname: String,
    password: String,
    phoneNumber: String,
    avatarName: String,
    avatarImagePath: String
}, { timestamps: true })

userSchema.pre('save', function() {
    if (this.avatarName !== '' && this.avatarName != null) {
        return (
            this.avatarImagePath = 
                path.join('/', avatarImageBasePath, this.avatarName)
        )
    }
})

module.exports = mongoose.model('User', userSchema)
module.exports.avatarImageBasePath = avatarImageBasePath