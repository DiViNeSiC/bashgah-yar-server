const router = require('express').Router()
const { avatarUpload, gymPicUpload } = require('../Middlewares/uploadImage')
const { authRole } = require('../Middlewares/authenticates')
const { catchErrors } = require('../Handlers/errorHandler')
const { GYM_MANAGER_ROLE, GYM_ADMIN_ROLE, SITE_ADMIN_ROLE } = require('../Handlers/Constants/roles')
const {
    gymAdminRegister,
    gymRegister,
    managerRegister,
    coachRegister,
    athleteRegister
} = require('../Controllers/registrationController')

router.post('/', authRole(GYM_ADMIN_ROLE), gymPicUpload.array('gymPics'), catchErrors(gymRegister))
router.post('/admin', authRole(SITE_ADMIN_ROLE), avatarUpload.single('avatar'), catchErrors(gymAdminRegister))
router.post('/manager', authRole(GYM_ADMIN_ROLE), avatarUpload.single('avatar'), catchErrors(managerRegister))
router.post('/coach', authRole(GYM_MANAGER_ROLE), avatarUpload.single('avatar'), catchErrors(coachRegister))
router.post('/athlete', authRole(GYM_MANAGER_ROLE), avatarUpload.single('avatar'), catchErrors(athleteRegister))

module.exports = router