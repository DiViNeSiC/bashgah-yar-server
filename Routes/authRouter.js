const router = require('express').Router()
const { auth, notAuth } = require('../Middlewares/authenticates')
const { emailExistCheck } = require('../Middlewares/checks')
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
router.post('/active-email', auth, emailExistCheck, catchErrors(sendActivationEmail))
router.post('/forgot-pass/email', notAuth, catchErrors(forgotPassWithEmail))
router.post('/forgot-pass/phone', notAuth, catchErrors(forgotPassWithPhoneNumber))

router.put('/refresh/:refreshToken', auth, catchErrors(verifyRefreshToken))
router.put('/forgot-pass/:forgotPassToken', notAuth, catchErrors(verifyToken))
router.put('/forgot-pass/time-code', notAuth, catchErrors(verifyTimeBasedCode))
router.put('/active-email/:accountActivationToken', auth, catchErrors(activeEmail))

router.delete('/logout', auth, catchErrors(logout))

module.exports = router