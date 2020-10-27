const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../Models/User')
const userExistCheck = require('../../Handlers/FormChecks/userExistCheck')
const sendEmail = require('../../Handlers/MessageSenders/emailSender')
const { DELETE_ACCOUNT, RESET_PASSWORD } = require('../../Handlers/Constants/emailMethods')

const getAccountInfo = async (req, res) => {
    const user = await User.findById(req.payload._id)
    if (!user) throw 'شما باید وارد حساب کاربری خود شوید'

    res.json(( user ))
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

    const userExist = await userExistCheck(
        null, email, null, req.payload
    ) 

    if (userExist) throw userExist

    try {
        const user = await User.findById(req.payload._id)
        await user.updateOne({ email, verifiedEmail: false })

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
        await user.updateOne({ resetPassToken })
        await sendEmail(user.email, resetPassToken, RESET_PASSWORD)

        res.json({ message: 'ایمیل برای تغییر رمز عبور برای شما فرستاده شد' })
    } catch {
        res.status(500).json({ message: 'خطا در تغییر رمز ورودی' })
    }
}

const updateAvatar = async (req, res) => {

}

const deleteAvatar = async (req, res) => {

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
        await user.updateOne({ deleteAccountToken })
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