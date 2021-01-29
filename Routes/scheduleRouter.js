const router = require('express').Router()
const { catchErrors } = require('../Handlers/errorHandler')
const { auth, authRole } = require('../Middlewares/authenticates')
const { sportingMoveGifUpload } = require('../Middlewares/uploads')
const { GYM_COACH_ROLE, ATHLETE_ROLE, SITE_ADMIN_ROLE } = require('../Handlers/Constants/roles')
const { checkParamId, checkAccessForSchedules, gymEntryCheck } = require('../Middlewares/checks')
const { 
    createNewMove, createNewSchedule, deleteScheduleById, changeMoveTaskCompleteSection,
    getAthleteSchedules, deleteMoveById, getScheduleById, getAllSportMoves, getOneSportMove,
} = require('../Controllers/scheduleController')

router.get('/move', catchErrors(getAllSportMoves))
router.get('/move/:moveId', catchErrors(getOneSportMove))
router.get('/schedule/:scheduleId', checkParamId, auth, authRole(GYM_COACH_ROLE, ATHLETE_ROLE), checkAccessForSchedules, catchErrors(getScheduleById))
router.get('/athlete/:athleteId', checkParamId, auth, authRole(GYM_COACH_ROLE, ATHLETE_ROLE), checkAccessForSchedules, catchErrors(getAthleteSchedules))

router.post('/move', auth, authRole(SITE_ADMIN_ROLE), sportingMoveGifUpload.single('moveGif'), catchErrors(createNewMove))
router.post('/schedule/:athleteId', checkParamId, auth, authRole(GYM_COACH_ROLE), gymEntryCheck, checkAccessForSchedules, catchErrors(createNewSchedule))

router.put('/check-moves/:scheduleId', checkParamId, auth, authRole(ATHLETE_ROLE), catchErrors(changeMoveTaskCompleteSection))

router.delete('/move/:moveId', checkParamId, auth, authRole(SITE_ADMIN_ROLE), catchErrors(deleteMoveById))
router.delete('/schedule/:scheduleId', checkParamId, auth, authRole(GYM_COACH_ROLE), gymEntryCheck, checkAccessForSchedules, catchErrors(deleteScheduleById))

module.exports = router