const jwt = require('jsonwebtoken')
const User = require('../../Models/User')

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization 
    if (!authHeader) return res.status(401).json({ 
        message: 'شما باید وارد حساب کاربری خود شوید'
    })

    const token = authHeader.split(' ')[1]
    const user = await User.findOne({ entryToken: token })
    if (!user) return res.status(401).json({ 
        message: 'شما باید وارد حساب کاربری خود شوید'
    })

    try {
        const payload = await jwt.verify(token, process.env.JWT_ENTRY_SECRET)
        req.payload = payload
        next()
    } catch (err) {
        if (err.message === 'jwt expired') {
            await user.updateOne({ token: '' })
            return res.status(401).json({ 
                message: 'شما باید وارد حساب کاربری خود شوید'
            })
        }
        res.status(500).json({ message: 'دریافت خطا از سمت سرور' })
    }
}