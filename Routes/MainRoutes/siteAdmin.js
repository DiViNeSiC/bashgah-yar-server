const router = require('express').Router()
const upload = require('../../Middlewares/Uploads/avatarImage')
const registers = require('../SiteAdminRoutes/registers')
const gettingUsers = require('../SiteAdminRoutes/gettingUsers')
const emailVerified = require('../../Middlewares/UserOperations/emailVerifiedCheck')

router.use(
    '/registers', 
    emailVerified, 
    upload.single('avatar'),
    registers
)

router.use(
    '/users',
    gettingUsers
)

module.exports = router