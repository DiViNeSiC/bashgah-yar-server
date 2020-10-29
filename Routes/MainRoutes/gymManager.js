const router = require('express').Router()
const upload = require('../../Middlewares/Uploads/avatarImage')
const registers = require('../GymManagerRoutes/registers')
const emailVerified = require('../../Middlewares/UserOperations/emailVerifiedCheck')

router.use(
    '/registers', 
    emailVerified, 
    upload.single('avatar'), 
    registers
)

module.exports = router