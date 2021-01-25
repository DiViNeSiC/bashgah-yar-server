const User = require('../Models/User')
const { SITE_ADMIN_ROLE, SITE_MEDIC_ROLE, SITE_SUPPORT_ROLE } = require('../Handlers/Constants/roles')
const { communicationsMiddleware: { sendMessageNotAllowed, userNotFound } } = require('../Handlers/Constants/responseMessages')

exports.sendMessageCheck = (role = null) => async (req, res, next) => {
    let receivers
    if (role && role === (SITE_ADMIN_ROLE || SITE_SUPPORT_ROLE || SITE_MEDIC_ROLE)) {
        if (req.user.role === (SITE_ADMIN_ROLE || SITE_SUPPORT_ROLE || SITE_MEDIC_ROLE)) 
            return res.status(403).json({ message: sendMessageNotAllowed })
        receivers = await User.find({ role })
        req.communicationType = FEEDBACK
    }
    if (!role) {
        const { userId } = req.params
        receivers = await User.findById(userId)
        req.communicationType = COMMUNICATION
    }
    
    if (!receivers || !receivers.length) return res.status(404).json({ message: userNotFound })
    req.receivers = [...receivers]
    next()
}