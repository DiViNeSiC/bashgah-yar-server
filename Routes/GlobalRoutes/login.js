const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const { 
    regularLogin,
    confirmTwoStepCode
} = require('../../Controllers/Login/loginController')

router.post('/', catchErrors(regularLogin))
router.post('/active-code', catchErrors(confirmTwoStepCode))

module.exports = router