const router = require('express').Router()
const registers = require('../GymManagerRoutes/registers')

router.use('/registers', registers)

module.exports = router