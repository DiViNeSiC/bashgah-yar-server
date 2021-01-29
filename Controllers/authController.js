const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const TimeBasedCode = require('../Models/TimeBasedCode')
const findUser = require('../Handlers/LoginHandlers/findUser')
const sendSms = require('../Handlers/MessageSenders/smsSender')
const sendEmail = require('../Handlers/MessageSenders/emailSender')
const generateCode = require('../Handlers/LoginHandlers/generateCode')
const generateToken = require('../Handlers/LoginHandlers/generateToken')
const { emailMethods, smsMethods } = require('../Handlers/Constants/sendersMethods')
const { authController: { successMsgs, errorMsgs, warnMsgs } } = require('../Handlers/Constants/responseMessages')

exports.regularLogin = async (req, res) => {
    const { credential, password, confirmationToken, expiresIn } = req.body

    const user = await findUser(credential)
    if (!user) throw errorMsgs.userDidNotFound
    if (user.isBanned) throw errorMsgs.userIsBanned
    const passed = await bcrypt.compare(password, user.password)
    if (!passed) throw errorMsgs.incorrectPassword

    const regularLoginToken = await jwt.sign({ userId: user.id }, process.env.JWT_REGULAR_SECRET, { expiresIn: '10m' })
    if (!confirmationToken || user.confirmationToken.toString() !== confirmationToken) 
        return res.json({ regularLoginToken, continue: true })

    try {
        const payload = await jwt.verify(confirmationToken, process.env.JWT_CONFIRMATION_SECRET)
        if (!payload) return res.json({ regularLoginToken, continue: true })

        const { entryToken, refreshToken } = await generateToken(user, expiresIn)
        await user.updateOne({ entryToken, refreshToken, timeBasedCode: '' })

        res.json({ entryToken, refreshToken, user, continue: false })
    } catch (err) {
        if (err.message === errorMsgs.jwtExpired) return res.json({ regularLoginToken, continue: true })
        res.status(500).json({ message: errorMsgs.loginError })
    }
}

exports.sendTwoStepCode = async (req, res) => {
    try {
        const { regularLoginToken } = req.body

        const payload = await jwt.verify(regularLoginToken, process.env.JWT_REGULAR_SECRET) 
        const user = await User.findById(payload.userId)
        if (user.isBanned) throw errorMsgs.userIsBanned

        const twoStepCode = generateCode()
        const newTimeBasedCode = new TimeBasedCode({ code: twoStepCode })

        await newTimeBasedCode.save()
        await user.updateOne({ timeBasedCode: twoStepCode })
        await sendSms(user.phoneNumber, twoStepCode, smsMethods.LOGIN_CONFIRM)
        res.json({ message: successMsgs.sendingCodeSuccess })
    } catch (err) {
        if (err.message === errorMsgs.jwtExpired) throw errorMsgs.expiredInfo
        res.status(500).json({ message: errorMsgs.sendingCodeError })
    }
}

exports.confirmTwoStepCodeAndLogin = async (req, res) => {
    const { twoStepCode, expiresIn } = req.body

    const lowerCasedCode = twoStepCode.toLowerCase()
    const timeBasedCode = await TimeBasedCode.findOne({ code: lowerCasedCode })
    if (!timeBasedCode) throw errorMsgs.expiredInfo

    const user = await User.findOne({ timeBasedCode: timeBasedCode.code })
    if (!user) throw errorMsgs.expiredInfo
    if (user.isBanned) throw errorMsgs.userIsBanned

    const { entryToken, refreshToken, confirmationToken } = await generateToken(user, expiresIn, true)
    await user.updateOne({ entryToken, refreshToken, confirmationToken, timeBasedCode: '' })
    res.json({ entryToken, refreshToken, confirmationToken, user })
}

exports.verifyRefreshToken = async (req, res) => {
    const { refreshToken } = req.params
    const user = await User.findOne({ refreshToken })
    if (!user) throw errorMsgs.userDidNotFound

    try {
        const payload = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        if (!payload) throw errorMsgs.invalidInformation

        const { entryToken, refreshToken } = await generateToken(user, payload.expiresIn)
        await user.updateOne({ entryToken, refreshToken })
        res.json({ user, message: successMsgs.updateTokenSuccess, newEntryToken: entryToken, newRefreshToken: refreshToken })
    } catch (err) {
        if (err.message === errorMsgs.jwtExpired) throw errorMsgs.expiredInfo
        res.status(500).json({ message: errorMsgs.serverError })
    }
}

