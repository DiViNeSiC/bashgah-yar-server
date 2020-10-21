module.exports = (
    username, name, 
    lastname, email, 
    password, phoneNumber, 
    emailChecking = false
) => {
    let error = null

    if (!username) 
        return error = 'نام کاربری نیاز است' 

    if (!name) 
        return error = 'نام نیاز است' 

    if (!lastname) 
        return error = 'نام خانوادگی نیاز است' 

    if (!password) 
        return error = 'رمز عبور نیاز است' 

    if (!phoneNumber) 
        return error = 'شماره تلفن نیاز است' 

    if (username.length < 6) 
        return error = 'نام کاربری حداقل باید شامل شش کاراکتر باشد' 

    if (password.length < 8) 
        return error = 'رمز عبور باید شامل هشت کاراکتر باشد' 

    if (emailChecking) {
        if (!email) 
            return error = 'ایمیل نیاز است' 
        
        if (email.length < 5) 
            return error = 'ایمیل باید شامل پنج کاراکتر باشد' 
    }

    return error
}