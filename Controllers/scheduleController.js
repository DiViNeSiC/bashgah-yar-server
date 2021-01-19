const User = require('../Models/User')
const Schedule = require('../Models/Schedule')
const SportingMove = require('../Models/SportingMove')
const { ATHLETE_ROLE } = require('../Handlers/Constants/roles')
const { scheduleController: { errorMsgs, successMsgs } } = require('../Handlers/Constants/responseMessages')

exports.getAthleteSchedules = async (req, res) => {
    const { athleteId } = req.params
    const athlete = await User.findOne({ _id: athleteId, role: ATHLETE_ROLE }).populate('gym').exec()
    if (!athlete) throw errorMsgs.athleteNotFound
    const schedules = await Schedule.find({ athlete: athleteId }).populate('movesList').populate('coach').exec()
    if (!schedules.length) throw errorMsgs.scheduleNotFound
    
    res.json({ schedules, athlete })
}

exports.getScheduleById = async (req, res) => {
    const { scheduleId } = req.params
    const schedule = await Schedule.findById(scheduleId)
        .populate('coach').populate('athlete').populate('movesList').exec()
        
    if (!schedule) throw errorMsgs.scheduleNotFound
    res.json({ schedule })
}

exports.createNewSchedule = async (req, res) => {
    const { movesId } = req.body
    const { athleteId } = req.params
    if (!movesId.length) throw errorMsgs.movesListIsEmpty

    const athlete = await User.findOne({ _id: athleteId, role: ATHLETE_ROLE })
    if (!athlete) throw errorMsgs.athleteNotFound

    const movesList = movesId.map(move => ({ move, checked: false }))
    const newSchedule = new Schedule({ athlete: athlete.id, coach: req.user.id, movesList })

    try {
        await newSchedule.save()
        res.json({ message: successMsgs.createScheduleSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.createScheduleError })
    }
}

exports.checkCompletedMoves = async (req, res) => {
    const { scheduleId } = req.params
    const { completedMovesId } = req.body
    const schedule = await Schedule.findOne({ _id: scheduleId, athlete: req.user.id })
    if (!schedule) throw errorMsgs.scheduleNotFound

    const newMovesList = schedule.movesList.map(({ move }) => {
        const completedMove = completedMovesId.find(completed => completed === move.toString())
        if (completedMove) return { move, checked: true }
        return { move, checked: false }
    })

    try {
        await schedule.updateOne({ movesList: newMovesList })
        res.json({ message: successMsgs.scheduleUpdated })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.scheduleUpdateError })
    }
}

exports.createNewMove = async (req, res) => {
    const { name, notes, category } = req.body
    const gifName = req.file != null ? req.file.filename : ''
    const newMove = new SportingMove({ name, notes, category, gifName })

    try {
        await newMove.save()
        res.json({ message: successMsgs.createNewMoveSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.createNewMoveError })
    }
}

exports.deleteMoveById = async (req, res) => {
    const { moveId } = req.params
    const move = await SportingMove.findById(moveId)
    if (!move) throw errorMsgs.moveNotFound

    try {
        await move.deleteOne()
        res.json({ message: successMsgs.deleteMoveSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.deleteMoveError })
    }
}

exports.deleteScheduleById = async (req, res) => {
    const { scheduleId } = req.params
    const schedule = await Schedule.findById(scheduleId)
    if (!schedule) throw errorMsgs.scheduleNotFound

    try {
        await schedule.deleteOne()
        res.json({ message: successMsgs.deleteScheduleSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.deleteScheduleError })
    }
}