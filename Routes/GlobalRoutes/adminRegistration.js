const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const { 
    adminRegistration
} = require('../../Controllers/Register/adminRegistrationController')

router.post('/', catchErrors(adminRegistration))

module.exports = router