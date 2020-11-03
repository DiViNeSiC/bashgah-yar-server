const path = require('path')
const multer = require('multer')
const Gym = require('../Models/Gym')
const User = require('../Models/User')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']
const gymImageBasePath = path.join('public', Gym.gymImageBasePath)
const avatarImageBasePath = path.join('public', User.avatarImageBasePath)

const avatarUpload = multer({
    dest: avatarImageBasePath,
    fileFilter: (req, file, callback) => { 
        callback(null, imageMimeTypes.includes(file.mimetype)) 
    }
})

const gymPicUpload = multer({
    dest: gymImageBasePath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype)) 
    }
})

module.exports = { avatarUpload, gymPicUpload }