const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const emailVerified = require('../../Middlewares/UserOperations/emailVerifiedCheck')
const registers = require('../SiteAdminRoutes/registers')

router.use('/registers', catchErrors(emailVerified), registers)

module.exports = router