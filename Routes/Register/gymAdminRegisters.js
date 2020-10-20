const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { 
    gymRegister,
    managerRegister
} = require('../../Controllers/Register/gymAdminRegistersController')

router.post('/manager', catchErrors(managerRegister))
router.post('/gym', catchErrors(gymRegister))

module.exports = routers