const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { messageFileUpload } = require('../Middlewares/uploads')
const { sendMessageCheck } = require('../Middlewares/communications')
const { SITE_ADMIN_ROLE, SITE_MEDIC_ROLE, SITE_SUPPORT_ROLE } = require('../Handlers/Constants/roles')
const { checkParamId, checkIsNotHimSelf, checkAccessForCommunication, gymEntryCheck } = require('../Middlewares/checks')
const { 
    markAsRead, getMessagesForReceiver, getMessagesForSender, sendMessage, 
    unMarkAsRead, editMessage, deleteMessageForAll, deleteMessageForReceiver,
} = require('../Controllers/communicationController')

router.get('/sends', catchErrors(getMessagesForSender))
router.get('/received', catchErrors(getMessagesForReceiver))

router.post('/medic',sendMessageCheck(SITE_MEDIC_ROLE), catchErrors(sendMessage))
router.post('/feedback', sendMessageCheck(SITE_ADMIN_ROLE), catchErrors(sendMessage))
router.post('/support', sendMessageCheck(SITE_SUPPORT_ROLE), catchErrors(sendMessage))
router.post('/:userId', checkParamId, checkIsNotHimSelf, sendMessageCheck, checkAccessForCommunication, gymEntryCheck, messageFileUpload.single('messageFile'), catchErrors(sendMessage))

router.put('/edit/:messageId', checkParamId, gymEntryCheck, catchErrors(editMessage))
router.put('/mark/read/:messageId', checkParamId, catchErrors(markAsRead))
router.put('/mark/unread/:messageId', checkParamId, catchErrors(unMarkAsRead))

router.delete('/global/:messageId', checkParamId, gymEntryCheck, catchErrors(deleteMessageForAll))
router.delete('/for-receiver/:messageId', checkParamId, gymEntryCheck, catchErrors(deleteMessageForReceiver))

module.exports = router