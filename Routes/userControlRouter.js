const router = require('express').Router()
const { avatarUpload } = require('../Middlewares/uploads')
const { catchErrors } = require('../Handlers/errorHandler')
const { authRole } = require('../Middlewares/authenticates')
const { GYM_MANAGER_ROLE, GYM_ADMIN_ROLE, SITE_ADMIN_ROLE, GYM_COACH_ROLE } = require('../Handlers/Constants/roles')
const { 
    emailExistCheck, accountVerifiedCheck, checkAccessForBanStatus, checkParamId, 
    checkUserAccessForGet, checkUserAccessForDelete,  checkIsNotHimSelf, gymEntryCheck,
} = require('../Middlewares/checks')
const {
    updateEmail, getUserById, updateAvatar, deleteAvatar, getGymCoachesAndAthletes,
    banUser, markAthletesSession, deleteGymStaffAccount, sendChangePasswordEmail, updateAccountCredentials,
    unBanUser, editAthletesSessions, getLoggedUser, getGymAthletes, getAllGymAdmins, changePasswordConfirm,
} = require('../Controllers/userController')

router.get('/', catchErrors(getLoggedUser))
router.get('/gym-admins', authRole(SITE_ADMIN_ROLE), catchErrors(getAllGymAdmins))
router.get('/gym-athletes', authRole(GYM_COACH_ROLE), catchErrors(getGymAthletes))
router.get('/gym-users', authRole(GYM_MANAGER_ROLE), catchErrors(getGymCoachesAndAthletes))
router.get('/all/:userId', checkParamId, checkIsNotHimSelf, checkUserAccessForGet, catchErrors(getUserById))

router.post('/change-password', emailExistCheck, accountVerifiedCheck, catchErrors(sendChangePasswordEmail))

router.put('/email', catchErrors(updateEmail))
router.put('/avatar', avatarUpload.single('avatar'), catchErrors(updateAvatar))
router.put('/credentials', catchErrors(updateAccountCredentials))
router.put('/change-password/:changePasswordToken', catchErrors(changePasswordConfirm))
router.put('/sessions/mark/:athleteId', authRole(GYM_MANAGER_ROLE), accountVerifiedCheck, gymEntryCheck, checkUserAccessForGet, catchErrors(markAthletesSession))
router.put('/sessions/edit/:athleteId', authRole(GYM_MANAGER_ROLE), accountVerifiedCheck, gymEntryCheck, checkUserAccessForGet, catchErrors(editAthletesSessions))
router.put('/ban/:userId', checkParamId, checkIsNotHimSelf, authRole(SITE_ADMIN_ROLE, GYM_ADMIN_ROLE, GYM_MANAGER_ROLE), accountVerifiedCheck, checkAccessForBanStatus, catchErrors(banUser))
router.put('/unban/:userId', checkParamId, checkIsNotHimSelf, authRole(SITE_ADMIN_ROLE, GYM_ADMIN_ROLE, GYM_MANAGER_ROLE), accountVerifiedCheck, checkAccessForBanStatus, catchErrors(unBanUser))

router.delete('/avatar', catchErrors(deleteAvatar))
router.delete('/gym-staff/:userId', checkIsNotHimSelf, checkParamId, authRole(GYM_ADMIN_ROLE, GYM_MANAGER_ROLE), accountVerifiedCheck, checkUserAccessForDelete, catchErrors(deleteGymStaffAccount))

module.exports = router