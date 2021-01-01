const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const userExistCheck = require('../Handlers/FormChecks/userExistCheck')
const sendEmail = require('../Handlers/MessageSenders/emailSender')
const deleteAvatarFile = require('../Handlers/FileHandlers/deleteAvatarFile')
const { RESET_PASSWORD } = require('../Handlers/Constants/emailMethods')
const { GYM_ADMIN_ROLE, GYM_COACH_ROLE, ATHLETE_ROLE, GYM_MANAGER_ROLE } = require('../Handlers/Constants/roles')

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
    const user = await User.findById(req.user.id)
        .populate('adminGyms').populate('gym').exec()
    res.json({ user })
}

exports.getUserById = async (req, res) => {
    res.json({ user: req.selectedUser })
}

exports.updateAccountCredentials = async (req, res) => {
    const { username, name, lastname, phoneNumber } = req.body
    const user = await User.findById(req.user.id)

    const userExist = await userExistCheck(username, null, phoneNumber, user)
    if (userExist) throw userExist

    try {
        await user.updateOne({ username, name, lastname, phoneNumber })
        res.json({ message: 'مشخصات شما بروز گردید' })
    } catch {
        res.status(500).json({ message: 'خطا در بروز رسانی مشخصات' })
    }
}

exports.updateEmail = async (req, res) => {
    const { email } = req.body
    const user = await User.findById(req.user.id)
    if (user.verifiedEmail) 
        throw 'شما قبلا ایمیل خود را تایید کرده اید و دیگر قادر به تغییر آن نیستید'

    const userExist = await userExistCheck(null, email, null, user) 
    if (userExist) throw userExist

    try {
        await user.updateOne({ email })
        res.json({ message: 'ایمیل شما تغییر یافت، لطفا آن را هرچه سریعتر تایید کنید' })
    } catch {
        res.status(500).json({ message: 'خطا در تغییر ایمیل' })
    }
}

exports.sendChangePasswordEmail = async (req, res) => {
    const { currentPassword } = req.body
    const user = await User.findById(req.user.id)
    const passed = await bcrypt.compare(currentPassword, user.password)
    if (!passed) throw 'رمز ورودی فعلی شما اشتباه است'

    const resetPassToken = await jwt.sign(
        { userId: user.id }, process.env.JWT_RESET_PASS_SECRET, { expiresIn: '15m' }
    )
    
    try {
        await sendEmail(user.email, resetPassToken, RESET_PASSWORD)
        res.json({ message: 'ایمیل برای تغییر رمز عبور برای شما فرستاده شد' })
    } catch {
        res.status(500).json({ message: 'خطا در تغییر رمز ورودی' })
    }
}

exports.updateAvatar = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : null
    if (!avatarName) throw 'فایل آواتار خالی است'
    
    const user = await User.findById(req.user.id)
    const avatarImagePath = path.join('/', User.avatarImageBasePath, avatarName)
    if (user.avatarName) { 
        const deleteUserAvatarError = deleteAvatarFile(user.avatarName)
        if (deleteUserAvatarError) throw deleteUserAvatarError
    }

    try {
        await user.updateOne({ avatarName, avatarImagePath })
        res.json({ message: 'آواتار شما با موفقیت بروزرسانی شد' })
    } catch {
        res.status(500).json({ message: 'خطا در تغییر آواتار' })
    }
}

exports.deleteAvatar = async (req, res) => {
    const user = await User.findById(req.user.id)
    if (!user.avatarName) throw 'آواتاری برای پاک کردن وجود ندارد'

    const deleteUserAvatarError = deleteAvatarFile(user.avatarName)
    if (deleteUserAvatarError) throw deleteUserAvatarError

    try {
        await user.updateOne({ avatarName: '', avatarImagePath: '' })
        res.json({ message: 'آواتار شما با موفقیت پاک شد' })
    } catch {
        res.status(500).json({ message: 'خطا در پاک کردن آواتار' })
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
        res.json({ message: 'رمز عبور شما با موفقیت تغییر یافت' })
    } catch (err) {
        if (err.message === 'jwt expired') 
            throw 'ََمدت زمان تغییر دادن رمز عبور شما به اتمام رسیده است'

        res.status(500).json({ message: 'خطا در تغییر رمز عبور' })
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
        res.json({ message: 'حساب کاربری مورد نظر شما پاک گردید' })
    } catch (err) {
        res.status(500).json({ message: 'خطا در پاک کردن حساب کاربری' })
    }
}