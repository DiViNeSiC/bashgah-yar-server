const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const { 
    getAllSubalterns, getUserByParam 
} = require('../../Controllers/GetControllers/getUserController')
const { ATHLETE_ROLE } = require('../../Handlers/Constants/roles')

router.get('/', catchErrors(getAllSubalterns([ATHLETE_ROLE])))

router.get('/:userId', catchErrors(getUserByParam([ATHLETE_ROLE])))

module.exports = router