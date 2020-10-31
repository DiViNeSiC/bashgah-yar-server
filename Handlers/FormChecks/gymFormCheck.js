const Gym = require('../../Models/gym')

module.exports = async (name, city, address, phoneNumber, capacity, gym = null) => {
    let error = null
    const numberRegexp = /^[0-9]+$/
    const allGyms = await Gym.find()

    if (!name) 
        return error = 'نام برای باشگاه نیاز است'

    if (!city) 
        return error = 'شهر برای باشگاه نیاز است'

    if (!address) 
        return error = 'نشانی برای باشگاه نیاز است'

    if (!phoneNumber) 
        return error = 'شماره تلفن برای باشگاه نیاز است'

    if (!capacity) 
        return error = 'ظرفیت برای باشگاه نیاز است'
    
    if (!numberRegexp.test(phoneNumber)) 
        return error = 'شماره تلفن باید شامل عدد باشد'

    if (name.length < 5) 
        return error = 'نام باشگاه باید شامل هشت کاراکتر باشد' 

    const nameExist = allGyms.some(gym => gym.name === name)
    const phoneNumberExist = allGyms.some(gym => gym.phoneNumber === phoneNumber)

    if (gym) {
        if (phoneNumberExist && gym.phoneNumber !== phoneNumber)
            return error = 'باشگاهی دیگر با همین شماره تلفن وجود دارد'
        if (nameExist && gym.name !== name) 
            return error = 'باشگاهی دیگر با همین نام وجود دارد'
    }
    if (!gym) {
        if (phoneNumberExist) 
            return error = 'باشگاهی دیگر با همین شماره تلفن وجود دارد'
        if (nameExist) 
            return error = 'باشگاهی دیگر با همین نام وجود دارد'
    }
    return error
}