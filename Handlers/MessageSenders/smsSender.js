const twilio = require('twilio')
const generateTemplate = require('../Constants/smsTemplate')

module.exports = async (phoneNumber, twoStepCode) => {
    const client = new twilio(
        process.env.TWILIO_ACCOUNT_SID, 
        process.env.TWILIO_AUTH_TOKEN
    )

    const body = generateTemplate(twoStepCode)
    await client.messages.create({ 
        body,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
    })
}