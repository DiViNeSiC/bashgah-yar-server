const Gym = require('../Models/Gym')
const User = require('../Models/User')
const Schedule = require('../Models/Schedule')
const ObjectId = require('mongoose').Types.ObjectId
const { ATHLETE_ROLE } = require('../Handlers/Constants/roles')
const { checksMiddleware: errorMsgs } = require('../Handlers/Constants/responseMessages')
const { BAN, DELETE, GET, COMMUNICATION, FEEDBACK, SCHEDULES } = require('../Handlers/Constants/checkMethods')
const { checkAccessForUser, checkAccessForGym, checkGymAccessToken } = require('../Handlers/checkAccesses')

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
    const loggedUser = await User.findById(req.user.id).populate('adminGyms').exec()

    const { error, status } = checkAccessForGym(gymId, loggedUser)
    if (error) return res.status(status).json({ message: error })
    next()
}

exports.checkUserAccessForGet = async (req, res, next) => {
    const { userId } = req.params
    const selectedUser = await User.findById(userId)
    const loggedUser = await User.findById(req.user.id).populate('adminGyms').exec()
    if (!selectedUser) return res.status(404).json({ message: errorMsgs.userNotFound })

    const { error, status } = checkAccessForUser(selectedUser, loggedUser, GET)
    if (error) return res.status(status).json({ message: error })
    next()
}

exports.checkUserAccessForDelete = async (req, res, next) => {
    const { userId } = req.params
    const selectedUser = await User.findById(userId)
    if (!selectedUser) return res.status(404).json({ message: errorMsgs.userNotFound })
    const loggedUser = await User.findById(req.user.id).populate('adminGyms').exec()
    
    const { error, status } = checkAccessForUser(selectedUser, loggedUser, DELETE)
    if (error) return res.status(status).json({ message: error })
    
    const selectedUserGym = await Gym.findById(selectedUser.gym)

    req.selectedUser = selectedUser
    req.selectedUserGym = selectedUserGym
    next()
}

exports.checkAccessForBanStatus = async (req, res, next) => {
    const { userId } = req.params
    const selectedUser = await User.findById(userId)
    if (!selectedUser) return res.status(404).json({ message: errorMsgs.userNotFound })
    const loggedUser = await User.findById(req.user.id).populate('adminGyms').exec()

    const { error, status } = checkAccessForUser(selectedUser, loggedUser, BAN)
    if (error) return res.status(status).json({ message: error })
    next()
}

exports.checkAccessForCommunication = async (req, res, next) => {
    const { receivers, communicationType } = req
    if (communicationType === FEEDBACK) return next()
    const loggedUser = await User.findById(req.user.id).populate('adminGyms').exec()

    receivers.forEach(receiver => {
        const { error, status } = checkAccessForUser(receiver, loggedUser, COMMUNICATION)
        if (error) return res.status(status).json({ message: error })
    })

    next()
}

exports.checkAccessForSchedules = async (req, res, next) => {
    const { athleteId, scheduleId } = req.params
    const loggedUser = await User.findById(req.user.id)
    if (athleteId) {
        const athlete = await User.findOne({ _id: athleteId, role: ATHLETE_ROLE })
            .populate('gym').exec()
        
        if (!athlete) return res.status(404).json({ message: errorMsgs.userNotFound })
        const { error, status } = checkAccessForUser(athlete, loggedUser, SCHEDULES)
        if (error) return res.status(status).json({ message: error })
        req.athlete = athlete
    }
    if (scheduleId) {
        const schedule = await Schedule.findById(scheduleId)
            .populate('coach').populate('athlete').populate('movesList').exec()

        if (!schedule) return res.status(404).json({ message: errorMsgs.scheduleNotFound })
        const { error, status } = checkAccessForUser(schedule.athlete, loggedUser, SCHEDULES)
        if (error) return res.status(status).json({ message: error })
        req.schedule = schedule
    }

    next()
}

exports.gymEntryCheck = async (req, res) => {
    const { gymId: gymIdInBody } = req.body
    const { gymId: gymIdInParams, userId } = req.params
    const gymId = gymIdInBody ? gymIdInBody : gymIdInParams ? gymIdInParams : null
    if (gymId) {
        const { error, status } = checkGymAccessToken(gymId)
        if (error) return res.status(status).json({ message: error })
    }

    const loggedUser = await User.findById(req.user.id)
    if (loggedUser.gym) {
        const { error, status } = checkGymAccessToken(loggedUser.gym)
        if (error) return res.status(status).json({ message: error })
    }

    if (userId) {
        const selectedUser = await User.findById(userId)
        if (!selectedUser) return res.status(404).json({ message: errorMsgs.userNotFound })
        if (selectedUser.gym) {
            const { error, status } = checkGymAccessToken(selectedUser.gym)
            if (error) return res.status(status).json({ message: error })
        }
    }

    next()
}