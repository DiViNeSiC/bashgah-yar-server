const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const { authMiddleware: { jwtExpired, accessNotAllowed, loginNeeded, serverError } } = require('../Handlers/Constants/responseMessages')

exports.auth = async (req, res, next) => {
    const authHeader = req.headers.authorization 
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ message: loginNeeded })
    const user = await User.findOne({ entryToken: token })
    if (!user) return res.status(401).json({ message: loginNeeded })

    try {
        const user = await jwt.verify(token, process.env.JWT_ENTRY_SECRET)
        req.user = user
        next()
    } catch (err) {
        if (err.message === jwtExpired) {
            await user.updateOne({ token: '' })
            return res.status(401).json({ message: loginNeeded })
        }
        res.status(500).json({ message: serverError })
    }
}

exports.authRole = (...entryRole) => (req, res, next) => {
    if (!entryRole.includes(req.user.role)) return res.status(403).json({ message: accessNotAllowed }) 
    next()
}

exports.notAuth = async (req, res, next) => {
    const authToken = req.headers.authorization
    if (authToken) return res.status(403).json({ message: accessNotAllowed })
    next()
}