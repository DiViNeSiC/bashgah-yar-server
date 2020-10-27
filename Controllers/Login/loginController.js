const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../Models/User')
const findUser = require('../../Handlers/LoginHandlers/findUser')
const generateCode = require('../../Handlers/LoginHandlers/generateCode')
const sendSms = require('../../Handlers/MessageSenders/smsSender')

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
    const { regularLoginToken } = req.body

    try {
        const payload = await jwt
            .verify(regularLoginToken, process.env.JWT_REGULAR_SECRET) 

        if (!payload) 
            throw 'زمان احراز هویت شما به پایان رسیده است'

        const user = await User.findById(payload.userId)
        if (!user) throw 'کاربری با این مشخصات پیدا نشد'

        const twoStepCode = generateCode()
        await user.updateOne({ twoStepCode })
        //FIX SENDING SMS WITH API
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
    const user = await User.findOne({ twoStepCode })
    if (!user) 
        throw 'کد تایید اشتباه یا مدت زمان استفاده از آن به پایان رسیده است'
    
    const entryToken = await jwt.sign(
        { user }, 
        process.env.JWT_ENTRY_SECRET, 
        { expiresIn }
    )

    const refreshToken = await jwt.sign(
        { user }, 
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn }
    )

    await user.updateOne({ 
        entryToken, 
        refreshToken, 
        twoStepCode: ''
    })

    res.json({ entryToken, refreshToken })
}

module.exports = { regularLogin, confirmTwoStepCode, sendTwoStepCode }