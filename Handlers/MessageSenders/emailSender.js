const nodemailer = require('nodemailer')
const { 
    EMAIL_ACTIVATION,
    RESET_PASSWORD, 
    FORGOT_PASSWORD, 
    DELETE_ACCOUNT 
} = require('../Constants/emailMethods')
const { 
    activeEmailHtml, 
    resetAccountPassword, 
    forgotAccountPassword,
    deleteAccountHtml 
} = require('../Constants/emailContents')

module.exports = async (userEmail, token, method) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.AUTH_MANAGER_EMAIL.toString(), 
            pass: process.env.AUTH_MANAGER_PASSWORD.toString(),
        }
    })

    const { html, subject } = generateEmailContent(process.env.CLIENT_URL, token, method)    
    await transporter.sendMail({
        from: `"باشگاه یار" <${process.env.AUTH_MANAGER_EMAIL}>`, 
        to: userEmail, 
        subject, 
        html
    })
}

function generateEmailContent(clientUrl, token, method) {
    let html
    let subject
    switch(method) {
        case EMAIL_ACTIVATION: {
            html = activeEmailHtml(clientUrl, token)
            subject = "✔ (لطفا ایمیل خود را فعال کنید (باشگاه یار ✔"
            break
        }
        case RESET_PASSWORD: {
            html = resetAccountPassword(clientUrl, token)
            subject = "📝 (تغییر رمز عبور (باشگاه یار 📝"
            break
        }
        case FORGOT_PASSWORD: {
            html = forgotAccountPassword(clientUrl, token)
            subject = "📣 (آیا رمز عبور خود را فراموش کرده اید؟ (باشگاه یار 📣"
            break
        }
        case DELETE_ACCOUNT: {
            html = deleteAccountHtml(clientUrl, token)
            subject = "×× (پاک کردن حساب کاربری (باشگاه یار ××"
            break
        }
    }
    
    return { html, subject }
}