const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { auth, authRole } = require('../Middlewares/authenticates')
const { sportingMoveGifUpload } = require('../Middlewares/uploads')
const { GYM_COACH_ROLE, ATHLETE_ROLE, SITE_ADMIN_ROLE } = require('../Handlers/Constants/roles')
const { checkParamId, checkAccessForSchedules, gymEntryCheck } = require('../Middlewares/checks')
const { 
    getAthleteSchedules, deleteMoveById, getScheduleById, getAllSportMoves,
    createNewMove, createNewSchedule, deleteScheduleById, checkCompletedMoves,
} = require('../Controllers/scheduleController')

router.get('/moves', catchErrors(getAllSportMoves))
router.get('/:scheduleId', checkParamId, auth, authRole(GYM_COACH_ROLE, ATHLETE_ROLE), checkAccessForSchedules, catchErrors(getScheduleById))
router.get('/athlete/:athleteId', checkParamId, auth, authRole(GYM_COACH_ROLE, ATHLETE_ROLE), checkAccessForSchedules, catchErrors(getAthleteSchedules))

router.post('/move', auth, authRole(SITE_ADMIN_ROLE), sportingMoveGifUpload.single('moveGif'), catchErrors(createNewMove))
router.post('/schedule/:athleteId', checkParamId, auth, authRole(GYM_COACH_ROLE), gymEntryCheck, checkAccessForSchedules, catchErrors(createNewSchedule))

router.put('/check-moves/:scheduleId', checkParamId, auth, authRole(ATHLETE_ROLE), catchErrors(checkCompletedMoves))

router.delete('/move/:moveId', checkParamId, auth, authRole(SITE_ADMIN_ROLE), catchErrors(deleteMoveById))
router.delete('/schedule/:scheduleId', checkParamId, auth, authRole(GYM_COACH_ROLE), gymEntryCheck, checkAccessForSchedules, catchErrors(deleteScheduleById))

module.exports = router