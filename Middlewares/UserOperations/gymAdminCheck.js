const Gym = require('../../Models/Gym')

module.exports = async (req, res, next) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    if (!gym) 
        return res.status(404).json({ 
            message: 'باشگاهی با این مشخصات وجود ندارد'
        }) 
    if (gym.admin !== req.payload.id) 
        return res.status(403).json({ 
            message: 'شما به این باشگاه دسترسی ندارید' 
        })
    next()
}