const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { authRole } = require('../Middlewares/authenticates')
const { avatarUpload, gymPicUpload } = require('../Middlewares/uploadImage')
const { GYM_MANAGER_ROLE, GYM_ADMIN_ROLE, SITE_ADMIN_ROLE } = require('../Handlers/Constants/roles')
const { gymRegister, coachRegister, managerRegister, athleteRegister, gymAdminRegister } = require('../Controllers/registrationController')

router.post('/', authRole(GYM_ADMIN_ROLE), gymPicUpload.array('gymPics[]'), catchErrors(gymRegister))
router.post('/admin', authRole(SITE_ADMIN_ROLE), avatarUpload.single('avatar'), catchErrors(gymAdminRegister))
router.post('/manager', authRole(GYM_ADMIN_ROLE), avatarUpload.single('avatar'), catchErrors(managerRegister))
router.post('/coach', authRole(GYM_MANAGER_ROLE), avatarUpload.single('avatar'), catchErrors(coachRegister))
router.post('/athlete', authRole(GYM_MANAGER_ROLE), avatarUpload.single('avatar'), catchErrors(athleteRegister))

module.exports = router