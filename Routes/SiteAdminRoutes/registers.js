const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const { gymAdminRegister } = require('../../Controllers/Register/siteAdminRegistersController')

router.post('/gym-admin', catchErrors(gymAdminRegister))

module.exports = router