const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const TimeBasedCode = require('../Models/TimeBasedCode')
const findUser = require('../Handlers/LoginHandlers/findUser')
const generateToken = require('../Handlers/LoginHandlers/generateToken')
const generateCode = require('../Handlers/LoginHandlers/generateCode')
const sendSms = require('../Handlers/MessageSenders/smsSender')
const sendEmail = require('../Handlers/MessageSenders/emailSender')
const { FORGOT_PASSWORD, EMAIL_ACTIVATION } = require('../Handlers/Constants/emailMethods')

exports.regularLogin = async (req, res) => {
    const { credential, password, confirmationToken, expiresIn } = req.body
    const user = await findUser(credential)
    if (!user) throw 'کاربری با این مشخصات پیدا نشد'
    const passed = await bcrypt.compare(password, user.password)
    if (!passed) throw 'رمز عبور شما اشتباه است'

    const regularLoginToken = await jwt
        .sign({ userId: user.id }, process.env.JWT_REGULAR_SECRET, { expiresIn: '10m' })

    if (!confirmationToken || user.confirmationToken.toString() !== confirmationToken) 
        return res.json({ regularLoginToken, continue: true })

    try {
        const payload = await jwt.verify(confirmationToken, process.env.JWT_CONFIRMATION_SECRET)
        if (!payload) return res.json({ regularLoginToken, continue: true })
        const { entryToken, refreshToken } = await generateToken(user, expiresIn)
        await user.updateOne({ entryToken, refreshToken, timeBasedCode: '' })
        res.json({ entryToken, refreshToken, user, continue: false })
    } catch (err) {
        if (err.message === 'jwt expired') return res.json({ regularLoginToken, continue: true })
        res.status(500).json({ message: 'خطا در ورود به حساب' })
    }
}

exports.sendTwoStepCode = async (req, res) => {
    try {
        const { regularLoginToken } = req.body
        const payload = await jwt.verify(regularLoginToken, process.env.JWT_REGULAR_SECRET) 
        const user = await User.findById(payload.userId)
        const twoStepCode = generateCode()
        const newTimeBasedCode = new TimeBasedCode({ code: twoStepCode })

        await newTimeBasedCode.save()
        await user.updateOne({ timeBasedCode: twoStepCode })
        // await sendSms(user.phoneNumber, twoStepCode)
        res.json({ message: 'کد تایید به شماره شما فرستاده شد' })
    } catch (err) {
        if (err.message === 'jwt expired') throw 'زمان احراز هویت شما به پایان رسیده است'
        res.status(500).json({ message: 'خطا در ارسال کد تایید' })
    }
}

exports.confirmTwoStepCode = async (req, res) => {
    const { twoStepCode, expiresIn } = req.body
    const lowerCasedCode = twoStepCode.toLowerCase()
    const timeBasedCode = await TimeBasedCode.findOne({ code: lowerCasedCode })
    if (!timeBasedCode)        
        throw 'کد تایید اشتباه یا مدت زمان استفاده از آن به پایان رسیده است'
    const user = await User.findOne({ timeBasedCode: timeBasedCode.code })
    if (!user) 
        throw 'کد تایید اشتباه یا مدت زمان استفاده از آن به پایان رسیده است'
    const { entryToken, refreshToken, confirmationToken } = await generateToken(user, expiresIn, true)
    await user.updateOne({ entryToken, refreshToken, confirmationToken, timeBasedCode: '' })
    res.json({ entryToken, refreshToken, confirmationToken, user })
}

exports.verifyRefreshToken = async (req, res) => {
    const { refreshToken } = req.params
    const user = await User.findOne({ refreshToken })
    if (!user) throw 'کاربری با این مشخصات یافت نشد'

    try {
        const payload = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        if (!payload) throw 'توکن شما اشتباه است'
        const { entryToken, refreshToken } = await generateToken(user, payload.expiresIn)
        await user.updateOne({ entryToken, refreshToken })
        res.json({ message: 'توکن شما آپدیت شد', newEntryToken: entryToken, newRefreshToken: refreshToken })
    } catch {
        res.status(500).json({ message: 'خطایی رخ داده است' })
    }
}

