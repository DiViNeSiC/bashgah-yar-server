const path = require('path')
const Gym = require('../Models/Gym')
const gymFormCheck = require('../Handlers/FormChecks/gymFormCheck')
const deleteGymPicFiles = require('../Handlers/FileHandlers/deleteGymPicFiles')
const deleteManyUsers = require('../Handlers/deleteManyUsers')
const { GYM_ADMIN_ROLE } = require('../Handlers/Constants/roles')

exports.getGlobalGyms = async (req, res) => {
    const gyms = await Gym.find()
    res.json({ gyms })
}

exports.getAdminGyms = async (req, res) => {
    const { adminId } = req.params
    if (req.user.role === GYM_ADMIN_ROLE && req.user.id !== adminId)
        throw 'شما نمی توانید به این بخش دسترسی داشته باشید'
    const gyms = await Gym.find({ admin: adminId }).populate('admin').exec()
    if (!gyms || !gyms.length) throw 'باشگاهی یافت نشد'
    res.json({ gyms, adminUsername: gyms[0].admin.username })
}

exports.getGymStaff = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
        .populate('admin').populate('managers')
        .populate('coaches').populate('athletes').exec()
    if (!gym) throw 'باشگاهی با این مشخصات وجود ندارد'

    res.json({ 
        gymName: gym.name, staff: {
            admin: gym.admin, managers: gym.managers,
            coaches: gym.coaches, athletes: gym.athletes,
        } 
    })
}

exports.getGymById = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId).populate('admin').exec()
    if (!gym) throw 'باشگاهی با این مشخصات وجود ندارد'
    res.json({ gym })
}

exports.getGymByIdForEdit = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    if (!gym) throw 'باشگاهی با این مشخصات وجود ندارد'
    res.json({ gym })
}

exports.editInfo = async (req, res) => {
    const { gymId } = req.params
    const { name, city, capacity, address, phoneNumber } = req.body

    const gym = await Gym.findById(gymId)    
    const formError = await gymFormCheck(name, city, address, phoneNumber, capacity, gym)
    if (formError) throw formError

    try {
        await gym.updateOne({ name, city, capacity, address, phoneNumber })
        res.json({ message: 'مشخصات باشگاه شما بروز گردید' })
    } catch {
        res.status(500).json({ message: 'خطا در بروزرسانی مشخصات باشگاه شما' })
    }
}

exports.addPicture = async (req, res) => {
    const { gymId } = req.params
    const newGymPic = req.file != null ? req.file.filename : ''
    if (!newGymPic) throw 'عکسی دریافت نشد'

    const gym = await Gym.findById(gymId)
    const { gymImageNames } = gym
    const newImages = [...gymImageNames, newGymPic]
    if (newImages.length > 12) 
        throw 'شما نمیتوانید بیشتر از دوازده تا عکس برای هر باشگاه بگذارید'

    const newImagePaths = newImages.map(image => path.join('/', Gym.gymImageBasePath, image))

    try {
        await gym.updateOne({ gymImageNames: newImages, gymImagePaths: newImagePaths })
        res.json({ message: 'عکس های باشگاه بروزرسانی گردید' })
    } catch {
        res.status(500).json({ message: 'خطا در بروزرسانی تصاویر باشگاه شما' })
    }
}

exports.deleteOnePicture = async (req, res) => {
    const { gymId, filename } = req.params

    const deletePicErr = deleteGymPicFiles([...filename])
    if (deletePicErr) throw deletePicErr

    const gym = await Gym.findById(gymId)
    const { gymImageNames } = gym
    
    const newImages = gymImageNames.filter(image => image !== filename)
    const newImagePaths = newImages.map(image => path.join('/', Gym.gymImageBasePath, image))

    try {
        await gym.updateOne({ gymImageNames: newImages, gymImagePaths: newImagePaths })
        res.json({ message: 'عکس های باشگاه بروزرسانی گردید' })
    } catch {
        res.status(500).json({ message: 'خطا در بروزرسانی تصاویر باشگاه شما' })
    }
}

exports.deleteAllPictures = async (req, res) => {
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

exports.deleteGymAccount = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    const { managers, coaches, athletes, gymImageNames } = gym
    
    const deletePicErr = deleteGymPicFiles(gymImageNames)
    if (deletePicErr) throw deletePicErr
    
    const deleteAllUsersErr = await deleteManyUsers([...managers, ...coaches, ...athletes])
    if (deleteAllUsersErr) throw deleteAllUsersErr

    try {
        await gym.deleteOne()
        res.json({ message: 'باشگاه با موفقیت پاک شد' })
    } catch {
        res.status(500).json({ message: 'خطا در پاک کردن باشگاه شما' })
    }
}