const jwt = require('jsonwebtoken')
const User = require('../../Models/User')

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization 
    if (!authHeader) 
        throw 'ََشما باید وارد حساب کاربری خود شوید'
    
    const token = authHeader.split(' ')[1]
    const user = await User.findOne({ entryToken: token })

    if (!user) 
        throw 'ََشما باید وارد حساب کاربری خود شوید'

    try {
        const payload = await jwt
            .verify(token, process.env.JWT_ENTRY_SECRET)

        if (!payload) {
            await user.updateOne({ entryToken: '' })
            throw 'ََمدت زمان کد ورودی شما به اتمام رسیده است'
        }

        req.payload = payload.user
        next()
    } catch (err) {
        if (err.message === 'jwt expired') {
            await user.updateOne({ token: '' })
            throw 'ََمدت زمان کد ورودی شما به اتمام رسیده است'
        }

        res.status(500).json({ message: 'دریافت خطا از سمت سرور' })
    }
}