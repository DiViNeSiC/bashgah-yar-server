const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { messageFileUpload } = require('../Middlewares/uploads')
const { checkParamId, checkIsNotHimSelf } = require('../Middlewares/checks')
const { getMessagesForReceiver, getMessagesForSender, sendMessage, editMessage, deleteMessage } = require('../Controllers/communicationController')

router.get('/received', catchErrors(getMessagesForReceiver))
router.get('/sends', catchErrors(getMessagesForSender))

router.post('/:userId', checkParamId, checkIsNotHimSelf, messageFileUpload.single('avatar'), catchErrors(sendMessage))

router.put('/:messageId', checkParamId, catchErrors(editMessage))

router.delete('/:messageId', checkParamId, catchErrors(deleteMessage))

module.exports = router