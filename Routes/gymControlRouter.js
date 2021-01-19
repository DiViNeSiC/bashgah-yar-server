const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { gymPicUpload } = require('../Middlewares/uploads')
const { auth, authRole } = require('../Middlewares/authenticates')
const { GYM_ADMIN_ROLE, SITE_ADMIN_ROLE } = require('../Handlers/Constants/roles')
const { accountVerifiedCheck, checkParamId, checkGymAccess } = require('../Middlewares/checks')
const { 
    deleteAllPictures, editInfo, addPicture, getGymById, getGymStaff,
    getGymByIdForEdit, getAdminGyms, getGlobalGyms, deleteOnePicture, deleteGymAccount,
} = require('../Controllers/gymController')

router.get('/', catchErrors(getGlobalGyms))
router.get('/:gymId', checkParamId, catchErrors(getGymById))
router.get('/staff/:gymId', checkParamId, auth, checkGymAccess, catchErrors(getGymStaff)) 
router.get('/edit/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), checkGymAccess, catchErrors(getGymByIdForEdit))
router.get('/admin/:adminId', checkParamId, auth, authRole(SITE_ADMIN_ROLE, GYM_ADMIN_ROLE), catchErrors(getAdminGyms))

router.post('/picture/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, gymPicUpload.single('gymPic'), catchErrors(addPicture))
router.put('/info/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, catchErrors(editInfo))

router.delete('/remove/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, catchErrors(deleteGymAccount))
router.delete('/picture/:gymId', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, catchErrors(deleteAllPictures))
router.delete('/picture/:gymId/:filename', checkParamId, auth, authRole(GYM_ADMIN_ROLE), accountVerifiedCheck, checkGymAccess, catchErrors(deleteOnePicture))

module.exports = router