const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { authRole } = require('../Middlewares/authenticates')
const { checkParamId } = require('../Middlewares/checks')
const { sportingMoveGifUpload } = require('../Middlewares/uploads')
const { GYM_COACH_ROLE, ATHLETE_ROLE, SITE_ADMIN_ROLE } = require('../Handlers/Constants/roles')
const { 
    createNewMove,
    deleteMoveById,
    getScheduleById,
    createNewSchedule,
    deleteScheduleById,
    checkCompletedMoves,
    getAthleteSchedules,
} = require('../Controllers/scheduleController')

router.get('/:scheduleId', checkParamId, authRole(GYM_COACH_ROLE, ATHLETE_ROLE), catchErrors(getScheduleById))
router.get('/athlete/:athleteId', checkParamId, authRole(GYM_COACH_ROLE, ATHLETE_ROLE), catchErrors(getAthleteSchedules))

router.post('/move', authRole(SITE_ADMIN_ROLE), sportingMoveGifUpload.single('moveGif'), catchErrors(createNewMove))
router.post('/schedule/:athleteId', checkParamId, authRole(GYM_COACH_ROLE), catchErrors(createNewSchedule))

router.put('/check-moves/:scheduleId', checkParamId, authRole(ATHLETE_ROLE), catchErrors(checkCompletedMoves))

router.delete('/move/:moveId', checkParamId, authRole(SITE_ADMIN_ROLE), catchErrors(deleteMoveById))
router.delete('/schedule/:scheduleId', checkParamId, authRole(GYM_COACH_ROLE), catchErrors(deleteScheduleById))

module.exports = router