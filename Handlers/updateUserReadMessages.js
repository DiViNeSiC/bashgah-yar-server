const User = require('../Models/User')
const Message = require('../Models/Message')

module.exports = async (userId, user = null) => {
    let selectedUser = user ? user : null
    if (userId && !user) selectedUser = await User.findById(userId)
    const unReadMessages = await Message.find({ receiver: selectedUser.id, readCheck: false })
    await selectedUser.updateOne({ notReadMessages: unReadMessages.length })
}