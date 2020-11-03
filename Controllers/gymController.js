const path = require('path')
const Gym = require('../Models/Gym')
const gymFormCheck = require('../Handlers/FormChecks/gymFormCheck')
const deleteGymPicFiles = require('../Handlers/FileHandlers/deleteGymPicFiles')
const deleteAllGymUsers = require('../Handlers/GymHandlers/deleteAllGymUsers')
const { SITE_ADMIN_ROLE } = require('../Handlers/Constants/roles')

const getUserGym = async (req, res) => {
    const gym = await Gym
        .findById(req.user.gym)
        .populate('admin')
        .populate('managers')
        .populate('coaches')
        .populate('athletes')
        .exec()
    res.json({ gym })
}

const getAdminGymsById = async (req, res) => {
    const { id, role } = req.user
    const { adminId } = req.params
    const admin = role === SITE_ADMIN_ROLE ? adminId : id
    const gyms = await Gym
        .find({ admin })
        .populate('admin')
        .populate('managers')
        .populate('coaches')
        .populate('athletes')
        .exec()
    res.json({ gyms })
}

const getGymById = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym
        .findById(gymId)
        .populate('admin')
        .populate('managers')
        .populate('coaches')
        .populate('athletes')
        .exec()

    if (!gym) throw 'باشگاهی با این مشخصات وجود ندارد'
    res.json({ gym })
}

const editInfo = async (req, res) => {
    const { gymId } = req.params
    const { 
        name, city, capacity, 
        address, phoneNumber 
    } = req.body

    const gym = await Gym.findById(gymId)    
    const formError = await gymFormCheck(
        name, city, address, phoneNumber, capacity, gym
    )
    if (formError) throw formError

    try {
        await gym.updateOne({ name, city, capacity, address, phoneNumber })
        res.json({ message: 'مشخصات باشگاه شما بروز گردید' })
    } catch {
        res.status(500).json({ message: 'خطا در بروزرسانی مشخصات باشگاه شما' })
    }
}

const addPicture = async (req, res) => {
    const { gymId } = req.params
    const newGymPic = req.file != null ? req.file.filename : ''
    if (!newGymPic) throw 'عکسی دریافت نشد'

    const gym = await Gym.findById(gymId)
    const { gymImageNames } = gym
    const newImages = [...gymImageNames, newGymPic]
    if (newImages.length > 12) 
        throw 'شما نمیتوانید بیشتر از دوازده تا عکس برای هر باشگاه بگذارید'

    const newImagePaths = newImages
        .map(image => path.join('/', Gym.gymImageBasePath, image))

    try {
        await gym.updateOne({ 
            gymImageNames: newImages, 
            gymImagePaths: newImagePaths 
        })
        res.json({ message: 'عکس های باشگاه بروزرسانی گردید' })
    } catch {
        res.status(500).json({ message: 'خطا در بروزرسانی تصاویر باشگاه شما' })
    }
}

const deleteOnePicture = async (req, res) => {
    const { gymId, filename } = req.params
    const deletePicErr = deleteGymPicFiles([...filename])
    if (deletePicErr) throw deletePicErr
    
    const gym = await Gym.findById(gymId)
    const { gymImageNames } = gym
    
    const newImages = gymImageNames.filter(image => image !== filename)
    const newImagePaths = newImages
        .map(image => path.join('/', Gym.gymImageBasePath, image))

    try {
        await gym.updateOne({ 
            gymImageNames: newImages, 
            gymImagePaths: newImagePaths 
        })
        res.json({ message: 'عکس های باشگاه بروزرسانی گردید' })
    } catch {
        res.status(500).json({ message: 'خطا در بروزرسانی تصاویر باشگاه شما' })
    }
}

const deleteAllPictures = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    const deletePicErr = deleteGymPicFiles(gym.gymImageNames)
    if (deletePicErr) throw deletePicErr

    try {
        await gym.updateOne({ gymImageNames: [], gymImagePaths: [] })
        res.json({ message: 'عکس های باشگاه بروزرسانی گردید' })
    } catch {
        res.status(500).json({ message: 'خطا در بروزرسانی تصاویر باشگاه شما' })
    }
}

const deleteGymAccount = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    const { managers, coaches, athletes, gymImageNames } = gym
    
    const deletePicErr = deleteGymPicFiles(gymImageNames)
    if (deletePicErr) throw deletePicErr
    
    const deleteAllUsersErr = await deleteAllGymUsers(
        [...managers, ...coaches, ...athletes]
    )
    if (deleteAllUsersErr) throw deleteAllUsersErr

    try {
        await gym.deleteOne()
        res.json({ message: 'باشگاه با موفقیت پاک شد' })
    } catch {
        res.status(500).json({ message: 'خطا در پاک کردن باشگاه شما' })
    }
}

module.exports = { 
    getUserGym, 
    getAdminGymsById, 
    getGymById, 
    editInfo, 
    addPicture,
    deleteOnePicture,
    deleteAllPictures,
    deleteGymAccount 
}