const Schedule = require('../Models/Schedule')
const SportingMove = require('../Models/SportingMove')
const { scheduleController: { errorMsgs, successMsgs } } = require('../Handlers/Constants/responseMessages')

exports.getAllSportMoves = async (req, res) => {
    const moves = await SportingMove.find()
    res.json({ moves })
}

exports.getAthleteSchedules = async (req, res) => {
    const { athlete } = req
    const schedules = await Schedule.find({ athlete: athlete._id }).populate('movesList').populate('coach').exec()
    res.json({ schedules, athlete })
}

exports.getScheduleById = async (req, res) => {
    res.json({ schedule: req.schedule })
}

exports.createNewSchedule = async (req, res) => {
    const { athlete } = req
    const { movesId } = req.body
    if (!movesId.length) throw errorMsgs.movesListIsEmpty

    const movesList = movesId.map(move => ({ move, checked: false }))
    const newSchedule = new Schedule({ athlete: athlete._id, coach: req.user.id, movesList })

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
    try {
        const { schedule } = req
        await schedule.deleteOne()
        res.json({ message: successMsgs.deleteScheduleSuccess })
    } catch (err) {
        res.status(500).json({ message: errorMsgs.deleteScheduleError })
    }
}