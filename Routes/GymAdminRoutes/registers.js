const router = require('express').Router()
const upload = require('../../Middlewares/Uploads/avatarImage')
const { catchErrors } = require('../../Handlers/errorHandler')
const { 
    gymRegister, managerRegister
} = require('../../Controllers/Register/gymAdminRegistersController')

router.post('/manager', upload.single('avatar'), catchErrors(managerRegister))
router.post('/gym', upload.array('gymPics'), catchErrors(gymRegister))

module.exports = router