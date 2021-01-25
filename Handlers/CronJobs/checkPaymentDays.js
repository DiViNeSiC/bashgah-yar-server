const cron = require('node-cron')
const Gym = require('../../Models/Gym')
const User = require('../../Models/User')
const Message = require('../../Models/Message')
const getTimeDifference = require('../getTimeDifference')
const updateUserReadMessages = require('../updateUserReadMessages')
const { handlers: { cronJobs } } = require('../Constants/responseMessages')

module.exports = cron.schedule('0 */12 * * *', async () => {
    const allGyms = await Gym.find()

    allGyms.forEach(async (gym) => {
        const { accessExpireDate, accessToken } = gym
        if (!accessExpireDate || !accessToken) {
            const gymAdmin = await User.findById(gym.admin)
            const message = generateTimeExpiredMessage(gym.name)
            const newMessage = new Message({ text: message, receiver: gymAdmin._id, automatedMessage: true })

            try {
                await newMessage.save()
                await updateUserReadMessages(null, gymAdmin)
                console.log(`${cronJobs.gymPaymentWarnSent}: ${gymAdmin.username}`)
            } catch (err) {
                console.error(`${cronJobs.gymPaymentWarnSendingError}: ${gymAdmin.username}. Error: ${err.message}`)
            }
        }
        
        if (accessExpireDate && accessToken) {
            const timeDifferences = getTimeDifference(accessExpireDate)
            if (timeDifferences.mainDifference < 5) {
                const gymAdmin = await User.findById(gym.admin)
                const message = generateTimeRemainMessage(gym.name, timeDifferences)
                const newMessage = new Message({ text: message, receiver: gymAdmin._id, automatedMessage: true })
    
                try {
                    await newMessage.save()
                    await updateUserReadMessages(null, gymAdmin)
                    console.log(`${cronJobs.gymPaymentWarnSent}: ${gymAdmin.username}`)
                } catch (err) {
                    console.error(`${cronJobs.gymPaymentWarnSendingError}: ${gymAdmin.username}. Error: ${err.message}`)
                }
            }
        }
    })
})

function generateTimeRemainMessage(gymName, { differenceInDays, differenceInHours, differenceInMinutes }) {
    const timeDifference = `دقیقه ${differenceInMinutes} ساعت ${differenceInHours} روز ${differenceInDays}`
    const mainMessage = `باقی مانده است "${gymName}" مهلت برای استفاده از ژتون باشگاه ${timeDifference} تنها`
    return `${cronJobs.PayYourAccessTokenWarn}   .${mainMessage}`
}

function generateTimeExpiredMessage(gymName) {
    const mainMessage = `به اتمام رسیده است ${gymName} مهلت استفاده از ژتون باشگاه`
    return `${cronJobs.PayYourAccessTokenWarn}   .${mainMessage}`
}