const cron = require('node-cron')
const jwt = require('jsonwebtoken')
const Gym = require('../../Models/Gym')
const getTimeDifference = require('../getTimeDifference')
const { handlers: { cronJobs } } = require('../Constants/responseMessages')

module.exports = cron.schedule('0 */2 * * *', async () => {
    const allGyms = await Gym.find()

    allGyms.forEach(async (gym) => {
        const { accessExpireDate, accessToken } = gym
        if (!accessToken || !accessExpireDate) return

        const timeDifferences = getTimeDifference(accessExpireDate)
        if (timeDifferences.mainDifference > 0) return

        try {
            const accessPayload = await jwt.verify(accessToken, process.env.JWT_GYM_ACCESS_SECRET)
            if (accessPayload.gymId.toString() === gym._id.toString()) return

            await gym.updateOne({ accessExpireDate: null, accessToken: null })
            console.log(cronJobs.gymAccessTokenRemoved)
        } catch (err) {
            if (err.message === cronJobs.jwtExpired) {
                await gym.updateOne({ accessExpireDate: null, accessToken: null })
                console.log(cronJobs.gymAccessTokenRemoved)
            }
            console.error(cronJobs.gymAccessTokenRemoveError)
        }
    })
})