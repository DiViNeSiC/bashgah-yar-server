const { handlers: { userForm } } = require('../Constants/responseMessages')

module.exports = (username, name, lastname, email, password, phoneNumber, emailChecking = false) => {
    let error = null
    const numberRegExp = /^[0-9]+$/
    const usernameRegExp = /^[-_.A-Za-z0-9]+$/

    if (!name) return error = userForm.nameNeeded
    if (!username) return error = userForm.usernameNeeded
    if (!lastname) return error = userForm.lastnameNeeded
    if (!password) return error = userForm.passwordNeeded
    if (!phoneNumber) return error = userForm.phoneNumberNeeded

    if (username.length < 6) return error = userForm.usernameLengthError
    if (password.length < 8) return error = userForm.passwordLengthError
    if (phoneNumber.length < 9 || phoneNumber.length > 9) return error = userForm.phoneNumberLengthError

    if (!usernameRegExp.test(username)) return error = userForm.usernameRegExpError
    if (!numberRegExp.test(phoneNumber)) return error = userForm.phoneNumberRegExpError

    if (emailChecking) {
        if (!email) return error = userForm.emailNeeded
        if (email.length < 5) return error = userForm.emailLengthError
    }

    return error
}