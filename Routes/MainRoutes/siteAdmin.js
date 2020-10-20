const router = require('express').Router()
const registers = require('../SiteAdminRoutes/registers')

router.use('/registers', registers)

module.exports = router