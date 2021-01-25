const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { gymPicUpload } = require('../Middlewares/uploads')
const { auth, authRole } = require('../Middlewares/authenticates')
const { GYM_ADMIN_ROLE, SITE_ADMIN_ROLE, GYM_MANAGER_ROLE } = require('../Handlers/Constants/roles')
const { accountVerifiedCheck, checkParamId, checkGymAccess, gymEntryCheck } = require('../Middlewares/checks')
const { 
    unBanGym, setAccessToken, getGymByIdForEdit, getAdminGyms, getGlobalGyms, deleteOnePicture, deleteGymAccount,
    banGym, generatePaymentToken,changeHolidays, deleteAllPictures, editInfo, addPicture, getGymById, getGymStaff,
} = require('../Controllers/gymController')

router.get('/', catchErrors(getGlobalGyms))
router.get('/:gymId', checkParamId, catchErrors(getGymById))
router.get('/staff/:gymId', checkParamId, auth, checkGymAccess, catchErrors(getGymStaff)) 
router.get('/edit/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), checkGymAccess, catchErrors(getGymByIdForEdit))
router.get('/admin/:adminId', checkParamId, auth, authRole(SITE_ADMIN_ROLE, GYM_ADMIN_ROLE), catchErrors(getAdminGyms))

router.post('/payment/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, catchErrors(generatePaymentToken))
router.post('/picture/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, gymEntryCheck, gymPicUpload.single('gymPic'), catchErrors(addPicture))

router.put('/ban/:gymId', checkParamId, auth, authRole(SITE_ADMIN_ROLE), accountVerifiedCheck, catchErrors(banGym))
router.put('/unban/:gymId', checkParamId, auth, authRole(SITE_ADMIN_ROLE), accountVerifiedCheck, catchErrors(unBanGym))
router.put('/payment/:paymentToken', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, catchErrors(setAccessToken))
router.put('/info/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, gymEntryCheck, catchErrors(editInfo))
router.put('/holidays/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE, GYM_MANAGER_ROLE), accountVerifiedCheck, checkGymAccess, gymEntryCheck, catchErrors(changeHolidays))

router.delete('/remove/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, catchErrors(deleteGymAccount))
router.delete('/picture/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, gymEntryCheck, catchErrors(deleteAllPictures))
router.delete('/picture/:gymId/:filename', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, gymEntryCheck, catchErrors(deleteOnePicture))

module.exports = router