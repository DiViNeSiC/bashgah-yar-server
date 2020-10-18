const mongoose = require('mongoose')
const path = require('path')
const { SITE_ADMIN_ROLE } = require('../../Handlers/Constants/roles')

const avatarImageBasePath = 'Uploads/SiteAdminAvatars'

const siteAdminSchema = new mongoose.Schema({
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
        default: SITE_ADMIN_ROLE,
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
    avatarName: String,
    avatarImagePath: String
})

siteAdminSchema.pre('save', function() {
    if (this.avatarName !== '' && this.avatarName != null) {
        return (
            this.avatarImagePath = 
                path.join('/', avatarImageBasePath, this.avatarName)
        )
    }
})

module.exports = mongoose.model('SiteAdmin', siteAdminSchema)
module.exports.avatarImageBasePath = avatarImageBasePath