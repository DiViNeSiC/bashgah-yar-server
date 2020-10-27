const multer = require('multer')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']
const path = require('path')
const User = require('../../Models/User')
const avatarImageBasePath = path.join('public', User.avatarImageBasePath)

const uploadAvatar = multer({
    dest: avatarImageBasePath,
    fileFilter: (req, file, callback) => { 
        callback(null, imageMimeTypes.includes(file.mimetype)) 
    }
})

module.exports = uploadAvatar