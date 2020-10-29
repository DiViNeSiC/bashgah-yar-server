const router = require('express').Router()
const upload = require('../../Middlewares/Uploads/avatarImage')
const emailExist = require('../../Middlewares/UserOperations/emailExistCheck')
const emailVerified = require('../../Middlewares/UserOperations/emailVerifiedCheck')
const { catchErrors } = require('../../Handlers/errorHandler')
const {
    getAccountInfo, updateAccountCredentials,
    updateEmail, updatePassword, updateAvatar,
    deleteAvatar, deleteAccount
} = require('../../Controllers/EditAccount/editAccController')
const {  
    deleteAccountConfirm, resetPasswordConfirm
} = require('../../Controllers/EditAccount/twoStepEditController')

router.get('/', catchErrors(getAccountInfo))

router.post('/delete-account', emailExist, emailVerified, catchErrors(deleteAccount))
router.post('/change-password', emailExist, emailVerified, catchErrors(updatePassword))

router.put('/email', catchErrors(updateEmail))
router.put('/credentials', catchErrors(updateAccountCredentials))
router.put('/avatar', upload.single('avatar'), catchErrors(updateAvatar))
router.put('/confirm/password/:resetPassToken', catchErrors(resetPasswordConfirm))

router.delete('/avatar', catchErrors(deleteAvatar))
router.delete('/delete-account/confirm/:deleteAccountToken', catchErrors(deleteAccountConfirm))

module.exports = router