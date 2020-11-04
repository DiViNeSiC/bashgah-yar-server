const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { authRole } = require('../Middlewares/authenticates')
const { emailVerifiedCheck, checkGymAdminAccess } = require('../Middlewares/checks')
const { gymPicUpload } = require('../Middlewares/uploadImage')
const { GYM_MANAGER_ROLE, GYM_ADMIN_ROLE, SITE_ADMIN_ROLE, GYM_COACH_ROLE, ATHLETE_ROLE } = require('../Handlers/Constants/roles')
const { 
    getUserGym,
    getGymById,
    getAdminGymsById,
    addPicture,
    deleteAllPictures,
    deleteGymAccount,
    deleteOnePicture,
    editInfo,
} = require('../Controllers/gymController')

router.get('/user-gym', authRole(GYM_MANAGER_ROLE, GYM_COACH_ROLE, ATHLETE_ROLE), catchErrors(getUserGym))
router.get('/admin-gyms', authRole(GYM_ADMIN_ROLE), catchErrors(getAdminGymsById))
router.get('/admin-gyms/all/:adminId', authRole(SITE_ADMIN_ROLE), catchErrors(getAdminGymsById))
router.get('/admin-gyms/one/:gymId', authRole(SITE_ADMIN_ROLE, GYM_ADMIN_ROLE), checkGymAdminAccess, catchErrors(getGymById))

router.post('/picture/:gymId', authRole(GYM_ADMIN_ROLE), emailVerifiedCheck, checkGymAdminAccess, gymPicUpload.single('gymPic'), catchErrors(addPicture))

router.put('/info/:gymId', authRole(GYM_ADMIN_ROLE), emailVerifiedCheck, checkGymAdminAccess, catchErrors(editInfo))

router.delete('/remove/:gymId', authRole(GYM_ADMIN_ROLE), emailVerifiedCheck, checkGymAdminAccess, catchErrors(deleteGymAccount))
router.delete('/picture/:gymId', authRole(GYM_ADMIN_ROLE), emailVerifiedCheck, checkGymAdminAccess, catchErrors(deleteAllPictures))
router.delete('/picture/:gymId/:filename', authRole(GYM_ADMIN_ROLE), emailVerifiedCheck, checkGymAdminAccess, catchErrors(deleteOnePicture))

module.exports = router