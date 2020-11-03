const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const userExistCheck = require('../Handlers/FormChecks/userExistCheck')
const sendEmail = require('../Handlers/MessageSenders/emailSender')
const deleteAvatarFile = require('../Handlers/FileHandlers/deleteAvatarFile')
const { RESET_PASSWORD } = require('../Handlers/Constants/emailMethods')

const getLoggedUser = async (req, res) => {
    const user = await User.findById(req.user.id)
    res.json({ user })
}

const getUserById = async (req, res) => {
    const { userId } = req.params
    const user = await User.findById(userId)
    res.json({ user })
}

const updateAccountCredentials = async (req, res) => {
    const { username, name, lastname, phoneNumber } = req.body
    const user = await User.findById(req.user.id)

    const userExist = await userExistCheck(
        username, null, phoneNumber, user
    )
    if (userExist) throw userExist

    try {
        await user.updateOne({ username, name, lastname, phoneNumber })
        res.json({ message: 'مشخصات شما بروز گردید' })
    } catch {
        res.status(500).json({ message: 'خطا در بروز رسانی مشخصات' })
    }
}

const updateEmail = async (req, res) => {
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

const sendChangePasswordEmail = async (req, res) => {
    const { currentPassword } = req.body
    const user = await User.findById(req.user.id)
    const passed = await bcrypt.compare(currentPassword, user.password)
    if (!passed) throw 'رمز ورودی فعلی شما اشتباه است'

    const resetPassToken = await jwt.sign(
        { userId: user.id }, 
        process.env.JWT_RESET_PASS_SECRET, 
        { expiresIn: '15m' }
    )
    
    try {
        await sendEmail(user.email, resetPassToken, RESET_PASSWORD)
        res.json({ message: 'ایمیل برای تغییر رمز عبور برای شما فرستاده شد' })
    } catch {
        res.status(500).json({ message: 'خطا در تغییر رمز ورودی' })
    }
}

const updateAvatar = async (req, res) => {
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

const deleteAvatar = async (req, res) => {
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

const changePasswordConfirm = async (req, res) => {
    try {
        const { resetPassToken } = req.params
        const { newPassword } = req.body
        const payload = await jwt
            .verify(resetPassToken, process.env.JWT_RESET_PASS_SECRET)

        const user = await User.findById(payload.userId)
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await user.updateOne({ 
            password: hashedPassword, 
            entryToken: '', 
            refreshToken: ''
        })
        res.json({ message: 'رمز عبور شما با موفقیت تغییر یافت' })
    } catch (err) {
        if (err.message === 'jwt expired') 
            throw 'ََمدت زمان تغییر دادن رمز عبور شما به اتمام رسیده است'

        res.status(500).json({ message: 'خطا در تغییر رمز عبور' })
    }
}

const deleteUserById = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.json({ message: 'حساب کاربری مورد نظر شما با موفقیت پاک شد' })
    } catch {
        res.status(500).json({ message: 'خطا در پاک کردن حساب کاربر' })
    }
}

module.exports = { 
    getLoggedUser, 
    getUserById,
    updateEmail, 
    updateAvatar, 
    deleteAvatar,
    deleteUserById,
    updateAccountCredentials,
    sendChangePasswordEmail,
    changePasswordConfirm, 
}