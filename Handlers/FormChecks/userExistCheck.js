const User = require('../../Models/User')

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
        if (usernameExist && updatingUser.username !== username.toLowerCase()) 
            return error = 'کاربری دیگر با این نام کاربری وجود دارد'
        if (phoneNumberExist && updatingUser.phoneNumber !== phoneNumber) 
            return error = 'کاربری دیگر با این شماره تلفن وجود دارد'
        if (emailExist && updatingUser.email !== email.toLowerCase()) 
            return error = 'کاربری دیگر با این ایمیل وجود دارد'
    } 

    if (!updatingUser) {
        if (emailExist) 
            return error = 'کاربری دیگر با این ایمیل وجود دارد'
        if (usernameExist) 
            return error = 'کاربری دیگر با این نام کاربری وجود دارد'
        if (phoneNumberExist) 
            return error = 'کاربری دیگر با این شماره تلفن وجود دارد'
    }
    return error
}