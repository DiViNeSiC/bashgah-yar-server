module.exports = (secondDate, firstDate = new Date()) => {
    const oneHourInMilliseconds = 1000 * 60 * 60
    const oneDayInMilliseconds = 1000 * 60 * 60 * 24

    const firstTime = firstDate.getTime()
    const secondTime = secondDate.getTime()

    const timeDifference = secondTime - firstTime

    const numberOfHours = timeDifference / oneHourInMilliseconds
    const mainDifference = timeDifference / oneDayInMilliseconds

    const daysRemaining = numberOfHours / 24
    const hoursRemaining = numberOfHours % 24
    const minutesRemaining = hoursRemaining * 60

    return {
        mainDifference,
        differenceInDays: parseInt(daysRemaining),
        differenceInHours: parseInt(hoursRemaining),
        differenceInMinutes: parseInt(minutesRemaining),
    }
}