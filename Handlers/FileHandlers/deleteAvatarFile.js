const path = require('path')
const fs = require('fs')
const User = require('../../Models/User')
const avatarImageBasePath = path.join('public', User.avatarImageBasePath)

module.exports = (fileName) => {
    let error = null
    const filePath = path.join(avatarImageBasePath, fileName)

    fs.unlink(filePath, async (err) => {
        if (err) 
            return error = 'خطا در پاک کردن فایل آواتار'
    })

    return error
}