const User = require('../Models/User')

module.exports = async (userIds) => {
    let error = null
    try {
        await User.deleteMany({ _id: userIds })
        return error
    } catch {
        return error = 'خطا در پاک کردن باشگاه'
    }
}