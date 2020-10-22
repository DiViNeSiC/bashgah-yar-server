const User = require('../../Models/User')

module.exports = async (credential) => {
    const userMainInfo = credential?.toLowerCase()

    const allUsers = await User.find()

    return allUsers.find(user => 
        user.username === userMainInfo ||
        user.email === userMainInfo ||
        user.phoneNumber === userMainInfo
    )
}