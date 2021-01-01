const bcrypt = require('bcrypt')
const User = require('../Models/User')
const Gym = require('../Models/Gym')
const formCheck = require('../Handlers/FormChecks/formCheck')
const gymFormCheck = require('../Handlers/FormChecks/gymFormCheck')
const userExistCheck = require('../Handlers/FormChecks/userExistCheck')
const { SITE_ADMIN_ROLE, GYM_ADMIN_ROLE, GYM_COACH_ROLE, ATHLETE_ROLE, GYM_MANAGER_ROLE } = require('../Handlers/Constants/roles')

exports.siteAdminRegistration = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : ''
    const { username, name, lastname, email, password, phoneNumber, registrationPassword } = req.body

    const passwordPassed = await bcrypt.compare(registrationPassword, process.env.ADMIN_REGISTRATION_PASSWORD)
    if (!passwordPassed) throw '!رمز ورودی برای ثبت ادمین اشتباه است'

    const formError = formCheck(username, name, lastname, email, password, phoneNumber, true)
    if (formError) throw formError
    
    const userExist = await userExistCheck(username, email, phoneNumber)
    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)
    const newSiteAdmin = new User({
        role: SITE_ADMIN_ROLE, username, name, lastname,
        password: hashedPassword, email, phoneNumber, avatarName,
    })

    try {
        await newSiteAdmin.save()
        res.json({ message: `ثبت شد ${username} مدیر سایت جدید با نام کاربری` })
    } catch {
        res.status(500).json({ message: `ثبت مدیر سایت جدید موفقیت آمیز نبود` })
    }
}

exports.gymAdminRegister = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : ''
    const { username, name, lastname, email, password, phoneNumber } = req.body

    const formError = formCheck(username, name, lastname, email, password, phoneNumber, true)
    if (formError) throw formError

    const userExist = await userExistCheck(username, email, phoneNumber)
    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)
    const newGymAdmin = new User({
        password: hashedPassword, role: GYM_ADMIN_ROLE,
        username, name, lastname, email, phoneNumber, avatarName,
    })

    try {
        await newGymAdmin.save()
        res.json({ message: `ثبت شد ${username} مدیر کل جدید با نام کاربری` })
    } catch {
        res.status(500).json({ message: `ثبت مدیر کل جدید موفقیت آمیز نبود` })
    }
}

exports.gymRegister = async (req, res) => {
    const admin = await User.findById(req.user.id)
    const gymImageNames = req.files != null ? req.files.map(file => file.filename) : null
    const { name, city, address, capacity, phoneNumber } = req.body

    const formError = await gymFormCheck(name, city, address, phoneNumber, capacity)
    if (formError) throw formError
    const newGym = new Gym({ name, city, address, capacity, phoneNumber, gymImageNames, admin: admin.id })

    try {
        await newGym.save()
        const { adminGyms } = admin
        const newGyms = [...adminGyms, newGym.id]
        await admin.updateOne({ adminGyms: newGyms })
        res.json({ message: `ثبت شد ${name} باشگاه جدید با نام ` })
    } catch (err) {
        res.status(500).json({ message: `ثبت باشگاه جدید موفقیت آمیز نبود` })
    }
}

exports.managerRegister = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : ''
    const { username, name, lastname, gymId, email, password, phoneNumber } = req.body

    const gym = await Gym.findById(gymId)
    if (!gym) throw 'باشگاه مشخص برای ایجاد حساب کاربری نیاز است'
    const formError = formCheck(username, name, lastname, email, password, phoneNumber, true)
    if (formError) throw formError

    const userExist = await userExistCheck(username, email, phoneNumber)
    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)
    const newManager = new User({
        username, name, lastname, email, phoneNumber, avatarName,
        gym: gymId, password: hashedPassword, role: GYM_MANAGER_ROLE,
    })

    try {
        await newManager.save()
        const { managers } = gym
        const newManagers = [...managers, newManager.id]
        await gym.updateOne({ managers: newManagers })
        res.json({ message: `ثبت شد ${username} مدیر باشگاه جدید با نام کاربری` })
    } catch {
        res.status(500).json({ message: `ثبت مدیر باشگاه جدید موفقیت آمیز نبود` })
    }
}

exports.coachRegister = async (req, res) => {
    const loggedUser = await User.findById(req.user.id)
    const gym = await Gym.findById(loggedUser.gym)
    const avatarName = req.file != null ? req.file.filename : ''
    const { username, name, lastname, email, password, phoneNumber } = req.body

    const formError = formCheck(username, name, lastname, email, password, phoneNumber)
    if (formError) throw formError

    const userExist = await userExistCheck(username, email, phoneNumber)
    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)
    const newCoach = new User({
        username, name, lastname, email, phoneNumber, avatarName,
        password: hashedPassword, gym: gym.id, role: GYM_COACH_ROLE
    })

    try {
        await newCoach.save()
        const { coaches } = gym
        const newCoaches = [...coaches, newCoach.id]
        await gym.updateOne({ coaches: newCoaches })
        res.json({ message: `ثبت شد ${username} مربی جدید با نام کاربری` })
    } catch {
        res.status(500).json({ message: `ثبت مربی جدید موفقیت آمیز نبود` })
    }
}

exports.athleteRegister = async (req, res) => {
    const loggedUser = await User.findById(req.user.id)
    const gym = await Gym.findById(loggedUser.gym)
    const avatarName = req.file != null ? req.file.filename : ''
    const { username, name, lastname, email, password, phoneNumber } = req.body

    const formError = formCheck(username, name, lastname, email, password, phoneNumber)
    if (formError) throw formError

    const userExist = await userExistCheck(username, email, phoneNumber)
    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)
    const newAthlete = new User({
        username, name, lastname, email, phoneNumber, avatarName,
        password: hashedPassword, gym: gym.id, role: ATHLETE_ROLE
    })

    try {
        await newAthlete.save()
        const { athletes } = gym
        const newAthletes = [...athletes, newAthlete.id]
        await gym.updateOne({ athletes: newAthletes })
        res.json({ message: `ثبت شد ${username} ورزشکار جدید با نام کاربری` })
    } catch {
        res.status(500).json({ message: `ثبت ورزشکار جدید موفقیت آمیز نبود` })
    }
}