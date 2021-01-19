const Message = require('../Models/Message')
const { communicationController: { errorMsgs, successMsgs, warnMsgs } } = require('../Handlers/Constants/responseMessages')

exports.getMessagesForReceiver = async (req, res) => {
    const messages = await Message.find({ receiver: req.user.id })
    res.json({ messages })
}

exports.getMessagesForSender = async (req, res) => {
    const messages = await Message.find({ sender: req.user.id })
    res.json({ messages })
}

exports.sendMessage = async (req, res) => {
    const { text } = req.body
    const { userId } = req.params
    const fileName = req.file != null ? req.file.filename : ''
    if (!text && !fileName) throw errorMsgs.noFileOrTextFound

    const selectedUser = await User.findById(userId)
    if (!selectedUser) throw errorMsgs.userNotFound
    
    const loggedUser = await User.findById(req.user.id).populate('adminGyms').exec()

    if (loggedUser.role === GYM_ADMIN_ROLE) {
        const { adminGyms } = loggedUser
        if (!adminGyms.length) throw warnMsgs.youDoNotHaveAnyGyms

        const staffArray = [].concat(...adminGyms.map(gym => [...gym.managers, ...gym.coaches, ...gym.athletes]))
        const allStaff = staffArray.map(staff => staff.toString())

        if (!allStaff.includes(selectedUser.id)) throw errorMsgs.userInfoAccessNotAllowed
    }

    const loggedUserIsGymStaff = loggedUser.role === GYM_MANAGER_ROLE || 
        loggedUser.role === GYM_COACH_ROLE || loggedUser.role === ATHLETE_ROLE

    if (loggedUserIsGymStaff && selectedUser.gym.id !== loggedUser.gym.toString()) 
        throw errorMsgs.userInfoAccessNotAllowed

    const newMessage = new Message({
        text, file: fileName, sender: req.user.id, receiver: userId
    })

    try {
        await newMessage.save()
        res.json({ message: successMsgs.sendMessageSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.sendMessageError })
    }
}

exports.editMessage = async (req, res) => {
    const { newText } = req.body
    const { messageId } = req.params
    const message = await Message.findById(messageId)
    if (!message.file && !newText) throw errorMsgs.emptyMessageText
    if (message.sender.toString() !== req.user.id) throw errorMsgs.editMessageNotAllowed

    try {
        await message.updateOne({ text: newText })
        res.json({ message: successMsgs.editMessageSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.editMessageError })
    }
}

exports.deleteMessage = async (req, res) => {
    const { messageId } = req.params
    const message = await Message.findById(messageId)
    if (message.sender.toString() !== req.user.id) throw errorMsgs.deleteMessageNotAllowed

    try {
        await message.deleteOne()
        res.json({ message: successMsgs.deleteMessageSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.deleteMessageError })
    }
}