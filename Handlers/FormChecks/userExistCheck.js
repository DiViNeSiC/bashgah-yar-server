const User = require('../../Models/User')

module.exports = async (username, email, phoneNumber) => {
    let error = null
    const allUsers = await User.find()
    
    const usernameExist = allUsers.some(user => 
        user.username === username.toLowerCase()
    )

    if (usernameExist) 
        return error = 'کاربری دیگر با این نام کاربری وجود دارد'

    const phoneNumberExist = allUsers.some(user => 
        user.phoneNumber === phoneNumber
    )

    if (phoneNumberExist) 
        return error = 'کاربری دیگر با این شماره تلفن وجود دارد'

    const emailExist = allUsers.some(user => 
        user.email === email?.toLowerCase()
    )

    if (emailExist) 
        return error = 'کاربری دیگر با این ایمیل وجود دارد'

    return error
}