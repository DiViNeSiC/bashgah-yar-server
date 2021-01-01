const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { avatarUpload } = require('../Middlewares/uploadImage')
const { siteAdminRegistration } = require('../Controllers/registrationController')

router.post('/admin', avatarUpload.single('avatar'), catchErrors(siteAdminRegistration))

module.exports = router