const Athlete = require('../../Models/Users/athlete')
const GymCoach = require('../../Models/Users/gymCoach')
const GymAdmin = require('../../Models/Users/gymAdmin')
const GymManager = require('../../Models/Users/gymManager')
const SiteAdmin = require('../../Models/Users/siteAdmin')

module.exports = async (username, email) => {
    let error = null

    const athletes = await Athlete.find()
    cosnst gymCoaches = await GymCoach.find()
    const gymAdmins = await GymAdmin.find()
    const gymManagers = await GymManager.find()
    const siteAdmins = await SiteAdmin.find()

    const allUsers = [
        ...athletes, 
        ...gymCoaches, 
        ...gymAdmins, 
        ...gymManagers, 
        ...siteAdmins
    ]
    
    const usernameExist = allUsers.some(user => 
        user.username === username.toLowerCase()
    )

    if (usernameExist) 
        return error = 'کاربری دیگر با این نام کاربری وجود دارد'

    if (email) {
        const emailExist = allUsers.some(user => 
            user.email === email.toLowerCase()
        )

        if (emailExist) 
            return error = 'کاربری دیگر با این ایمیل وجود دارد'
    }

    return error
}