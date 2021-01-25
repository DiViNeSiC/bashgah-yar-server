const Gym = require('../Models/Gym')
const getTimeDifference = require('../Handlers/getTimeDifference')
const { GET, DELETE, BAN, COMMUNICATION, SCHEDULES } = require('../Handlers/Constants/checkMethods')
const { handlers: { checkAccesses: errorMsgs } } = require('../Handlers/Constants/responseMessages')
const { GYM_COACH_ROLE, ATHLETE_ROLE, SITE_ADMIN_ROLE, GYM_MANAGER_ROLE, GYM_ADMIN_ROLE, SITE_SUPPORT_ROLE, SITE_MEDIC_ROLE } = require('../Handlers/Constants/roles')

function gymAdminChecking(adminGyms, selectedUserId) {
    const staffArray = [].concat(...adminGyms.map(gym => [...gym.managers, ...gym.coaches, ...gym.athletes]))
    const allStaff = staffArray.map(staff => staff.toString())
    return allStaff.includes(selectedUserId.toString())
}

function gymEqualityChecking(firstGym, secondGym) {
    const firstGymId = firstGym._id ? firstGym._id : firstGym
    const secondGymId = secondGym._id ? secondGym._id : secondGym
    return firstGymId.toString() === secondGymId.toString()
}

function selectedUserIsLoggedUserGymAdminCheck(selectedUserId, loggedUserGym) {
    return selectedUserId.toString() === loggedUserGym.admin.toString()
}

exports.checkAccessForUser = (selectedUser, loggedUser, method) => {
    switch(method) {
        case GET: {
            if (loggedUser.role === (SITE_ADMIN_ROLE || SITE_SUPPORT_ROLE || SITE_MEDIC_ROLE))
                return { error: null, status: 200 }
            
            if (loggedUser.role === GYM_ADMIN_ROLE) {
                const { adminGyms } = loggedUser
                if (!adminGyms.length) return { error: errorMsgs.gymsNeeded, status: 404 }
                const hasAccess = gymAdminChecking(adminGyms, selectedUser.id)
                if (!hasAccess) return { error: errorMsgs.userAccessNotAllowed, status: 403 }
            }

            if (loggedUser.role === (GYM_MANAGER_ROLE || GYM_COACH_ROLE || ATHLETE_ROLE)) {
                const hasAccess = gymEqualityChecking(loggedUser.gym, selectedUser.gym) || 
                    selectedUserIsLoggedUserGymAdminCheck(selectedUser.id, loggedUser.gym)
                if (!hasAccess) return { error: errorMsgs.userAccessNotAllowed, status: 403 }
            }
        }
        case SCHEDULES: {
            if (GYM_COACH_ROLE) {
                const hasAccess = gymEqualityChecking(loggedUser.gym, selectedUser.gym)
                if (!hasAccess) return { error: errorMsgs.userAccessNotAllowed, status: 403 }
            }

            if (ATHLETE_ROLE) {
                const hasAccess = selectedUser._id.toString() === loggedUser._id.toString()
                if (!hasAccess) return { error: errorMsgs.userAccessNotAllowed, status: 403 }
            }
            
            return { error: null, status: 200 }
        }
        case DELETE: {
            if (loggedUser.role === GYM_ADMIN_ROLE) {
                const { adminGyms } = loggedUser
                if (!adminGyms.length) return { error: errorMsgs.gymsNeeded, status: 404 }
                const hasAccess = gymAdminChecking(adminGyms, selectedUser.id)
                if (!hasAccess) return { error: errorMsgs.userAccessNotAllowed, status: 403 }
            }

            if (loggedUser.role === (GYM_MANAGER_ROLE)) {
                const hasAccess = gymEqualityChecking(loggedUser.gym, selectedUser.gym)
                if (!hasAccess || selectedUser.role === GYM_MANAGER_ROLE) 
                    return { error: errorMsgs.userAccessNotAllowed, status: 403 }
            }

            return { error: errorMsgs.userAccessNotAllowed, status: 403 }
        }
        case BAN: {
            if (loggedUser.role === SITE_ADMIN_ROLE) return { error: null, status: 200 }

            if (loggedUser.role === GYM_ADMIN_ROLE) {
                const { adminGyms } = loggedUser
                if (!adminGyms.length) return { error: errorMsgs.gymsNeeded, status: 404 }
                const hasAccess = gymAdminChecking(adminGyms, selectedUser.id)
                if (!hasAccess) return { error: errorMsgs.userAccessNotAllowed, status: 403 }
            }

            if (loggedUser.role === (GYM_MANAGER_ROLE)) {
                const hasAccess = gymEqualityChecking(loggedUser.gym, selectedUser.gym)
                if (!hasAccess || selectedUser.role === GYM_MANAGER_ROLE) 
                    return { error: errorMsgs.userAccessNotAllowed, status: 403 }
            }

            return { error: errorMsgs.userAccessNotAllowed, status: 403 }
        }
        case COMMUNICATION: {
            if (loggedUser.role === (SITE_ADMIN_ROLE || SITE_MEDIC_ROLE || SITE_SUPPORT_ROLE))
                return { error: null, status: 200 }

            if (selectedUser.role === ATHLETE_ROLE && loggedUser.role === ATHLETE_ROLE) 
                return { error: errorMsgs.userAccessNotAllowed, status: 403 }

            if (loggedUser.role === GYM_ADMIN_ROLE) {
                const { adminGyms } = loggedUser
                if (!adminGyms.length) return { error: errorMsgs.gymsNeeded, status: 404 }
                const hasAccess = gymAdminChecking(adminGyms, selectedUser.id)
                if (!hasAccess) return { error: errorMsgs.userAccessNotAllowed, status: 403 }
            }

            if (loggedUser.role === (GYM_MANAGER_ROLE || GYM_COACH_ROLE || ATHLETE_ROLE)) {
                const hasAccess = gymEqualityChecking(loggedUser.gym, selectedUser.gym) || 
                    selectedUserIsLoggedUserGymAdminCheck(selectedUser.id, loggedUser.gym)
                if (!hasAccess) return { error: errorMsgs.userAccessNotAllowed, status: 403 }
            }
        }
        default: return
    }
}

