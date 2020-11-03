const router = require('express').Router()
const { 
    checkUserInAdminGyms, 
    checkUserInStaffGym, 
    checkPermission,
    checkIsNotHimSelf,
    checkUserIsNotSiteAdmin,
    emailExistCheck,
    emailVerifiedCheck
} = require('../Middlewares/checks')
const { authRole } = require('../Middlewares/authenticates')
const { deleteGymAdminOps } = require('../Middlewares/controllingOperations')
const { catchErrors } = require('../Handlers/errorHandler')
const { 
    GYM_MANAGER_ROLE,
    GYM_ADMIN_ROLE,
    SITE_ADMIN_ROLE, 
    GYM_COACH_ROLE 
} = require('../Handlers/Constants/roles')
const {
    getLoggedUser,
    getUserById,
    updateAccountCredentials,
    updateAvatar,
    updateEmail,
    sendChangePasswordEmail,
    changePasswordConfirm,
    deleteAvatar,
    deleteUserById
} = require('../Controllers/userController')

router.get('/', catchErrors(getLoggedUser))
router.get('/all-users/:userId', authRole(SITE_ADMIN_ROLE), checkUserIsNotSiteAdmin, catchErrors(getUserById))
router.get('/admin-gym-staff/:userId', authRole(GYM_ADMIN_ROLE), checkUserInAdminGyms, catchErrors(getUserById))
router.get('/gym-users/:userId', authRole(GYM_MANAGER_ROLE, GYM_COACH_ROLE), checkUserInStaffGym, checkPermission, catchErrors(getUserById))

router.post('/change-password', emailExistCheck, emailVerifiedCheck, catchErrors(sendChangePasswordEmail))

router.put('/email', catchErrors(updateEmail))
router.put('/avatar', catchErrors(updateAvatar))
router.put('/credentials', catchErrors(updateAccountCredentials))
router.put('/change-password/:resetPassToken', catchErrors(changePasswordConfirm))

router.delete('/avatar', catchErrors(deleteAvatar))

router.delete('/all-users/:userId', checkIsNotHimSelf, authRole(SITE_ADMIN_ROLE), checkUserIsNotSiteAdmin, emailVerifiedCheck, deleteGymAdminOps, catchErrors(deleteUserById))
router.delete('/admin-gym-staff/:userId', checkIsNotHimSelf, authRole(GYM_ADMIN_ROLE), emailVerifiedCheck, checkUserInAdminGyms, catchErrors(deleteUserById))
router.delete('/gym-users/:userId', checkIsNotHimSelf, authRole(GYM_MANAGER_ROLE), emailVerifiedCheck, checkUserInStaffGym, checkPermission, catchErrors(deleteUserById))

module.exports = router