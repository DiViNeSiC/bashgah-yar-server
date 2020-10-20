const router = require('express').Router()
const registers = require('../GymAdminRoutes/registers')

router.use('/registers', registers)

module.exports = router