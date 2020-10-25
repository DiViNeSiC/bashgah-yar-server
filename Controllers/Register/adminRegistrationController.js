const bcrypt = require('bcrypt')
const User = require('../../Models/User')
const formCheck = require('../../Handlers/FormChecks/formCheck')
const userExistCheck = require('../../Handlers/FormChecks/userExistCheck')
const { SITE_ADMIN_ROLE } = require('../../Handlers/Constants/roles')

const adminRegistration = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : ''
    const {
        username,
        name,
        lastname,
        email,
        password,
        registrationPassword,
        phoneNumber
    } = req.body

    const passwordPassed = await bcrypt.compare(
        registrationPassword, 
        process.env.ADMIN_REGISTRATION_PASSWORD
    )

    if (!passwordPassed) throw '!رمز ورودی برای ثبت ادمین اشتباه است'

    const formError = formCheck(
        username, name, 
        lastname, email,
        password, phoneNumber, true
    )

    if (formError) throw formError

    const userExist = await userExistCheck(username, email, phoneNumber)

    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)

    const newSiteAdmin = new User({
        username,
        name,
        lastname,
        email,
        phoneNumber,
        avatarName,
        password: hashedPassword,
        role: SITE_ADMIN_ROLE
    })

    try {
        await newSiteAdmin.save()

        res.json({
            message: `ثبت شد ${username} مدیر سایت جدید با نام کاربری`
        })
    } catch {
        res.status(500).json({ 
            errorMessage: `ثبت مدیر سایت جدید موفقیت آمیز نبود`
        })
    }
}

module.exports = { adminRegistration }