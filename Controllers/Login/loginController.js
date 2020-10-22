const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const findUser = require('../../Handlers/LoginHandlers/findUser')
const { ATHLETE_ROLE } = require('../../Handlers/Constants/roles')

const regularLogin = async (req, res) => {
    const { credential, password, tokenExpireTime } = req.body

    const user = await findUser(credential)

    if (!user) throw 'کاربری با این مشخصات پیدا نشد'

    const passed = await bcrypt.compare(password, user.password)

    if (!passed) throw 'رمز عبور شما اشتباه است'

    if (user.role !== ATHLETE_ROLE) 
        return res.json({ user })

    const entryToken = await jwt
        .sign(
            user, 
            process.env.JWT_ENTRY_SECRET, 
            { expiresIn: tokenExpireTime }
        )

    res.json({ user, entryToken })
}

const confirmSiteAdminPassword = async (req, res) => {}

const confirmGymPassword = async (req, res) => {}

module.exports = { 
    regularLogin, 
    confirmSiteAdminPassword, 
    confirmGymPassword
}