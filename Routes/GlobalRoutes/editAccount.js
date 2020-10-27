const router = require('express').Router()
const emailExist = require('../../Middlewares/UserOperations/emailExistCheck')
const emailVerified = require('../../Middlewares/UserOperations/emailVerifiedCheck')
const { catchErrors } = require('../../Handlers/errorHandler')
const {
    getAccountInfo,
    updateAccountCredentials,
    updateEmail,
    updatePassword,
    updateAvatar,
    deleteAvatar,
    deleteAccount
} = require('../../Controllers/EditAccount/editAccController')
const {  
    deleteAccountConfirm,
    resetPasswordConfirm
} = require('../../Controllers/EditAccount/twoStepEditController')

router.get('/', catchErrors(getAccountInfo))

router.post(
    '/delete-account',
    catchErrors(emailExist),
    catchErrors(emailVerified),
    catchErrors(deleteAccount)
)
router.post(
    '/change-password', 
    catchErrors(emailExist),
    catchErrors(emailVerified),
    catchErrors(updatePassword)
)

router.put('/email', catchErrors(updateEmail))
router.put('/avatar', catchErrors(updateAvatar))
router.put(
    '/credentials', 
    catchErrors(updateAccountCredentials)
)
router.put(
    '/confirm/password/:resetPassToken', 
    catchErrors(resetPasswordConfirm)
)

router.delete('/avatar', catchErrors(deleteAvatar))
router.delete(
    '/confirm/delete-account/:deleteAccountToken', 
    catchErrors(deleteAccountConfirm)
)

module.exports = router