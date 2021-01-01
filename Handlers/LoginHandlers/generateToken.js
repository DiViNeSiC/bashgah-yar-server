const jwt = require("jsonwebtoken")

module.exports = async (user, expiresIn, generateConfirmationToken = false) => {
    const userInfo = { expiresIn, id: user.id, role: user.role, username: user.username }

    const entryToken = await jwt.sign({ ...userInfo }, process.env.JWT_ENTRY_SECRET, { expiresIn })
    const refreshToken = await jwt.sign({ ...userInfo }, process.env.JWT_REFRESH_SECRET)
    const confirmationToken = generateConfirmationToken ? 
        await jwt.sign({ ...userInfo }, process.env.JWT_CONFIRMATION_SECRET, { expiresIn: '20d' }) : null

    return { entryToken, refreshToken, confirmationToken }
}