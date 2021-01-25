const Message = require('../Models/Message')
const updateUserReadMessages = require('../Handlers/updateUserReadMessages')
const { communicationController: { errorMsgs, successMsgs } } = require('../Handlers/Constants/responseMessages')

exports.getMessagesForReceiver = async (req, res) => {
    const messages = await Message.find({ receiver: req.user.id })
    res.json({ messages })
}

exports.getMessagesForSender = async (req, res) => {
    const messages = await Message.find({ sender: req.user.id })
    res.json({ messages })
}

exports.sendMessage = async (req, res) => {
    const { receivers } = req
    const { text } = req.body
    const fileName = req.file != null ? req.file.filename : ''
    if (!text && !fileName) throw errorMsgs.noFileOrTextFound

    receivers.forEach(async (receiver, index) => {
        const newMessage = new Message({
            text, file: fileName, sender: req.user.id, receiver: receiver.id
        })
        
        try {
            await newMessage.save()
            await updateUserReadMessages(null, receiver)
            if (index === receivers.length - 1) res.json({ message: successMsgs.sendMessageSuccess })
        } catch (err) {
            res.status(500).json({ message: errorMsgs.sendMessageError })
        }
    })
}

exports.markAsRead = async (req, res) => {
    const { messageId } = req.params
    const message = await Message.findById(messageId)

    if (!message) throw errorMsgs.messageNotFound
    if (message.readCheck) throw errorMsgs.messageAlreadyMarkedAsRead
    if (message.receiver.toString() !== req.user.id) throw errorMsgs.markMessageNotAllowed

    try {
        await message.updateOne({ readCheck: true })
        await updateUserReadMessages(message.receiver)
        res.json({ message: successMsgs.messageMarkedAsRead })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.markAsReadError })
    }
}

exports.unMarkAsRead = async (req, res) => {
    const { messageId } = req.params
    const message = await Message.findById(messageId)
    
    if (!message) throw errorMsgs.messageNotFound
    if (!message.readCheck) throw errorMsgs.messageAlreadyUnMarkedAsRead
    if (message.receiver.toString() !== req.user.id) throw errorMsgs.unMarkMessageNotAllowed

    try {
        await message.updateOne({ readCheck: false })
        await updateUserReadMessages(message.receiver)
        res.json({ message: successMsgs.messageUnMarkedAsRead })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.unMarkAsReadError })
    }
}

exports.editMessage = async (req, res) => {
    const { newText } = req.body
    const { messageId } = req.params
    const message = await Message.findById(messageId)

    if (!message) throw errorMsgs.messageNotFound
    if (!message.file && !newText) throw errorMsgs.emptyMessageText
    if (message.sender.toString() !== req.user.id) throw errorMsgs.editMessageNotAllowed

    try {
        await message.updateOne({ text: newText })
        res.json({ message: successMsgs.editMessageSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.editMessageError })
    }
}

exports.deleteMessageForAll = async (req, res) => {
    const { messageId } = req.params
    const message = await Message.findById(messageId)

    if (!message) throw errorMsgs.messageNotFound
    if (message.sender.toString() !== req.user.id) throw errorMsgs.deleteMessageNotAllowed

    try {
        await message.deleteOne()
        await updateUserReadMessages(message.receiver)
        res.json({ message: successMsgs.deleteMessageSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.deleteMessageError })
    }
}

exports.deleteMessageForReceiver = async (req, res) => {
    const { messageId } = req.params
    const message = await Message.findById(messageId)

    if (!message) throw errorMsgs.messageNotFound
    if (message.receiver.toString() !== req.user.id) throw errorMsgs.deleteMessageNotAllowed

    try {
        await message.updateOne({ receiver: null })
        await updateUserReadMessages(message.receiver)
        res.json({ message: successMsgs.deleteMessageSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.deleteMessageError })
    }
}