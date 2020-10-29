const router = require('express').Router()
const registers = require('../GymAdminRoutes/registers')
const emailVerified = require('../../Middlewares/UserOperations/emailVerifiedCheck')

router.use(
    '/registers', 
    emailVerified,
    registers
)

module.exports = router