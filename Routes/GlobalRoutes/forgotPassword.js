const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const {
    forgotPassWithEmail, verifyTimeBasedCode, 
    forgotPassWithPhoneNumber, verifyToken
} = require('../../Controllers/Login/forgotPassController')

router.post('/with-email', catchErrors(forgotPassWithEmail))
router.post('/with-phone', catchErrors(forgotPassWithPhoneNumber))

router.put('/verify-timebased-code', catchErrors(verifyTimeBasedCode))
router.put('/verify-token/:forgotPassToken', catchErrors(verifyToken))

module.exports = router