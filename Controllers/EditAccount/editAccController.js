const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')
const User = require('../../Models/User')
const userExistCheck = require('../../Handlers/FormChecks/userExistCheck')
const sendEmail = require('../../Handlers/MessageSenders/emailSender')
const deleteAvatar = require('../../Handlers/FileHandlers/deleteAvatarFile')
const { DELETE_ACCOUNT, RESET_PASSWORD } = require('../../Handlers/Constants/emailMethods')

const getAccountInfo = async (req, res) => {
    res.json({ user: req.payload })
}

const updateAccountCredentials = async (req, res) => {
    const { username, name, lastname, phoneNumber } = req.body

    const userExist = await userExistCheck(
        username, null, phoneNumber, req.payload
    )

    if (userExist) throw userExist

    try {
        await User.findByIdAndUpdate(req.payload._id, {
            username, name, lastname, phoneNumber
        })
    
        res.json({ message: 'مشخصات شما بروز گردید' })
    } catch {
        res.status(500).json({ message: 'خطا در بروز رسانی مشخصات' })
    }
}

const updateEmail = async (req, res) => {
    const { email } = req.body
    const { _id } = req.payload

    const userExist = await userExistCheck(
        null, email, null, req.payload
    ) 

    if (userExist) throw userExist

    try {
        await User.findByIdAndUpdate(_id, { email, verifiedEmail: false })
        res.json({ message: 'ایمیل شما تغییر یافت، لطفا آن را هرچه سریعتر تایید کنید' })
    } catch {
        res.status(500).json({ message: 'خطا در تغییر ایمیل' })
    }
}

const updatePassword = async (req, res) => {
    const { currentPassword } = req.body
    const user = await User.findById(req.payload._id)
    
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
    
    const user = await User.findById(req.payload._id)
    const avatarImagePath = path.join('/', User.avatarImageBasePath, avatarName)
    if (user.avatarName) { 
        const deleteUserAvatarError = deleteAvatar(user.avatarName)
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
    const user = await User.findById(req.payload._id)
    if (!user.avatarName) throw 'آواتاری برای پاک کردن وجود ندارد'

    const deleteUserAvatarError = deleteAvatar(user.avatarName)
    if (deleteUserAvatarError) throw deleteUserAvatarError

    try {
        await user.updateOne({ avatarName: '', avatarImagePath: '' })
        res.json({ message: 'آواتار شما با موفقیت پاک شد' })
    } catch {
        res.status(500).json({ message: 'خطا در پاک کردن آواتار' })
    }
}

const deleteAccount = async (req, res) => {
    const { password } = req.body
    const user = await User.findById(req.payload._id)
    
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
    getAccountInfo,
    updateAccountCredentials,
    updateEmail,
    updatePassword,
    updateAvatar,
    deleteAvatar,
    deleteAccount
}