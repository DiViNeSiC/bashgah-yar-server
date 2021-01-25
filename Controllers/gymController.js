const path = require('path')
const jwt = require('jsonwebtoken')
const Gym = require('../Models/Gym')
const User = require('../Models/User')
const deleteManyUsers = require('../Handlers/deleteManyUsers')
const { GYM_ADMIN_ROLE } = require('../Handlers/Constants/roles')
const getTimeDifference = require('../Handlers/getTimeDifference')
const gymFormCheck = require('../Handlers/FormChecks/gymFormCheck')
const deleteGymPicFiles = require('../Handlers/FileHandlers/deleteGymPicFiles')
const { gymController: { successMsgs, errorMsgs } } = require('../Handlers/Constants/responseMessages')

exports.banGym = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    if (!gym) throw errorMsgs.gymNotFound
    if (gym.isBanned) throw errorMsgs.gymAlreadyBanned

    try {
        await gym.updateOne({ isBanned: true })
        res.json({ message: successMsgs.banGymSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.banGymError })
    }
}

exports.unBanGym = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    if (!gym) throw errorMsgs.gymNotFound
    if (!gym.isBanned) throw errorMsgs.gymAlreadyUnBanned

    try {
        await gym.updateOne({ isBanned: false })
        res.json({ message: successMsgs.unBanGymSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.unBanGymError })
    }
}

exports.getGlobalGyms = async (req, res) => {
    const allGyms = await Gym.find()
    const filteredGyms = allGyms.filter(gym => {
        const { accessExpireDate } = gym
        const { mainDifference } = getTimeDifference(accessExpireDate)

        if (mainDifference < 0) return
        return gym
    })

    res.json({ gyms: filteredGyms })
}

exports.getAdminGyms = async (req, res) => {
    const { adminId } = req.params
    if (req.user.role === GYM_ADMIN_ROLE && req.user.id !== adminId) throw errorMsgs.accessNotAllowed

    const admin = await User.findById(adminId)
    const gyms = await Gym.find({ admin: adminId })
    if (!gyms || !gyms.length) throw errorMsgs.gymNotFound
    res.json({ admin, gyms })
}

exports.getGymStaff = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
        .populate('admin').populate('managers')
        .populate('coaches').populate('athletes').exec()
    if (!gym) throw errorMsgs.gymNotFound

    res.json({ 
        gymName: gym.name, staff: {
            admin: gym.admin, managers: gym.managers,
            coaches: gym.coaches, athletes: gym.athletes,
        }
    })
}

exports.getGymById = async (req, res) => {
    const { gymId } = req.params
    const loggedUser = await User.findById(req.user.id)
    const gym = await Gym.findById(gymId).populate('admin').exec()

    if (!gym) throw errorMsgs.gymNotFound
    if (gym.id.toString() === loggedUser.gym.toString()) return res.json({ gym })
    const { mainDifference } = getTimeDifference(gym.accessExpireDate)
    if (mainDifference < 0) throw errorMsgs.gymIsNotAccessible
    
    res.json({ gym })
}

exports.getGymByIdForEdit = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    if (!gym) throw errorMsgs.gymNotFound
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
        res.json({ message: successMsgs.gymInfoUpdated })
    } catch {
        res.status(500).json({ message: errorMsgs.gymUpdateError })
    }
}

exports.changeHolidays = async (req, res) => {
    const { gymId } = req.params
    const { newHolidays } = req.body
    if (newHolidays.length > 7) throw errorMsgs.holidaysLengthReached

    try {
        await Gym.findByIdAndUpdate(gymId, { holidays: newHolidays })
        res.json({ message: successMsgs.gymHolidaysUpdateSuccess })
    } catch {
        res.status(500).json({ message: errorMsgs.gymHolidaysUpdateError })
    }
}

//FIXME: WE NEED TO FIX THE PAYMENT TOKEN!!!!!
exports.generatePaymentToken = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    if (!gym) throw errorMsgs.gymNotFound
    const paymentToken = await jwt.sign({ gymId: gym.id }, process.env.JWT_GYM_ACCESS_SECRET, { expiresIn: '30m' })
    
    res.json({ paymentToken })
}

//FIXME: WE NEED TO FIX THE PAYMENT TOKEN!!!!!
exports.setAccessToken = async (req, res) => {
    const { paymentToken } = req.params
    try {
        const { gymId } = await jwt.verify(paymentToken, process.env.JWT_GYM_ACCESS_SECRET)
        const gym = await Gym.findById(gymId)
        const payload = { gymId: gym.id, gymAdmin: gym.admin }
        const accessToken = await jwt.sign(payload, process.env.JWT_GYM_ACCESS_SECRET, { expiresIn: '30d' })

        const currentDate = new Date()
        const expireDaysInMilliseconds = 30 * (1000 * 60 * 60 * 24)
        const accessExpireDate = new Date(currentDate.getTime() + expireDaysInMilliseconds)

        await gym.updateOne({ accessToken, accessExpireDate, lastPaymentDate: currentDate })
        res.json({ message: successMsgs.setAccessTokenSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.setAccessTokenError })
    }
}

exports.addPicture = async (req, res) => {
    const { gymId } = req.params
    const newGymPic = req.file != null ? req.file.filename : ''
    if (!newGymPic) throw errorMsgs.noPicUploaded

    const gym = await Gym.findById(gymId)
    const { gymImageNames } = gym
    const newImages = [...gymImageNames, newGymPic]
    if (newImages.length > 12) throw errorMsgs.gymPicLimitReached
    const newImagePaths = newImages.map(image => path.join('/', Gym.gymImageBasePath, image))

    try {
        await gym.updateOne({ gymImageNames: newImages, gymImagePaths: newImagePaths })
        res.json({ message: successMsgs.gymPicsUpdated })
    } catch {
        res.status(500).json({ message: errorMsgs.gymUpdateError })
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
        res.json({ message: successMsgs.gymPicsUpdated })
    } catch {
        res.status(500).json({ message: errorMsgs.gymUpdateError })
    }
}

exports.deleteAllPictures = async (req, res) => {
    const { gymId } = req.params
    const gym = await Gym.findById(gymId)
    const deletePicErr = deleteGymPicFiles(gym.gymImageNames)
    if (deletePicErr) throw deletePicErr

    try {
        await gym.updateOne({ gymImageNames: [], gymImagePaths: [] })
        res.json({ message: successMsgs.gymPicsUpdated })
    } catch {
        res.status(500).json({ message: errorMsgs.gymUpdateError })
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
        res.json({ message: successMsgs.deleteGymAccountSuccess })
    } catch {
        res.status(500).json({ message: errorMsgs.deleteGymAccountError })
    }
}