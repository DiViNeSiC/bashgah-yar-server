const User = require('../../Models/USer')

const getLoggedUser = async (req, res) => {
    const user = await User.findById(req.payload.id)
    res.json({ user })
}

const getUserByParam = async (subalternRoles) => 
    async (req, res) => {
        const { userId } = req.params
        const user = await User.findById(userId)
        if (!subalternRoles.includes(user.role))
            throw 'شما نمیتوانید به اطلاعات کاربر مورد نظر دسترسی داشته باشید'

        res.json({ user })
    }

const getAllSubalterns = async (subalternRoles) => 
    async (req, res) => {
        const allUsers = await User.find()
        const filteredUsers = allUsers
            .filter(user => subalternRoles.includes(user.role))

        res.json({ users: filteredUsers })
    }

module.exports = { getLoggedUser, getUserByParam, getAllSubalterns }