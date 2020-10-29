const router = require('express').Router()
const upload = require('../../Middlewares/Uploads/avatarImage')
const { catchErrors } = require('../../Handlers/errorHandler')
const { adminRegistration } = require('../../Controllers/Register/adminRegistrationController')

router.post('/', upload.single('avatar'), catchErrors(adminRegistration))

module.exports = router