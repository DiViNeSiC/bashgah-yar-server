const fs = require('fs')
const path = require('path')
const User = require('../../Models/User')
const avatarImageBasePath = path.join('public', User.avatarImageBasePath)
const { handlers: { fileHandlers } } = require('../Constants/responseMessages')

module.exports = (fileName) => {
    let error = null
    const filePath = path.join(avatarImageBasePath, fileName)
    fs.unlink(filePath, async (err) => {
        if (err) return error = fileHandlers.deleteAvatarFileError
    })

    return error
}