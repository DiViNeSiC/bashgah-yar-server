module.exports = (name, city, address, phoneNumber, capacity, entryPassword) => {
    let error = null

    if (!name) return error = 'نام برای باشگاه نیاز است'

    if (!city) return error = 'شهر برای باشگاه نیاز است'

    if (!address) return error = 'نشانی برای باشگاه نیاز است'

    if (!phoneNumber) return error = 'شماره تلفن برای باشگاه نیاز است'

    if (!capacity) return error = 'ظرفیت برای باشگاه نیاز است'
    
    if (!entryPassword) return error = 'رمز ورودی برای باشگاه نیاز است'

    if (name.length < 5) 
        return error = 'نام باشگاه باید شامل هشت کاراکتر باشد' 

    if (entryPassword.length < 8) 
        return error = 'رمز ورودی باید شامل هشت کاراکتر باشد' 

    return error
}