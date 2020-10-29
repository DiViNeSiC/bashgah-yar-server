const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const { 
    coachRegister, athleteRegister
} = require('../../Controllers/Register/managerRegistersController')

router.post('/coach', catchErrors(coachRegister))
router.post('/athlete', catchErrors(athleteRegister))

module.exports = router