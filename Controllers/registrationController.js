const bcrypt = require('bcrypt')
const Gym = require('../Models/Gym')
const User = require('../Models/User')
const formCheck = require('../Handlers/FormChecks/formCheck')
const gymFormCheck = require('../Handlers/FormChecks/gymFormCheck')
const userExistCheck = require('../Handlers/FormChecks/userExistCheck')
const { registrationController: { errorMsgs, successMsgs } } = require('../Handlers/Constants/responseMessages')
const { SITE_ADMIN_ROLE, GYM_ADMIN_ROLE, GYM_COACH_ROLE, ATHLETE_ROLE, GYM_MANAGER_ROLE } = require('../Handlers/Constants/roles')

exports.siteAdminRegistration = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : ''
    const { username, name, lastname, email, password, phoneNumber, registrationPassword } = req.body

    const passwordPassed = await bcrypt.compare(registrationPassword, process.env.ADMIN_REGISTRATION_PASSWORD)
    if (!passwordPassed) throw errorMsgs.wrongAdminPassword

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
        res.json({ message: `"${username}" :${successMsgs.successSiteAdmin}` })
    } catch {
        res.status(500).json({ message: errorMsgs.userRegisterError })
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
        res.json({ message: `"${username}" :${successMsgs.successGymAdmin}` })
    } catch {
        res.status(500).json({ message: errorMsgs.userRegisterError })
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
        res.json({ message: `"${name}" :${successMsgs.successGymAccount}` })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.gymRegisterError })
    }
}

exports.managerRegister = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : ''
    const { username, name, lastname, gymId, email, password, phoneNumber } = req.body

    const gym = await Gym.findById(gymId)
    if (!gym) throw errorMsgs.gymIdNeeded
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
        res.json({ message: `"${username}" :${successMsgs.successGymManager}` })
    } catch {
        res.status(500).json({ message: errorMsgs.userRegisterError })
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
        res.json({ message: `"${username}" :${successMsgs.successGymCoach}` })
    } catch {
        res.status(500).json({ message: errorMsgs.userRegisterError })
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
        res.json({ message: `"${username}" :${successMsgs.successGymAthlete}` })
    } catch {
        res.status(500).json({ message: errorMsgs.userRegisterError })
    }
}