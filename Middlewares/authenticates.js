const jwt = require('jsonwebtoken')
const User = require('../Models/User')

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization 
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ 
        message: 'شما باید وارد حساب کاربری خود شوید'
    })

    const user = await User.findOne({ entryToken: token })
    if (!user) return res.status(401).json({ 
        message: 'شما باید وارد حساب کاربری خود شوید'
    })

    try {
        const user = await jwt.verify(token, process.env.JWT_ENTRY_SECRET)
        req.user = user
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

const authRole = (...entryRole) => (req, res, next) => {
    if (!entryRole.includes(req.user.role)) 
        return res.status(403).json({ 
            message: 'شما نمیتوانید به این بخش دسترسی داشته باشید' 
        }) 
    next()
}

const notAuth = async (req, res, next) => {
    const authToken = req.headers.authorization
    if (authToken) return res.status(403).json({ 
        message: 'شما از این کار منع شده اید'
    })
    next()
}

module.exports = { auth, authRole, notAuth }