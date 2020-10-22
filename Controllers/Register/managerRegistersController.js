const bcrypt = require('bcrypt')
const User = require('../../Models/User')
const Gym = require('../../Models/gym')
const formCheck = require('../../Handlers/FormChecks/formCheck')
const userExistCheck = require('../../Handlers/FormChecks/userExistCheck')
const { GYM_COACH_ROLE, ATHLETE_ROLE } = require('../../Handlers/Constants/roles')

const coachRegister = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : ''
    const {
        username,
        name,
        lastname,
        email,
        password,
        phoneNumber
    } = req.body

    const formError = formCheck(
        username, name, 
        lastname, email, 
        password, phoneNumber
    )

    if (formError) throw formError

    const userExist = await userExistCheck(username, email, phoneNumber)

    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)

    const newCoach = new User({
        username,
        name,
        lastname,
        email,
        phoneNumber,
        avatarName,
        password: hashedPassword,
        gym: req.payload.gym,
        role: GYM_COACH_ROLE
    })

    //FIX ADDING USER ID TO THE SPECIFIC GYM

    try {
        await newCoach.save()

        res.json({
            message: `ثبت شد ${username} مربی جدید با نام کاربری`
        })
    } catch {
        res.status(500).json({ 
            errorMessage: `ثبت مربی جدید موفقیت آمیز نبود`
        })
    }
}

const athleteRegister = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : ''
    const {
        username,
        name,
        lastname,
        email,
        password,
        phoneNumber
    } = req.body

    const formError = formCheck(
        username, name, 
        lastname, email, 
        password, phoneNumber
    )

    if (formError) throw formError

    const userExist = await userExistCheck(username, email, phoneNumber)

    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)

    const newAthlete = new User({
        username,
        name,
        lastname,
        email,
        phoneNumber,
        avatarName,
        gym: req.payload.gym,
        password: hashedPassword,
        role: ATHLETE_ROLE
    })

    //FIX ADDING USER ID TO THE SPECIFIC GYM

    try {
        await newAthlete.save()

        res.json({
            message: `ثبت شد ${username} ورزشکار جدید با نام کاربری`
        })
    } catch {
        res.status(500).json({ 
            errorMessage: `ثبت ورزشکار جدید موفقیت آمیز نبود`
        })
    }
}

module.exports = { coachRegister, athleteRegister }