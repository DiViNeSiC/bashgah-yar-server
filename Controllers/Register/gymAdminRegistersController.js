const bcrypt = require('bcrypt')
const Gym = require('../../Models/gym')
const User = require('../../Models/User')
const formCheck = require('../../Handlers/FormChecks/formCheck')
const gymFormCheck = require('../../Handlers/FormChecks/gymFormCheck')
const userExistCheck = require('../../Handlers/FormChecks/userExistCheck')
const { GYM_MANAGER_ROLE } = require('../../Handlers/Constants/roles')

const gymRegister = async (req, res) => {
    const gymImageNames = req.files != null ? 
        req.files.map(file => file.filename) : null

    const {
        name,
        city,
        address,
        capacity,
        phoneNumber
    } = req.body

    const formError = gymFormCheck(
        name, city, address, 
        phoneNumber, capacity
    )

    if (formError) throw formError

    const newGym = new Gym({
        name,
        city,
        address,
        capacity,
        phoneNumber,
        gymImageNames
    })

    try {
        await newGym.save()

        //FIX ADDING GYM ID TO THE GYM ADMIN "console.log(newGym)"

        res.json({
            message: `ثبت شد ${name} باشگاه جدید با نام `
        })
    } catch {
        res.status(500).json({ 
            errorMessage: `ثبت باشگاه جدید موفقیت آمیز نبود`
        })
    }
}

const managerRegister = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : ''
    const {
        username,
        name,
        lastname,
        email,
        password,
        phoneNumber,
        gymId
    } = req.body

    const formError = formCheck(
        username, name, 
        lastname, email, 
        password, phoneNumber, true
    )

    if (formError) throw formError

    const userExist = await userExistCheck(username, email, phoneNumber)

    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)

    const newManager = new User({
        username,
        name,
        lastname,
        email,
        phoneNumber,
        avatarName,
        gym: gymId,
        password: hashedPassword,
        role: GYM_MANAGER_ROLE
    })

    //FIX ADDING USER ID TO THE SPECIFIC GYM

    try {
        await newManager.save()

        res.json({
            message: `ثبت شد ${username} مدیر باشگاه جدید با نام کاربری`
        })
    } catch {
        res.status(500).json({ 
            errorMessage: `ثبت مدیر باشگاه جدید موفقیت آمیز نبود`
        })
    }
}

module.exports = { managerRegister, gymRegister }