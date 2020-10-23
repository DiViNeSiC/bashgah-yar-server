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

    const formError = await gymFormCheck(
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
        gymImageNames,
        admin: req.payload._id
    })

    try {
        await newGym.save()

        const admin = await User.findById(req.payload._id)
        const { adminGyms } = admin
        const newGyms = [...adminGyms, newGym.id]
        
        await admin.updateOne({ adminGyms: newGyms })

        res.json({
            message: `ثبت شد ${name} باشگاه جدید با نام `
        })
    } catch (err) {
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

    try {
        await newManager.save()

        const gym = await Gym.findById(gymId)
        const { managers } = gym
        const newManagers = [...managers, newManager.id]
        
        await gym.updateOne({ managers: newManagers })


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