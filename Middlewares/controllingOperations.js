const User = require('../Models/User')
const Gym = require('../Models/Gym')
const deleteManyUsers = require('../Handlers/deleteManyUsers')
const { GYM_ADMIN_ROLE } = require('../Handlers/Constants/roles')

const deleteGymAdminOps = async (req, res, next) => {
    const { userId } = req.params
    const gymAdmin = await User
        .findById(userId)
        .populate('adminGyms')
        .exec()

    if (!gymAdmin) 
        return res.status(404).json({
            message: 'مدیر کلی با این مشخصات پیدا نشد'
        })
    if (gymAdmin.role !== GYM_ADMIN_ROLE) 
        return res.status(403).json({
            message: 'شما فقط میتوانید حساب کاربری مدیر کل باشگاه را پاک کنید'
        })

    gymAdmin.adminGyms.forEach(async (gym) => {
        const staff = [...gym.managers, ...gym.coaches, ...gym.athletes]
        const deleteAllStaffErr = await deleteManyUsers(staff)
        if (deleteAllStaffErr) throw 'خطا در پاک کردن اطلاعات و حساب های کاربری'

        Gym.findByIdAndDelete(gym._id, (err) => {
            if (err) throw 'خطا در پاک کردن اطلاعات و حساب های کاربری'
        })
    })
    next()
}

module.exports = { deleteGymAdminOps }