exports.sendAccountActivationEmail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (user.isBanned) throw errorMsgs.userIsBanned
        const accountActivationToken = await jwt
            .sign({ userId: user.id }, process.env.JWT_ACC_ACTIVATION_SECRET, { expiresIn: '20m' })
        
        await sendEmail(user.email, accountActivationToken, emailMethods.EMAIL_ACTIVATION)
        res.json({ message: `${warnMsgs.activeYourAcc} .${successMsgs.sendingEmailSuccess}` })
    } catch {
        res.status(500).json({ message: errorMsgs.sendingEmailError })
    }
}

exports.activeAccount = async (req, res) => {
    try {
        const { accountActivationToken } = req.params
        const payload = await jwt.verify(accountActivationToken, process.env.JWT_ACC_ACTIVATION_SECRET)
        await User.findByIdAndUpdate(payload.userId, { verifiedEmail: true })
        res.json({ message: successMsgs.activeAccountSuccess })
    } catch (err) {
        if (err.message === errorMsgs.jwtExpired) throw errorMsgs.expiredInfo
        res.status(500).json({ message: errorMsgs.serverError })    
    }
}

exports.forgotPassWithEmail = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw errorMsgs.userDidNotFound
    if (user.isBanned) throw errorMsgs.userIsBanned
    if (!user.verifiedEmail) throw errorMsgs.unverifiedEmail
    
    try {
        const forgotPassToken = await jwt
            .sign({ userId: user.id }, process.env.JWT_RESET_PASS_SECRET, { expiresIn: '12m' })

        await user.updateOne({ forgotPassToken })
        await sendEmail(user.email, forgotPassToken, emailMethods.FORGOT_PASSWORD)
        res.json({ message: `${warnMsgs.changeYourPass} .${successMsgs.sendingEmailSuccess}` })
    } catch {
        res.status(500).json({ message: errorMsgs.sendingEmailError })
    }
}

exports.forgotPassWithPhoneNumber = async (req, res) => {
    const { phoneNumber } = req.body
    const user = await User.findOne({ phoneNumber })
    if (!user) throw errorMsgs.userDidNotFound
    if (user.isBanned) throw errorMsgs.userIsBanned
    const existCode = await TimeBasedCode.findOne({ code: user.timeBasedCode })
    if (existCode) throw errorMsgs.doubleRequestError
    
    try {
        const resetPassCode = generateCode(10)
        const newTimeBasedCode = new TimeBasedCode({ code: resetPassCode })
        await newTimeBasedCode.save()
        await user.updateOne({ timeBasedCode: resetPassCode })
        await sendSms(user.phoneNumber, newTimeBasedCode, smsMethods.FORGOT_PASSWORD)
        res.json({ message: `${warnMsgs.changeYourPass} .${successMsgs.sendingCodeSuccess}` })
    } catch {
        res.status(500).json({ message: errorMsgs.sendingCodeError })
    }
}

exports.resetPassWithToken = async (req, res) => {
    const { newPassword } = req.body
    const { forgotPassToken } = req.params
    const user = await User.findOne({ forgotPassToken })
    if (!user) throw errorMsgs.invalidInformation

    try {
        const payload = await jwt.verify(forgotPassToken, process.env.JWT_RESET_PASS_SECRET)
        const password = await bcrypt.hash(newPassword, 10)
        await User.findByIdAndUpdate(payload.userId, { password, forgotPassToken: '', confirmationToken: '' })
        
        res.json({ message: successMsgs.resetPassSuccess })
    } catch (err) {
        if (err.message === errorMsgs.jwtExpired) throw errorMsgs.expiredInfo
        res.status(500).json({ message: errorMsgs.serverError })
    }
}

exports.resetPassWithTimeBasedCode = async (req, res) => {
    const { newPassword, resetPassCode } = req.body
    const user = await User.findOne({ timeBasedCode: resetPassCode })
    if (!user) throw errorMsgs.expiredInfo

    try {
        const password = await bcrypt.hash(newPassword, 10)
        await user.updateOne({ password, timeBasedCode: '', confirmationToken: '' })
        res.json({ message: successMsgs.resetPassSuccess })
    } catch {
        res.status(500).json({ message: errorMsgs.serverError })
    }
}

exports.logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { entryToken: null, refreshToken: null })
        res.json({ message: successMsgs.goodByeMessage })
    } catch {
        res.status(500).json({ message: errorMsgs.serverError })
    }
}