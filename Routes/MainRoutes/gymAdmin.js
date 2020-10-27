const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const upload = require('../../Middlewares/Uploads/avatarImage')
const emailVerified = require('../../Middlewares/UserOperations/emailVerifiedCheck')
const registers = require('../GymAdminRoutes/registers')

router.use('/registers', catchErrors(emailVerified), upload.single('avatar'), registers)

module.exports = router