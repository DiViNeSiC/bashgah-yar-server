const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const emailExist = require('../../Middlewares/UserOperations/emailExistCheck')
const { 
    sendActivationEmail,
    activeEmail
} = require('../../Controllers/Register/activeAccountController')

router.post(
    '/send-activation-email', 
    catchErrors(emailExist), 
    catchErrors(sendActivationEmail)
)

router.put(
    '/active-email/:accountActivationToken', 
    catchErrors(emailExist), 
    catchErrors(activeEmail)
)

module.exports = router