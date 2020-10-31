const router = require('express').Router()
const gettingUsers = require('../GymCoachRoutes/gettingUsers')

router.use(
    '/users', 
    gettingUsers
)

module.exports = router