exports.checkAccessForGym = (gymId, loggedUser) => {
    if (loggedUser.role === SITE_ADMIN_ROLE) return { error: null, status: 200 }

    if (loggedUser.role === GYM_ADMIN_ROLE) {
        const { adminGyms } = loggedUser
        if (!adminGyms.length) return { error: errorMsgs.gymsNeeded, status: 404 }
        if (!adminGyms.includes(gymId)) return { error: errorMsgs.gymAccessNotAllowed, status: 403 }
    }

    if (loggedUser.role === GYM_MANAGER_ROLE || loggedUser.role === GYM_COACH_ROLE || loggedUser.role === ATHLETE_ROLE) {
        if (loggedUser.gym !== gymId) return { error: errorMsgs.gymAccessNotAllowed, status: 403 }
    }

    return { error: null, status: 200 }
}

exports.checkGymAccessToken = async (gymId) => {
    const gym = await Gym.findById(gymId).populate('admin').exec()

    if (!gym) return { error: errorMsgs.gymNotFound, status: 404 }
    if (!gym.accessToken || !gym.accessExpireDate)
        return { error: errorMsgs.gymAccessTokenHasExpired, status: 403 }
        
    const { mainDifference } = getTimeDifference(gym.accessExpireDate)
    if (mainDifference < 0)
        return { error: errorMsgs.gymAccessTokenHasExpired, status: 403 }

    if (gym.isBanned) return { error: errorMsgs.gymIsBanned, status: 403 }
    if (gym.admin.isBanned) return { error: errorMsgs.gymAdminIsBanned, status: 403 }

    return { error: null, status: 200 }
}