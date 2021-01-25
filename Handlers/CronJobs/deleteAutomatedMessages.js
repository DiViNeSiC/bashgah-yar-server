const cron = require('node-cron')
const User = require('../../Models/User')
const Message = require('../../Models/Message')
const updateUserReadMessages = require('../updateUserReadMessages')
const { handlers: { cronJobs } } = require('../Constants/responseMessages')

module.exports = cron.schedule('0 0 * * 3,6', async () => {
    const allUsers = await User.find()
    const automatedMessages = await Message.find({ automatedMessage: true })
    automatedMessages.forEach(async (msg, index) => {
        try {
            await msg.deleteOne()
            if (index === automatedMessages.length - 1) console.log(cronJobs.automatedMessagesDeleted)
        } catch (err) {
            console.error(cronJobs.automatedMessagesDeleteFailed)
        }
    })

    allUsers.forEach(async (user, index) => {
        try {
            updateUserReadMessages(null, user)
            if (index === allUsers.length - 1) console.log(cronJobs.allUsersMessagesUpdated)
        } catch (err) {
            console.error(cronJobs.allUsersMessagesUpdateFailed)
        }
    })
})