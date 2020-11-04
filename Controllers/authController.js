const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const TimeBasedCode = require('../Models/TimeBasedCode')
const findUser = require('../Handlers/LoginHandlers/findUser')
const generateCode = require('../Handlers/LoginHandlers/generateCode')
const sendSms = require('../Handlers/MessageSenders/smsSender')
const sendEmail = require('../Handlers/MessageSenders/emailSender')
const { FORGOT_PASSWORD, EMAIL_ACTIVATION } = require('../Handlers/Constants/emailMethods')

const regularLogin = async (req, res) => {
    const { credential, password } = req.body
    const user = await findUser(credential)
    if (!user) throw 'کاربری با این مشخصات پیدا نشد'
    const passed = await bcrypt.compare(password, user.password)
    if (!passed) throw 'رمز عبور شما اشتباه است'

    const regularLoginToken = await jwt.sign(
        { userId: user.id },
        process.env.JWT_REGULAR_SECRET,
        { expiresIn: '10m' }
    )
    res.json({ regularLoginToken })
}

const sendTwoStepCode = async (req, res) => {
    try {
        const { regularLoginToken } = req.body
        const payload = await jwt
            .verify(regularLoginToken, process.env.JWT_REGULAR_SECRET) 

        const user = await User.findById(payload.userId)
        const twoStepCode = generateCode()
        const newTimeBasedCode = new TimeBasedCode({ code: twoStepCode })

        await newTimeBasedCode.save()
        await user.updateOne({ timeBasedCode: twoStepCode })
        // await sendSms(user.phoneNumber, twoStepCode)
        res.json({ message: 'کد تایید به شماره شما فرستاده شد' })
    } catch (err) {
        if (err.message === 'jwt expired') 
            throw 'زمان احراز هویت شما به پایان رسیده است'
        
        res.status(500).json({ message: 'خطا در ارسال کد تایید' })
    }
}

const confirmTwoStepCode = async (req, res) => {
    const { twoStepCode, expiresIn } = req.body
    const lowerCasedCode = twoStepCode.toLowerCase()
    const timeBasedCode = await TimeBasedCode.findOne({ code: lowerCasedCode })
    if (!timeBasedCode)        
        throw 'کد تایید اشتباه یا مدت زمان استفاده از آن به پایان رسیده است'

    const user = await User.findOne({ timeBasedCode: timeBasedCode.code })
    if (!user) 
        throw 'کد تایید اشتباه یا مدت زمان استفاده از آن به پایان رسیده است'

    const userInfo = {
        id: user.id,
        username: user.username,
        gym: user.gym,
        role: user.role,
        expiresIn
    }
    
    const entryToken = await jwt.sign(
        { ...userInfo }, 
        process.env.JWT_ENTRY_SECRET, 
        { expiresIn }
    )
    const refreshToken = await jwt.sign(
        { ...userInfo }, 
        process.env.JWT_REFRESH_SECRET
    )

    await user.updateOne({ 
        entryToken, 
        refreshToken, 
        timeBasedCode: ''
    })
    res.json({ entryToken, refreshToken })
}

const verifyRefreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.params
        const payload = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        const user = await User.findOne({ refreshToken, _id: payload.id })
        if (!user) throw 'توکن شما اشتباه است'

        const userInfo = {
            id: user.id,
            username: user.username,
            gym: user.gym,
            role: user.role,
            expiresIn: payload.expiresIn
        }
        const newEntryToken = await jwt.sign(
            { ...userInfo }, 
            process.env.JWT_ENTRY_SECRET, 
            { expiresIn: payload.expiresIn }
        )
        const newRefreshToken = await jwt.sign(
            { ...userInfo }, 
            process.env.JWT_REFRESH_SECRET
        )

        await user.updateOne({ entryToken: newEntryToken, refreshToken: newRefreshToken })
        res.json({ message: 'توکن شما آپدیت شد', newEntryToken, newRefreshToken })
    } catch {
        res.status(500).json({ message: 'خطایی رخ داده است' })
    }
}

const sendActivationEmail = async (req, res) => {
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

const activeEmail = async (req, res) => {
    try {
        const { accountActivationToken } = req.params
        const payload = await jwt
            .verify(accountActivationToken, process.env.JWT_ACC_ACTIVATION_SECRET)
        await User.findByIdAndUpdate(payload.userId, { verifiedEmail: true })
        res.json({ message: 'حساب کاربری شما فعال گردید' })
    } catch (err) {
        if (err.message === 'jwt expired') 
            throw 'ََمدت زمان فعال کردن حساب کاربری شما به اتمام رسیده است'

        res.status(500).json({ message: 'خطا در فعال کردن حساب کاربری' })    
    }
}

const forgotPassWithEmail = async (req, res) => {
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
        //await sendSms(user.phoneNumber, newTimeBasedCode)
        res.json({ message: 'کد تغییر رمز عبور برای شما ارسال شد'})
    } catch {
        res.status(500).json({ message: 'خطا در فرستادن کد تغییر رمز عبور' })
    }
}

const verifyToken = async (req, res) => {
    try {
        const { newPassword } = req.body
        const { forgotPassToken } = req.params
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

const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { entryToken: null, refreshToken: null })
        res.json({ message: '!خدانگهدار' })
    } catch {
        res.status(500).json({ message: 'خطایی رخ داده است' })
    }
}

module.exports = { 
    regularLogin,
    confirmTwoStepCode, 
    sendTwoStepCode,
    verifyRefreshToken,
    forgotPassWithEmail,
    forgotPassWithPhoneNumber,
    sendActivationEmail,
    activeEmail,
    verifyToken,
    verifyTimeBasedCode,
    logout
}