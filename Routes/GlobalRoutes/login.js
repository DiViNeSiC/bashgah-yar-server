const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const { 
    regularLogin
} = require('../../Controllers/Login/loginController')

router.post('/', catchErrors(regularLogin))

module.exports = router