const { forgotPasswordCode, loginConfirmCode } = require('../Constants/smsTemplates')
const { smsMethods: { FORGOT_PASSWORD, LOGIN_CONFIRM } } = require('../Constants/sendersMethods')

module.exports = async (phoneNumber, code, method) => {
    return
    const smsContent = generateTemplate(code, method)
}

function generateEmailContent(code, method) {
    switch(method) {
        case LOGIN_CONFIRM: return loginConfirmCode(code)
        case FORGOT_PASSWORD: return forgotPasswordCode(code)
        default: return null
    }
}