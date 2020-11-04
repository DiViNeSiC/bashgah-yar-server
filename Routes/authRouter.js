const router = require('express').Router()
const { auth, notAuth } = require('../Middlewares/authenticates')
const { emailExistCheck, emailNotVerifiedCheck } = require('../Middlewares/checks')
const { catchErrors } = require('../Handlers/errorHandler')
const {
    regularLogin, 
    sendTwoStepCode,
    confirmTwoStepCode,
    sendActivationEmail,
    activeEmail,
    verifyRefreshToken, 
    forgotPassWithEmail, 
    forgotPassWithPhoneNumber,
    verifyTimeBasedCode, 
    verifyToken,
    logout
} = require('../Controllers/authController')

router.post('/login', notAuth, catchErrors(regularLogin))
router.post('/send-code', notAuth, catchErrors(sendTwoStepCode))
router.post('/confirm-code', notAuth, catchErrors(confirmTwoStepCode))
router.post('/active-email', auth, emailExistCheck, emailNotVerifiedCheck, catchErrors(sendActivationEmail))
router.post('/forgot-pass/email', notAuth, catchErrors(forgotPassWithEmail))
router.post('/forgot-pass/phone', notAuth, catchErrors(forgotPassWithPhoneNumber))

router.put('/refresh/:refreshToken', catchErrors(verifyRefreshToken))
router.put('/forgot-pass/time-code', notAuth, catchErrors(verifyTimeBasedCode))
router.put('/forgot-pass/token/:forgotPassToken', notAuth, catchErrors(verifyToken))
router.put('/active-email/:accountActivationToken', auth, emailNotVerifiedCheck, catchErrors(activeEmail))

router.delete('/logout', auth, catchErrors(logout))

module.exports = router