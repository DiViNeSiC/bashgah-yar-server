const User = require('../Models/User')
const { handlers: { gymForm } } = require('./Constants/responseMessages')

module.exports = async (userIds) => {
    let error = null
    try {
        await User.deleteMany({ _id: userIds })
        return error
    } catch { return error = gymForm.gymUsersAccountDeleteError }
}