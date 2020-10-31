const User = require('../../Models/User')

module.exports = async (allUsers) => {
    let error = null
    try {
        await User.deleteMany({ _id: allUsers })
        return error
    } catch {
        return error = 'خطا در پاک کردن باشگاه'
    }
}