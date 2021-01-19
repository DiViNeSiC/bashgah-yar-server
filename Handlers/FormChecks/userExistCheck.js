const User = require('../../Models/User')
const { handlers: { userForm } } = require('../Constants/responseMessages')

module.exports = async (username, email, phoneNumber, updatingUser = null) => {
    let error = null
    const allUsers = await User.find()
    
    const usernameExist = allUsers.some(user => {
        if (!username) return false
        return user.username === username.toLowerCase()
    })
    
    const phoneNumberExist = allUsers.some(user => {
        if (!phoneNumber) return false
        return user.phoneNumber === phoneNumber
    })

    const emailExist = allUsers.some(user => {
        if (!email) return false
        return user.email === email.toLowerCase()
    })

    if (updatingUser) {
        if (emailExist && updatingUser.email !== email.toLowerCase()) return error = userForm.emailExistError
        if (phoneNumberExist && updatingUser.phoneNumber !== phoneNumber) return error = userForm.phoneNumberExistError
        if (usernameExist && updatingUser.username !== username.toLowerCase()) return error = userForm.usernameExistError
    } 

    if (!updatingUser) {
        if (emailExist) return error = userForm.emailExistError
        if (usernameExist) return error = userForm.usernameExistError
        if (phoneNumberExist) return error = userForm.phoneNumberExistError
    }
    return error
}