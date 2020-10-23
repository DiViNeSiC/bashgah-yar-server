const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../Models/User')
const findUser = require('../../Handlers/LoginHandlers/findUser')
const generateCode = require('../../Handlers/LoginHandlers/generateCode')

const regularLogin = async (req, res) => {
    const { credential, password } = req.body

    const user = await findUser(credential)

    if (!user) throw 'کاربری با این مشخصات پیدا نشد'

    const passed = await bcrypt.compare(password, user.password)

    if (!passed) throw 'رمز عبور شما اشتباه است'

    const twoStepCode = generateCode()
    
    await user.updateOne({ twoStepCode })

    // SEND CODE TO THE USER'S PHONE NUMBER

    res.json({ message: 'کد ورودی به شماره تلفن شما ارسال شد' })
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

    await user.updateOne({ entryToken, twoStepCode: '' })

    res.json({ entryToken })
}

module.exports = { regularLogin, confirmTwoStepCode }