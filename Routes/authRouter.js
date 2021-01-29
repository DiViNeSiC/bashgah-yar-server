const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { auth, notAuth } = require('../Middlewares/authenticates')
const { emailExistCheck, accountNotVerifiedCheck } = require('../Middlewares/checks')
const {
    sendTwoStepCode, confirmTwoStepCodeAndLogin, verifyRefreshToken,
    logout, forgotPassWithEmail, resetPassWithToken, activeAccount, regularLogin, 
    sendAccountActivationEmail, resetPassWithTimeBasedCode, forgotPassWithPhoneNumber,
} = require('../Controllers/authController')

router.post('/login', notAuth, catchErrors(regularLogin))
router.post('/send-code', notAuth, catchErrors(sendTwoStepCode))
router.post('/confirm-code', notAuth, catchErrors(confirmTwoStepCodeAndLogin))
router.post('/forgot-pass/email', notAuth, catchErrors(forgotPassWithEmail))
router.post('/forgot-pass/phone', notAuth, catchErrors(forgotPassWithPhoneNumber))
router.post('/active-account/email', auth, emailExistCheck, accountNotVerifiedCheck, catchErrors(sendAccountActivationEmail))

router.put('/refresh/:refreshToken', catchErrors(verifyRefreshToken))
router.put('/forgot-pass/time-code', notAuth, catchErrors(resetPassWithTimeBasedCode))
router.put('/forgot-pass/token/:forgotPassToken', notAuth, catchErrors(resetPassWithToken))
router.put('/active-account/:accountActivationToken', auth, accountNotVerifiedCheck, catchErrors(activeAccount))

router.delete('/logout', auth, catchErrors(logout))

module.exports = router