exports.sendActivationEmail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const accountActivationToken = await jwt.sign(
            { userId: user.id },
            process.env.JWT_ACC_ACTIVATION_SECRET,
            { expiresIn: '20m' }
        )
        await sendEmail(user.email, accountActivationToken, EMAIL_ACTIVATION)
        res.json({ message: 'ایمیل تایید برای شما فرستاده شد' })
    } catch {
        res.status(500).json({ message: 'خطا در فرستادن ایمیل' })
    }
}

exports.activeEmail = async (req, res) => {
    try {
        const { accountActivationToken } = req.params
        const payload = await jwt.verify(accountActivationToken, process.env.JWT_ACC_ACTIVATION_SECRET)
        await User.findByIdAndUpdate(payload.userId, { verifiedEmail: true })
        res.json({ message: 'حساب کاربری شما فعال گردید' })
    } catch (err) {
        if (err.message === 'jwt expired') 
            throw 'ََمدت زمان فعال کردن حساب کاربری شما به اتمام رسیده است'

        res.status(500).json({ message: 'خطا در فعال کردن حساب کاربری' })    
    }
}

exports.forgotPassWithEmail = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw 'کاربری با این ایمیل یافت نشد'
    if (!user.verifiedEmail) throw 'ایمیل وارد شده وجود دارد اما تایید نشده است'
    
    try {
        const forgotPassToken = await jwt.sign(
            { userId: user.id },
            process.env.JWT_RESET_PASS_SECRET,
            { expiresIn: '12m' }
        )
        await user.updateOne({ forgotPassToken })
        await sendEmail(user.email, forgotPassToken, FORGOT_PASSWORD)
        res.json({ message: 'ایمیل تغییر رمز عبور برای شما ارسال شد' })
    } catch {
        res.status(500).json({ message: 'خطا در فرستادن ایمیل تغییر رمز عبور' })
    }
}

exports.forgotPassWithPhoneNumber = async (req, res) => {
    const { phoneNumber } = req.body
    const user = await User.findOne({ phoneNumber })
    if (!user) throw 'کاربری با این شماره تلفن یافت نشد'
    const existCode = await TimeBasedCode.findOne({ code: user.timeBasedCode })
    if (existCode) throw 'شما نمیتوانید به طور متوالی درخواست دهید'
    
    try {
        const resetPassCode = generateCode(10)
        const newTimeBasedCode = new TimeBasedCode({ code: resetPassCode })
        await newTimeBasedCode.save()
        await user.updateOne({ timeBasedCode: resetPassCode })
        //await sendSms(user.phoneNumber, newTimeBasedCode)
        res.json({ message: 'کد تغییر رمز عبور برای شما ارسال شد' })
    } catch {
        res.status(500).json({ message: 'خطا در فرستادن کد تغییر رمز عبور' })
    }
}

exports.verifyToken = async (req, res) => {
    const { newPassword } = req.body
    const { forgotPassToken } = req.params
    const user = await User.findOne({ forgotPassToken })
    if (!user) throw 'تلاش ناموفق برای تغییر رمز عبور'

    try {
        const payload = await jwt.verify(forgotPassToken, process.env.JWT_RESET_PASS_SECRET)
        const password = await bcrypt.hash(newPassword, 10)
        await User.findByIdAndUpdate(payload.userId, { password, forgotPassToken: '', confirmationToken: '' })
        res.json({ message: 'رمز عبور شما با موفقیت تغییر یافت' })
    } catch (err) {
        if (err.message === 'jwt expired') 
            throw 'ََمدت زمان تغییر دادن رمز عبور شما به اتمام رسیده است'

        res.status(500).json({ message: 'خطا در تغییر رمز عبور' })
    }
}

exports.verifyTimeBasedCode = async (req, res) => {
    const { newPassword, resetPassCode } = req.body
    const user = await User.findOne({ timeBasedCode: resetPassCode })
    if (!user) 
        throw 'کد ورودی شما اشتباه یا مدت زمان استفاده از آن به پایان رسیده است'

    try {
        const password = await bcrypt.hash(newPassword, 10)
        await user.updateOne({ password, timeBasedCode: '', confirmationToken: '' })
        res.json({ message: 'رمز عبور شما با موفقیت تغییر یافت' })
    } catch {
        res.status(500).json({ message: 'خطا در تغییر رمز عبور' })
    }
}

exports.logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { entryToken: null, refreshToken: null })
        res.json({ message: '!خدانگهدار' })
    } catch {
        res.status(500).json({ message: 'خطایی رخ داده است' })
    }
}