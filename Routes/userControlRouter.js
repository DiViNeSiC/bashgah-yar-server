const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { authRole } = require('../Middlewares/authenticates')
const { avatarUpload } = require('../Middlewares/uploadImage')
const { GYM_MANAGER_ROLE, GYM_ADMIN_ROLE, SITE_ADMIN_ROLE, GYM_COACH_ROLE } = require('../Handlers/Constants/roles')
const {
    checkParamId, checkUserAccessForDelete, emailExistCheck,
    checkIsNotHimSelf, emailVerifiedCheck, checkUserAccessForGet,
} = require('../Middlewares/checks')
const {
    getLoggedUser, getGymAthletes, getAllGymAdmins, changePasswordConfirm,
    deleteGymStaffAccount, sendChangePasswordEmail, updateAccountCredentials, 
    updateEmail, getUserById, updateAvatar, deleteAvatar, getGymCoachesAndAthletes,
} = require('../Controllers/userController')

router.get('/', catchErrors(getLoggedUser))
router.get('/gym-admins', authRole(SITE_ADMIN_ROLE), catchErrors(getAllGymAdmins))
router.get('/gym-athletes', authRole(GYM_COACH_ROLE), catchErrors(getGymAthletes))
router.get('/gym-users', authRole(GYM_MANAGER_ROLE), catchErrors(getGymCoachesAndAthletes))
router.get('/all/:userId', checkIsNotHimSelf, checkParamId, checkUserAccessForGet, catchErrors(getUserById))

router.post('/change-password', emailExistCheck, emailVerifiedCheck, catchErrors(sendChangePasswordEmail))

router.put('/email', catchErrors(updateEmail))
router.put('/avatar', avatarUpload.single('avatar'), catchErrors(updateAvatar))
router.put('/credentials', catchErrors(updateAccountCredentials))
router.put('/change-password/:changePasswordToken', catchErrors(changePasswordConfirm))

router.delete('/avatar', catchErrors(deleteAvatar))
router.delete('/gym-staff/:userId', checkIsNotHimSelf, checkParamId, authRole(GYM_ADMIN_ROLE, GYM_MANAGER_ROLE), checkUserAccessForDelete, catchErrors(deleteGymStaffAccount))

module.exports = router