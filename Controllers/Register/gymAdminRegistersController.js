const bcrypt = require('bcrypt')
const Gym = require('../../Models/Users/gym')
const Manager = require('../../Models/Users/gymManager')
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
        phoneNumber,
        entryPassword
    } = req.body

    const formError = gymFormCheck(
        name, city, address, 
        phoneNumber, capacity, 
        entryPassword
    )

    if (formError) throw formError

    const hashedPassword = await bcrypt.hash(entryPassword, 10)

    const newGym = new Gym({
        name,
        city,
        address,
        capacity,
        phoneNumber,
        gymImageNames,
        entryPassword: hashedPassword
    })

    try {
        await newGym.save()

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
        password, phoneNumber
    )

    if (formError) throw formError

    const userExist = userExistCheck(username, email)

    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)

    const newManager = new Manager({
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

    const gym = await Gym.findById(gymId) 
    const gymManagers = gym.managers
    const newList = [...gymManagers, newManager.username]

    try {
        await newManager.save()
        await gym.updateOne({ managers: newList })

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