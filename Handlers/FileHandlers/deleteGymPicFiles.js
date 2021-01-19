const fs = require('fs')
const path = require('path')
const Gym = require('../../Models/Gym')
const gymImagesBasePath = path.join('public', Gym.gymImageBasePath)
const { handlers: { fileHandlers } } = require('../Constants/responseMessages')

module.exports = (fileNames) => {
    let error = null
    fileNames.forEach(filename => {
        const filePath = path.join(gymImagesBasePath, filename)
        fs.unlink(filePath, async (err) => {
            if (err) return error = fileHandlers.deleteGymPicFileError
        })
    })

    return error
}