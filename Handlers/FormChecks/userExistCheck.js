const User = require('../../Models/User')

module.exports = async (username, email, phoneNumber) => {
    let error = null
    const allUsers = await User.find()
    
    const usernameExist = allUsers.some(user => 
        user.username === username.toLowerCase()
    )

    const phoneNumberExist = allUsers.some(user => 
        user.phoneNumber === phoneNumber
    )

    const emailExist = allUsers.some(user => 
        user.email === email?.toLowerCase()
    )

    if (usernameExist) 
        return error = 'کاربری دیگر با این نام کاربری وجود دارد'

    if (phoneNumberExist) 
        return error = 'کاربری دیگر با این شماره تلفن وجود دارد'
        
    if (emailExist) 
        return error = 'کاربری دیگر با این ایمیل وجود دارد'

    return error
}