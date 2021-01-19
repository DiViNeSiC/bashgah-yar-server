const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const sendEmail = require('../Handlers/MessageSenders/emailSender')
const userExistCheck = require('../Handlers/FormChecks/userExistCheck')
const { emailMethods } = require('../Handlers/Constants/sendersMethods')
const deleteAvatarFile = require('../Handlers/FileHandlers/deleteAvatarFile')
const { userController: { errorMsgs, successMsgs, warnMsgs } } = require('../Handlers/Constants/responseMessages')
const { SITE_ADMIN_ROLE, GYM_ADMIN_ROLE, GYM_COACH_ROLE, ATHLETE_ROLE, GYM_MANAGER_ROLE } = require('../Handlers/Constants/roles')

exports.getAllGymAdmins = async (req, res) => {
    const gymAdmins = await User.find({ role: GYM_ADMIN_ROLE })
    res.json({ gymAdmins })
}

exports.getGymCoachesAndAthletes = async (req, res) => {
    const loggedUser = await User.findById(req.user.id)
    const coaches = await User.find({ gym: loggedUser.gym, role: GYM_COACH_ROLE })
    const athletes = await User.find({ gym: loggedUser.gym, role: ATHLETE_ROLE })
    res.json({ coaches, athletes })
}

exports.getGymAthletes = async (req, res) => {
    const loggedUser = await User.findById(req.user.id)
    const athletes = await User.find({ gym: loggedUser.gym, role: ATHLETE_ROLE })
    res.json({ athletes })
}

exports.getLoggedUser = async (req, res) => {
    const user = await User.findById(req.user.id).populate('adminGyms').populate('gym').exec()
    res.json({ user })
}

exports.getUserById = async (req, res) => {
    const { userId } = req.params
    const selectedUser = await User.findById(userId).populate('adminGyms').populate('gym').exec()
    if (!selectedUser) throw errorMsgs.userNotFound
    if (selectedUser.role === SITE_ADMIN_ROLE) throw errorMsgs.userInfoAccessNotAllowed

    const loggedUser = await User.findById(req.user.id).populate('adminGyms').exec() 
    if (loggedUser.role === SITE_ADMIN_ROLE) return res.json({ user: selectedUser })

    if (loggedUser.role === GYM_ADMIN_ROLE) {
        const { adminGyms } = loggedUser
        if (!adminGyms.length) throw warnMsgs.youDoNotHaveAnyGyms

        const staffArray = [].concat(...adminGyms.map(gym => [...gym.managers, ...gym.coaches, ...gym.athletes]))
        const allStaff = staffArray.map(staff => staff.toString())

        if (!allStaff.includes(selectedUser.id)) throw errorMsgs.userInfoAccessNotAllowed
    }

    const loggedUserIsGymStaff = loggedUser.role === GYM_MANAGER_ROLE || 
        loggedUser.role === GYM_COACH_ROLE || loggedUser.role === ATHLETE_ROLE

    if (loggedUserIsGymStaff && selectedUser.gym.id !== loggedUser.gym.toString()) 
        throw errorMsgs.userInfoAccessNotAllowed

    res.json({ user: selectedUser })
}

exports.updateAccountCredentials = async (req, res) => {
    const { username, name, lastname, phoneNumber } = req.body
    const user = await User.findById(req.user.id)

    const userExist = await userExistCheck(username, null, phoneNumber, user)
    if (userExist) throw userExist

    try {
        await user.updateOne({ username, name, lastname, phoneNumber })
        res.json({ message: successMsgs.updateCredentialsSuccess })
    } catch {
        res.status(500).json({ message: errorMsgs.updateCredentialsError })
    }
}

exports.updateEmail = async (req, res) => {
    const { email } = req.body
    const user = await User.findById(req.user.id)
    if (user.verifiedEmail) throw errorMsgs.emailCannotBeChanged

    const userExist = await userExistCheck(null, email, null, user) 
    if (userExist) throw userExist

    try {
        await user.updateOne({ email })
        res.json({ message: `${warnMsgs.activeYourAccount} .${successMsgs.emailChanged}` })
    } catch {
        res.status(500).json({ message: errorMsgs.emailChangeError })
    }
}

exports.sendChangePasswordEmail = async (req, res) => {
    const { currentPassword } = req.body
    const user = await User.findById(req.user.id)
    const passed = await bcrypt.compare(currentPassword, user.password)
    if (!passed) throw errorMsgs.currentPassIncorrect

    const resetPassToken = await jwt
        .sign({ userId: user.id }, process.env.JWT_RESET_PASS_SECRET, { expiresIn: '15m' })
    
    try {
        await sendEmail(user.email, resetPassToken, emailMethods.RESET_PASSWORD)
        res.json({ message: successMsgs.changePasswordEmailSent })
    } catch {
        res.status(500).json({ message: errorMsgs.changePasswordEmailSendError })
    }
}

exports.updateAvatar = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : null
    if (!avatarName) throw errorMsgs.emptyAvatarFile
    
    const user = await User.findById(req.user.id)
    const avatarImagePath = path.join('/', User.avatarImageBasePath, avatarName)
    if (user.avatarName) { 
        const deleteUserAvatarError = deleteAvatarFile(user.avatarName)
        if (deleteUserAvatarError) throw deleteUserAvatarError
    }

    try {
        await user.updateOne({ avatarName, avatarImagePath })
        res.json({ message: successMsgs.changeAvatarSuccess })
    } catch {
        res.status(500).json({ message: errorMsgs.changeAvatarError })
    }
}

exports.deleteAvatar = async (req, res) => {
    const user = await User.findById(req.user.id)
    if (!user.avatarName) throw errorMsgs.noAvatarFound

    const deleteUserAvatarError = deleteAvatarFile(user.avatarName)
    if (deleteUserAvatarError) throw deleteUserAvatarError

    try {
        await user.updateOne({ avatarName: '', avatarImagePath: '' })
        res.json({ message: successMsgs.deleteAvatarSuccess })
    } catch {
        res.status(500).json({ message: errorMsgs.deleteAvatarError })
    }
}

exports.changePasswordConfirm = async (req, res) => {
    try {
        const { changePasswordToken } = req.params
        const { newPassword } = req.body
        const payload = await jwt.verify(changePasswordToken, process.env.JWT_RESET_PASS_SECRET)

        const user = await User.findById(payload.userId)
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await user.updateOne({ password: hashedPassword, entryToken: '', refreshToken: '' })
        res.json({ message: successMsgs.passwordChanged })
    } catch (err) {
        if (err.message === errorMsgs.jwtExpired) throw errorMsgs.changePasswordTimeExpired
        res.status(500).json({ message: errorMsgs.changePasswordError })
    }
}

exports.deleteGymStaffAccount = async (req, res) => {
    try {
        const { selectedUser, selectedUserGym } = req
        const { managers, coaches, athletes } = selectedUserGym
        if (selectedUser.role === GYM_MANAGER_ROLE) {
            const newManagers = managers.filter(manager => manager !== selectedUser.id)
            await selectedUserGym.updateOne({ managers: newManagers })
        }
        if (selectedUser.role === GYM_COACH_ROLE) {
            const newCoaches = coaches.filter(coach => coach !== selectedUser.id)
            await selectedUserGym.updateOne({ coaches: newCoaches })
        }
        if (selectedUser.role === ATHLETE_ROLE) {
            const newAthletes = athletes.filter(athlete => athlete !== selectedUser.id)
            await selectedUserGym.updateOne({ athletes: newAthletes })
        }
        await selectedUser.deleteOne()
        res.json({ message: successMsgs.deleteGymStaffSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.deleteGymStaffError })
    }
}