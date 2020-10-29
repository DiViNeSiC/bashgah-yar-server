const nodemailer = require('nodemailer')
const { 
    EMAIL_ACTIVATION, RESET_PASSWORD, 
    FORGOT_PASSWORD, DELETE_ACCOUNT 
} = require('../Constants/emailMethods')
const { 
    activeEmailHtml, resetAccountPassword, 
    forgotAccountPassword, deleteAccountHtml 
} = require('../Constants/emailContents')

module.exports = async (userEmail, token, method) => {
    const { 
        SITE_MANAGER_EMAIL: user, 
        SITE_MANAGER_PASSWORD: pass, 
        CLIENT_URL: clientUrl 
    } = process.env

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, secure: false, 
        auth: { user, pass }
    })

    const { html, subject } = generateEmailContent(clientUrl, token, method)  
    await transporter.sendMail({
        from: `"باشگاه یار" <${user}>`, 
        to: userEmail, 
        subject, 
        html
    })
}

function generateEmailContent(clientUrl, token, method) {
    switch(method) {
        case EMAIL_ACTIVATION: return {
            html: activeEmailHtml(clientUrl, token),
            subject: "✔ لطفا ایمیل خود را فعال کنید ✔"
        }
        case RESET_PASSWORD: return {
            html: resetAccountPassword(clientUrl, token),
            subject: "📝 تغییر رمز عبور 📝"
        }
        case FORGOT_PASSWORD: return {
            html: forgotAccountPassword(clientUrl, token),
            subject: "📣 آیا رمز عبور خود را فراموش کرده اید؟ 📣"
        }
        case DELETE_ACCOUNT: return {
            html: deleteAccountHtml(clientUrl, token),
            subject: "×× پاک کردن حساب کاربری ××"
        }
    }
}