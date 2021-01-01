const nodemailer = require('nodemailer')
const { activeAcc, changePass, deleteAcc, forgotPass } = require('../Constants/emailContents')
const { EMAIL_ACTIVATION, RESET_PASSWORD, FORGOT_PASSWORD, DELETE_ACCOUNT } = require('../Constants/emailMethods')

module.exports = async (userEmail, token, method) => {
    const { SITE_MANAGER_EMAIL: user, SITE_MANAGER_PASSWORD: pass, CLIENT_URL: clientUrl } = process.env
    const transport = { host: "smtp.gmail.com", port: 587, secure: false,  auth: { user, pass } }
    const { html, subject } = generateEmailContent(clientUrl, token, method)

    const transporter = nodemailer.createTransport(transport)
    await transporter.sendMail({ from: `"باشگاه یار" <${user}>`, to: userEmail, subject, html })
}

function generateEmailContent(clientUrl, token, method) {
    switch(method) {
        case EMAIL_ACTIVATION: return {
            html: activeAcc(clientUrl, token),
            subject: "✔ لطفا ایمیل خود را فعال کنید ✔"
        }
        case RESET_PASSWORD: return {
            html: changePass(clientUrl, token),
            subject: "📝 تغییر رمز عبور 📝"
        }
        case FORGOT_PASSWORD: return {
            html: forgotPass(clientUrl, token),
            subject: "📣 آیا رمز عبور خود را فراموش کرده اید؟ 📣"
        }
        case DELETE_ACCOUNT: return {
            html: deleteAcc(clientUrl, token),
            subject: "×× پاک کردن حساب کاربری ××"
        }
    }
}