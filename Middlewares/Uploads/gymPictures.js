const multer = require('multer')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']
const path = require('path')
const Gym = require('../../Models/Gym')
const gymImageBasePath = path.join('public', Gym.gymImageBasePath)

const uploadGymImage = multer({
    dest: gymImageBasePath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype)) 
    }
})

module.exports = uploadGymImage