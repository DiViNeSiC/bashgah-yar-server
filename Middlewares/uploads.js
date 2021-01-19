const path = require('path')
const multer = require('multer')
const Gym = require('../Models/Gym')
const User = require('../Models/User')
const Message = require('../Models/Message')
const SportingMove = require('../Models/SportingMove')
const gymImageBasePath = path.join('public', Gym.gymImageBasePath)
const avatarImageBasePath = path.join('public', User.avatarImageBasePath)
const messageFileBasePath = path.join('public', Message.messageFileBasePath)
const sportingMoveGifBasePath = path.join('public', SportingMove.gifsBasePath)

const MimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']

exports.avatarUpload = multer({
    dest: avatarImageBasePath,
    fileFilter: (req, file, callback) => { callback(null, MimeTypes.includes(file.mimetype)) }
})

exports.gymPicUpload = multer({
    dest: gymImageBasePath,
    fileFilter: (req, file, callback) => { callback(null, MimeTypes.includes(file.mimetype)) }
})

exports.sportingMoveGifUpload = multer({
    dest: sportingMoveGifBasePath,
    fileFilter: (req, file, callback) => { callback(null, MimeTypes.includes(file.mimetype)) }
})

exports.messageFileUpload = multer({
    dest: messageFileBasePath,
    fileFilter: (req, file, callback) => { callback(null, MimeTypes.includes(file.mimetype)) }
})