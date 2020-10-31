const router = require('express').Router()
const registers = require('../GymAdminRoutes/registers')
const adminGyms = require('../GymAdminRoutes/adminGyms')
const gettingUsers = require('../GymAdminRoutes/gettingUsers')
const emailVerified = require('../../Middlewares/UserOperations/emailVerifiedCheck')

router.use(
    '/registers', 
    emailVerified,
    registers
)

router.use(
    '/gyms',
    adminGyms
)

router.use(
    '/users',
    gettingUsers
)

module.exports = router