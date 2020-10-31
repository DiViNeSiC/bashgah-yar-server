const router = require('express').Router()
const { catchErrors } = require('../../Handlers/errorHandler')
const { getLoggedUser } = require('../../Controllers/GetControllers/getUserController')

router.get('/', catchErrors(getLoggedUser))

module.exports = router