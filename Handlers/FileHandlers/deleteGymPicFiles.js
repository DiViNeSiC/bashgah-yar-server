const path = require('path')
const fs = require('fs')
const Gym = require('../../Models/Gym')
const gymImagesBasePath = path.join('public', Gym.gymImageBasePath)

module.exports = (fileNames) => {
    let error = null
    fileNames.forEach(filename => {
        const filePath = path.join(gymImagesBasePath, filename)
        fs.unlink(filePath, async (err) => {
            if (err) return error = 'خطا در پاک کردن فایل تصویر باشگاه'
        })
    })

    return error
}