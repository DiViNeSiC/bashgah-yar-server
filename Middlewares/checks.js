const User = require('../Models/User')
const Gym = require('../Models/Gym')
const ObjectId = require('mongoose').Types.ObjectId
const { checksMiddleware: errorMsgs } = require('../Handlers/Constants/responseMessages')
const { ATHLETE_ROLE, GYM_COACH_ROLE, GYM_MANAGER_ROLE, GYM_ADMIN_ROLE, SITE_ADMIN_ROLE } = require('../Handlers/Constants/roles')

exports.emailExistCheck = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user.email) return res.status(403).json({ message: errorMsgs.emailNeeded })
    next()
}

exports.accountVerifiedCheck = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user.verifiedEmail) return res.status(403).json({ message: errorMsgs.accountVerifyNeeded })
    next()
}

exports.accountNotVerifiedCheck = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (user.verifiedEmail) return res.status(403).json({ message: errorMsgs.accountIsVerified })
    next()
}

exports.checkParamId = async (req, res, next) => {
    const { gymId, userId, adminId, scheduleId, moveId, athleteId, messageId } = req.params
    const paramError = (gymId && !ObjectId.isValid(gymId)) || 
        (moveId && !ObjectId.isValid(moveId)) || (userId && !ObjectId.isValid(userId)) ||
        (adminId && !ObjectId.isValid(adminId)) || (messageId && !ObjectId.isValid(messageId)) ||
        (athleteId && !ObjectId.isValid(athleteId)) || (scheduleId && !ObjectId.isValid(scheduleId))

    if (paramError) return res.status(400).json({ message: errorMsgs.paramCheckError })
    next()
}

exports.checkIsNotHimSelf = async (req, res, next) => {
    if (req.user.id === req.params.userId) return res.status(403).json({ message: errorMsgs.accessNotAllowed })
    next()
}

exports.checkGymAccess = async (req, res, next) => {
    const { gymId } = req.params
    const loggedUser = await User.findById(req.user.id)
    const loggedUserIsSiteAdmin = loggedUser.role === SITE_ADMIN_ROLE
    const loggedUserIsGymAdmin = loggedUser.role === GYM_ADMIN_ROLE
    const loggedUserIsGymStaff = loggedUser.role === GYM_MANAGER_ROLE || 
        loggedUser.role === GYM_COACH_ROLE || loggedUser.role === ATHLETE_ROLE

    if (loggedUserIsSiteAdmin) return next()

    if (loggedUserIsGymAdmin) {
        const { adminGyms } = loggedUser
        if (!adminGyms.length) return res.status(404).json({ message: errorMsgs.gymNotFound })
        if (!adminGyms.includes(gymId)) return res.status(403).json({ message: errorMsgs.gymAccessNotAllowed })
    }

    if (loggedUserIsGymStaff && loggedUser.gym !== gymId) 
        return res.status(403).json({ message: errorMsgs.gymAccessNotAllowed })
    
    next()
}

exports.checkUserAccessForDelete = async (req, res, next) => {
    const { userId } = req.params
    const selectedUser = await User.findById(userId)
    if (!selectedUser) return res.status(404).json({ message: errorMsgs.userNotFound })
    if (selectedUser.role === SITE_ADMIN_ROLE || selectedUser.role === GYM_ADMIN_ROLE) 
        return res.status(403).json({ message: errorMsgs.userDeleteAccessNotAllowed })

    const selectedUserGym = await Gym.findById(selectedUser.gym)
    const loggedUser = await User.findById(req.user.id).populate('adminGyms').exec()

    if (loggedUser.role === GYM_ADMIN_ROLE) {
        const { adminGyms } = loggedUser
        if (!adminGyms.length) return res.status(404).json({ message: errorMsgs.gymsNeeded })
        const staffArray = [].concat(...adminGyms.map(gym => [...gym.managers, ...gym.coaches, ...gym.athletes]))
        const allStaff = staffArray.map(staff => staff.toString())
        if (!allStaff.includes(userId)) return res.status(403).json({ message: errorMsgs.userDeleteAccessNotAllowed })
    }

    if (loggedUser.role === GYM_MANAGER_ROLE) {
        if (selectedUser.role === GYM_MANAGER_ROLE) return res.status(403).json({ message: errorMsgs.userDeleteAccessNotAllowed })
        if (selectedUser.gym.toString() !== loggedUser.gym.toString()) return res.status(403).json({ message: errorMsgs.userDeleteAccessNotAllowed })
    }

    req.selectedUser = selectedUser
    req.selectedUserGym = selectedUserGym
    next()
}