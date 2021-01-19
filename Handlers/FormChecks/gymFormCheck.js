const Gym = require('../../Models/Gym')
const { handlers: { gymForm } } = require('../Constants/responseMessages')

module.exports = async (name, city, address, phoneNumber, capacity, gym = null) => {
    let error = null
    const numberRegexp = /^[0-9]+$/
    const allGyms = await Gym.find()

    if (!name) return error = gymForm.gymNameExist
    if (!city) return error = gymForm.gymCityNeeded
    if (!address) return error = gymForm.gymAddressNeeded
    if (!capacity) return error = gymForm.gymCapacityNeeded
    if (!phoneNumber) return error = gymForm.gymPhoneNumberNeeded
    
    if (name.length < 4) return error = gymForm.nameLengthError
    if (!numberRegexp.test(phoneNumber)) return error = gymForm.phoneNumberRegExpError

    const nameExist = allGyms.some(gym => gym.name === name)
    const phoneNumberExist = allGyms.some(gym => gym.phoneNumber === phoneNumber)

    if (gym) {
        if (nameExist && gym.name !== name) return error = gymForm.gymNameExist
        if (phoneNumberExist && gym.phoneNumber !== phoneNumber) return error = gymForm.gymPhoneNumberExist
    }
    if (!gym) {
        if (nameExist) return error = gymForm.gymNameExist
        if (phoneNumberExist) return error = gymForm.gymPhoneNumberExist
    }
    return error
}