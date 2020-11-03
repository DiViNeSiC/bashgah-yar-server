const router = require('express').Router()
const { avatarUpload } = require('../Middlewares/uploadImage')
const { catchErrors } = require('../Handlers/errorHandler')
const {
    siteAdminRegistration
} = require('../Controllers/registrationController')

router.post('/admin', avatarUpload.single('avatar'), catchErrors(siteAdminRegistration))

module.exports = router