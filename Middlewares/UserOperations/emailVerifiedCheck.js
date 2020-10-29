const User = require('../../Models/User')

module.exports = async (req, res, next) => {
    const user = await User.findById(req.payload.id)
    if (!user.verifiedEmail) 
        return res.status(403).json({ 
            message: 'برای انجام این عملیات نیاز به تایید کردن ایمیل خود دارید' 
        })
    next()
}