const router = require('express').Router()
const upload = require('../../Middlewares/Uploads/gymPictures')
const gymAdminCheck = require('../../Middlewares/UserOperations/gymAdminCheck')
const { catchErrors } = require('../../Handlers/errorHandler')
const {
    addPicture, editInfo,
    deleteAllPictures,
    deleteGymAccount,
    deleteOnePicture
} = require('../../Controllers/GymControllers/editGymController')
const {
    getAdminGyms, getGymById
} = require('../../Controllers/GymControllers/getGymController')

router.get('/', catchErrors(getAdminGyms))
router.get('/:gymId', gymAdminCheck, catchErrors(getGymById))

router.put('/:gymId', gymAdminCheck, catchErrors(editInfo))
router.put('/add-pic/:gymId', gymAdminCheck, upload.single('gymPic'), catchErrors(addPicture))

router.delete('/:gymId', gymAdminCheck, catchErrors(deleteGymAccount))
router.delete('/all-pics/:gymId', gymAdminCheck, catchErrors(deleteAllPictures))
router.delete('/one-pic/:gymId/:filename', gymAdminCheck, catchErrors(deleteOnePicture))

module.exports = router