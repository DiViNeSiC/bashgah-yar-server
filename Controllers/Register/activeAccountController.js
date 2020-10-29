const jwt = require('jsonwebtoken')
const User = require("../../Models/User")
const sendEmail = require('../../Handlers/MessageSenders/emailSender')
const { EMAIL_ACTIVATION } = require('../../Handlers/Constants/emailMethods')

const sendActivationEmail = async (req, res) => {
    try {
        const user = await User.findById(req.payload.id)
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
    const { accountActivationToken } = req.params

    try {
        const payload = await jwt.verify(
            accountActivationToken, 
            process.env.JWT_ACC_ACTIVATION_SECRET
        )

        await User.findByIdAndUpdate(payload.userId, { verifiedEmail: true })
        res.json({ message: 'حساب کاربری شما فعال گردید' })
    } catch (err) {
        if (err.message === 'jwt expired') 
            throw 'ََمدت زمان فعال کردن حساب کاربری شما به اتمام رسیده است'

        res.status(500).json({ message: 'خطا در فعال کردن حساب کاربری' })    
    }
}

module.exports = { activeEmail, sendActivationEmail }