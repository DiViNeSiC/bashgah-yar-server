const Gym = require('../../Models/Gym')
const User = require('../../Models/User')

const getUserGym = async (req, res) => {
    const user = await User
        .findById(req.payload.id)
        .populate('gym')
        .exec()

    res.json({ gym: user.gym })
}

const getAdminGyms = async (req, res) => {
    const gymAdmin = await User
        .findById(req.payload.id)
        .populate('adminGyms')
        .exec()

    res.json({ gyms: gymAdmin.adminGyms })
}

const getGymById = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    if (!gym) throw 'باشگاهی با این مشخصات وجود ندارد'

    res.json({ gym })
}

const getAllGyms = async (req, res) => {
    const gyms = await Gym.find()
    res.json({ gyms })
}

module.exports = { getUserGym, getAdminGyms, getGymById, getAllGyms }