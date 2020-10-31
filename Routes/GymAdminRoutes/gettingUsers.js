const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const { 
    getAllSubalterns, getUserByParam 
} = require('../../Controllers/GetControllers/getUserController')
const { 
    GYM_MANAGER_ROLE, GYM_COACH_ROLE, ATHLETE_ROLE 
} = require('../../Handlers/Constants/roles')

router.get('/', catchErrors(getAllSubalterns(
    [GYM_MANAGER_ROLE, GYM_COACH_ROLE, ATHLETE_ROLE]
)))

router.get('/:userId', catchErrors(getUserByParam(
    [GYM_MANAGER_ROLE, GYM_COACH_ROLE, ATHLETE_ROLE]
)))

module.exports = router