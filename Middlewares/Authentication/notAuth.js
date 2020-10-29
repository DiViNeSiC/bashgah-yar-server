module.exports = async (req, res, next) => {
    const authToken = req.headers.authorization
    if (authToken) throw 'شما از این کار منع شده اید'
    next()
}