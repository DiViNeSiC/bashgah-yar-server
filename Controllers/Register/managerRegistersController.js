const bcrypt = require('bcrypt')
const Athlete = require('../../Models/Users/athlete')
const Coach = require('../../Models/Users/gymCoach')
const Gym = require('../../Models/Users/gym')
const formCheck = require('../../Handlers/FormChecks/formCheck')
const userExistCheck = require('../../Handlers/FormChecks/userExistCheck')
const { GYM_COACH_ROLE, ATHLETE_ROLE } = require('../../Handlers/Constants/roles')
s
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

    const userExist = userExistCheck(username, email)

    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)

    const newCoach = new Coach({
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

    const gym = await Gym.findById(req.payload.gym) 
    const gymCoaches = gym.coaches
    const newList = [...gymCoaches, newCoach.username]

    try {
        await newCoach.save()
        await gym.updateOne({ coaches: newList })

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

    const userExist = userExistCheck(username, email)

    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)

    const newAthlete = new Athlete({
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

    const gym = await Gym.findById(req.payload.gym) 
    const gymAthletes = gym.athletes
    const newList = [...gymAthletes, newAthlete.username]

    try {
        await newAthlete.save()
        await gym.updateOne({ athletes: newList })

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