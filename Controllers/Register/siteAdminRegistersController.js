const bcrypt = require('bcrypt')
const User = require('../../Models/User')
const formCheck = require('../../Handlers/FormChecks/formCheck')
const userExistCheck = require('../../Handlers/FormChecks/userExistCheck')
const { GYM_ADMIN_ROLE } = require('../../Handlers/Constants/roles')

const gymAdminRegister = async (req, res) => {
    const avatarName = req.file != null ? req.file.filename : ''
    const {
        username,
        name,
        lastname,
        email,
        password,
        phoneNumber
    } = req.body

    const formError = formCheck(
        username, name, 
        lastname, email, 
        password, phoneNumber, true
    )

    if (formError) throw formError

    const userExist = await userExistCheck(username, email, phoneNumber)

    if (userExist) throw userExist

    const hashedPassword = await bcrypt.hash(password, 10)

    const newGymAdmin = new User({
        username,
        name,
        lastname,
        email,
        phoneNumber,
        avatarName,
        password: hashedPassword,
        role: GYM_ADMIN_ROLE
    })

    try {
        await newGymAdmin.save()

        res.json({
            message: `ثبت شد ${username} مدیر کل جدید با نام کاربری`
        })
    } catch {
        res.status(500).json({ 
            errorMessage: `ثبت مدیر کل جدید موفقیت آمیز نبود`
        })
    }
}

module.exports = { gymAdminRegister }