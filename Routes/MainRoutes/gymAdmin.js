const router = require('express').Router()
const upload = require('../../Middlewares/Uploads/avatarImage')
const registers = require('../GymAdminRoutes/registers')
const emailVerified = require('../../Middlewares/UserOperations/emailVerifiedCheck')
const { catchErrors } = require('../../Handlers/errorHandler')

router.use(
    '/registers', 
    catchErrors(emailVerified), 
    upload.single('avatar'), 
    registers
)

module.exports = router