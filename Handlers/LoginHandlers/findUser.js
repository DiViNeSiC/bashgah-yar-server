const User = require('../../Models/User')

module.exports = async (credential) => {
    if (!credential) return null
    const allUsers = await User.find()
    const userMainInfo = credential.toLowerCase()
    return allUsers.find(user =>
        user.username === userMainInfo ||
        user.email === userMainInfo ||
        user.phoneNumber === userMainInfo
    )
}