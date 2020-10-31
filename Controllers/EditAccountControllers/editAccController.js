const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')
const User = require('../../Models/User')
const userExistCheck = require('../../Handlers/FormChecks/userExistCheck')
const sendEmail = require('../../Handlers/MessageSenders/emailSender')
const deleteAvatarFile = require('../../Handlers/FileHandlers/deleteAvatarFile')
const { DELETE_ACCOUNT, RESET_PASSWORD } = require('../../Handlers/Constants/emailMethods')

const updateAccountCredentials = async (req, res) => {
    const { username, name, lastname, phoneNumber } = req.body
    const user = await User.findById(req.payload.id)

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
    const user = await User.findById(req.payload.id)
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
    const user = await User.findById(req.payload.id)
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
    
    const user = await User.findById(req.payload.id)
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
    const user = await User.findById(req.payload.id)
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

const sendDeleteAccountEmail = async (req, res) => {
    const { password } = req.body
    const user = await User.findById(req.payload.id)
    const passed = await bcrypt.compare(password, user.password)
    if (!passed) throw 'رمز ورودی فعلی شما اشتباه است'

    const deleteAccountToken = await jwt.sign(
        { userId: user.id }, 
        process.env.JWT_DELETE_ACC_SECRET, 
        { expiresIn: '12m' }
    )

    try {
        await sendEmail(user.email, deleteAccountToken, DELETE_ACCOUNT)
        res.json({ message: 'ایمیل برای پاک کردن حساب کاربری برای شما فرستاده شد' })
    } catch {
        res.status(500).json({ message: 'خطا در پاک کردن حساب کاربری' })
    }
}

module.exports = {
    updateAccountCredentials,
    updateEmail, sendChangePasswordEmail,
    updateAvatar, deleteAvatar,
    sendDeleteAccountEmail
}