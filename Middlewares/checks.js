const User = require('../Models/User')
const Gym = require('../Models/Gym')
const ObjectId = require('mongoose').Types.ObjectId
const { ATHLETE_ROLE,  GYM_COACH_ROLE, GYM_MANAGER_ROLE, GYM_ADMIN_ROLE, SITE_ADMIN_ROLE } = require('../Handlers/Constants/roles')

exports.emailExistCheck = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user.email) 
        return res.status(403).json({ message: 'برای انجام این عملیات نیاز به ایمیل دارید' })
    next()
}

exports.emailVerifiedCheck = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user.verifiedEmail) 
        return res.status(403).json({ message: 'برای انجام این عملیات نیاز به تایید کردن ایمیل خود دارید' })
    next()
}

exports.emailNotVerifiedCheck = async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (user.verifiedEmail) 
        return res.status(403).json({ message: 'ایمیل شما در حال حاضر فعال است' })
    next()
}

exports.checkParamId = async (req, res, next) => {
    const { gymId, userId, adminId } = req.params
    const message = 'مشخصات دریافت شده صحیح نمی باشد'
    if (gymId && !ObjectId.isValid(gymId)) return res.status(400).json({ message })
    if (userId && !ObjectId.isValid(userId)) return res.status(400).json({ message })
    if (adminId && !ObjectId.isValid(adminId)) return res.status(400).json({ message })
    next()
}

exports.checkIsNotHimSelf = async (req, res, next) => {
    if (req.user.id === req.params.userId) return res.status(403).json({
        message: 'خطا! شما نمی توانید به این کاربر دسترسی داشته باشید'
    })
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
        if (!adminGyms.length) return res.status(404).json({
            message: 'باشگاهی یافت نشد'
        })
        if (!adminGyms.includes(gymId)) return res.status(403).json({
            message: 'شما نمی توانید به کاربران این باشگاه دسترسی داشته باشید'
        })
    }

    if (loggedUserIsGymStaff && loggedUser.gym !== gymId) return res.status(403).json({
        message: 'شما نمی توانید به کاربران این باشگاه دسترسی داشته باشید'
    })
    
    next()
}

exports.checkUserAccessForGet = async (req, res, next) => {
    const { userId } = req.params
    const selectedUser = await User.findById(userId)
        .populate('adminGyms').populate('gym').exec()

    if (!selectedUser) return res.status(404).json({ message: 'کاربری با این مشخصات یافت نشد' })
    if (selectedUser.role === SITE_ADMIN_ROLE)
        return res.status(403).json({ message: 'شما نمی توانید به اطلاعات این کاربر دسترسی داشته باشید' })

    const loggedUser = await User.findById(req.user.id).populate('adminGyms').exec() 

    if (loggedUser.role === SITE_ADMIN_ROLE) {
        req.selectedUser = selectedUser
        return next()
    }

    if (loggedUser.role === GYM_ADMIN_ROLE) {
        const { adminGyms } = loggedUser
        if (!adminGyms.length) 
            return res.status(404).json({ message: 'شما باشگاهی برای دسترسی به حساب کاربری از آن را ندارید' })

        const staffArray = [].concat(...adminGyms.map(gym => [...gym.managers, ...gym.coaches, ...gym.athletes]))
        const allStaff = staffArray.map(staff => staff.toString())

        if (!allStaff.includes(selectedUser.id)) 
            return res.status(403).json({ message: 'شما به حساب کاربری مورد نظر دسترسی ندارید' })
    }

    if ((loggedUser.role === GYM_MANAGER_ROLE || 
        loggedUser.role === GYM_COACH_ROLE || 
        loggedUser.role === ATHLETE_ROLE) && 
        selectedUser.gym.id !== loggedUser.gym.toString()
    ) return res.status(403).json({ message: 'شما به حساب کاربری مورد نظر دسترسی ندارید' })

    req.selectedUser = selectedUser
    next()
}

exports.checkUserAccessForDelete = async (req, res, next) => {
    const { userId } = req.params
    const selectedUser = await User.findById(userId)
    if (!selectedUser) return res.status(404).json({ message: 'کاربری با این مشخصات یافت نشد' })
    if (selectedUser.role === SITE_ADMIN_ROLE || selectedUser.role === GYM_ADMIN_ROLE) 
        return res.status(403).json({ message: 'شما نمی توانید حساب کاریر مورد نظر را پاک کنید' })

    const selectedUserGym = await Gym.findById(selectedUser.gym)
    const loggedUser = await User.findById(req.user.id).populate('adminGyms').exec()

    if (loggedUser.role === GYM_ADMIN_ROLE) {
        const { adminGyms } = loggedUser
        if (!adminGyms.length) 
            return res.status(404).json({ message: 'شما باشگاهی برای پاک کردن حساب کاربری از آن را ندارید' })
        
        const staffArray = [].concat(...adminGyms.map(gym => [...gym.managers, ...gym.coaches, ...gym.athletes]))
        const allStaff = staffArray.map(staff => staff.toString())

        if (!allStaff.includes(userId))
            return res.status(403).json({ message: 'شما نمی توانید حساب کاریر مورد نظر را پاک کنید' })
    }

    if (loggedUser.role === GYM_MANAGER_ROLE) {
        if (selectedUser.role === GYM_MANAGER_ROLE) 
            return res.status(403).json({ message: 'شما نمی توانید حساب کاریر مورد نظر را پاک کنید' })
        if (selectedUser.gym.toString() !== loggedUser.gym.toString())
            return res.status(403).json({ message: 'شما نمی توانید حساب کاریر مورد نظر را پاک کنید' })
    }

    req.selectedUser = selectedUser
    req.selectedUserGym = selectedUserGym
    next()
}