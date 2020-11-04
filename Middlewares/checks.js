const ObjectId = require('mongoose').Types.ObjectId
const User = require('../Models/User')
const Gym = require('../Models/Gym')
const { ATHLETE_ROLE, GYM_COACH_ROLE, GYM_MANAGER_ROLE, SITE_ADMIN_ROLE } = require('../Handlers/Constants/roles')

const emailExistCheck = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user.email) 
        return res.status(403).json({ 
            message: 'برای انجام این عملیات نیاز به ایمیل دارید' 
        })
    next()
}

const emailVerifiedCheck = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user.verifiedEmail) 
        return res.status(403).json({
            message: 'برای انجام این عملیات نیاز به تایید کردن ایمیل خود دارید' 
        })
    next()
}

const emailNotVerifiedCheck = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (user.verifiedEmail) 
        return res.status(403).json({
            message: 'ایمیل شما در حال حاضر فعال است' 
        })
    next()
}

const isSelectedUserExist = async (req, res, next) => {
    if (!ObjectId.isValid(req.params.userId)) return res.status(404).json({
        message: 'کاربری با این مشخصات یافت نشد'
    })
    next()
}

const checkGymAdminAccess = async (req, res, next) => {
    const { gymId } = req.params
    if (!ObjectId.isValid(gymId)) 
        return res.status(404).json({ 
            message: 'باشگاهی با این مشخصات وجود ندارد'
        })
    const gym = await Gym.findById(gymId)
    if (req.user.role === SITE_ADMIN_ROLE) return next()
    if (gym.admin.toString() !== req.user.id) 
        return res.status(403).json({ 
            message: 'شما به این باشگاه دسترسی ندارید' 
        })
    next()
}

const checkUserInAdminGyms = async (req, res, next) => {
    const { userId } = req.params
    const admin = await User
        .findById(req.user.id)
        .populate('adminGyms')
        .exec()

    const staffArray = [].concat(...admin.adminGyms
        .map(gym => [...gym.managers, ...gym.coaches, ...gym.athletes]))
    const allStaff = staffArray.map(staff => staff.toString())
    if (!allStaff.includes(userId)) return res.status(404).json({
        message: 'کاربری با این مشخصات یافت نشد'
    })
    next()
}

const checkUserInStaffGym = async (req, res, next) => {
    const { userId } = req.params
    const loggedUser = await User
        .findById(req.user.id)
        .populate('gym')
        .exec()

    const { gym: { managers, coaches, athletes }} = loggedUser
    const staffArray = [].concat(...[...managers, ...coaches, ...athletes])
    const allStaff = staffArray.map(staff => staff.toString())
    if (!allStaff.includes(userId)) return res.status(404).json({
        message: 'کاربری با این مشخصات یافت نشد'
    })
    next()
}

const checkPermission = async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    const permissionRoles = req.user.role === GYM_MANAGER_ROLE ?
        [GYM_COACH_ROLE, ATHLETE_ROLE] :
        [ATHLETE_ROLE]
    if (!user) return res.status(404).json({
        message: 'کاربری با این مشخصات یافت نشد'
    })
    if (!permissionRoles.includes(user.role)) return res.status(403).json({
        message: 'شما نمیتوانید به این کاربر دسترسی داشته باشید'
    })
    next()
}

const checkIsNotHimSelf = async (req, res, next) => {
    if (req.user.id === req.params.userId) return res.status(403).json({
        message: 'شما نمیتوانید حساب کاربری خود را پاک کنید'
    })
    next()
}

const checkUserIsNotSiteAdmin = async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json({
        message: 'کاربری با این مشخصات یافت نشد'
    })
    if (user.role === SITE_ADMIN_ROLE) return res.status(403).json({
        message: 'شما نمیتوانید به حساب کاربری ادمین سایت دسترسی داشته باشید'
    })
    next()
}

module.exports = { 
    emailExistCheck,
    emailVerifiedCheck, 
    emailNotVerifiedCheck,
    checkUserInAdminGyms,
    checkUserInStaffGym,
    isSelectedUserExist,
    checkPermission,
    checkGymAdminAccess,
    checkIsNotHimSelf,
    checkUserIsNotSiteAdmin
}