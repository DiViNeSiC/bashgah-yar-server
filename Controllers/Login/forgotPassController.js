const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require("../../Models/User")
const TimeBasedCode = require('../../Models/TimeBasedCode')
const sendEmail = require('../../Handlers/MessageSenders/emailSender')
const sendSms = require('../../Handlers/MessageSenders/smsSender')
const generateCode = require('../../Handlers/LoginHandlers/generateCode')
const { FORGOT_PASSWORD } = require('../../Handlers/Constants/emailMethods')

const forgotPassWithEmail = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw 'کاربری با این ایمیل یافت نشد'
    if (!user.verifiedEmail) throw 'ایمیل وارد شده وجود دارد اما تایید نشده است'

    const forgotPassToken = await jwt.sign(
        { userId: user.id },
        process.env.JWT_RESET_PASS_SECRET,
        { expiresIn: '12m' }
    )
    
    try {
        await sendEmail(user.email, forgotPassToken, FORGOT_PASSWORD)
        res.json({ message: 'ایمیل تغییر رمز عبور برای شما ارسال شد' })
    } catch {
        res.status(500).json({ message: 'خطا در فرستادن ایمیل تغییر رمز عبور' })
    }
}

const forgotPassWithPhoneNumber = async (req, res) => {
    const { phoneNumber } = req.body

    const user = await User.findOne({ phoneNumber })
    if (!user) throw 'کاربری با این شماره تلفن یافت نشد'
    const resetPassCode = generateCode(10)
    const newTimeBasedCode = new TimeBasedCode({ code: resetPassCode })

    try {
        await newTimeBasedCode.save()
        await user.updateOne({ timeBasedCode: resetPassCode })
        //Send Sms
        res.json({ message: 'کد تغییر رمز عبور برای شما ارسال شد'})
    } catch {
        res.status(500).json({ message: 'خطا در فرستادن کد تغییر رمز عبور' })
    }
}

const verifyToken = async (req, res) => {
    const { newPassword } = req.body
    const { forgotPassToken } = req.params

    try {
        const payload = await jwt.verify(
            forgotPassToken,
            process.env.JWT_RESET_PASS_SECRET
        )

        const password = await bcrypt.hash(newPassword, 10)
        await User.findByIdAndUpdate(payload.userId, { password })
        res.json({ message: 'رمز عبور شما با موفقیت تغییر یافت' })
    } catch (err) {
        if (err.message === 'jwt expired') 
            throw 'ََمدت زمان تغییر دادن رمز عبور شما به اتمام رسیده است'

        res.status(500).json({ message: 'خطا در تغییر رمز عبور' })
    }
}

const verifyTimeBasedCode = async (req, res) => {
    const { newPassword, resetPassCode } = req.body
    const user = await User.findOne({ timeBasedCode: resetPassCode })
    if (!user) 
        throw 'کد ورودی شما اشتباه یا مدت زمان استفاده از آن به پایان رسیده است'

    try {
        const password = await bcrypt.hash(newPassword, 10)
        await user.updateOne({ password, timeBasedCode: '' })
        res.json({ message: 'رمز عبور شما با موفقیت تغییر یافت' })
    } catch {
        res.status(500).json({ message: 'خطا در تغییر رمز عبور' })
    }
}

module.exports = { 
    forgotPassWithEmail,
    forgotPassWithPhoneNumber,
    verifyToken,
    verifyTimeBasedCode
}