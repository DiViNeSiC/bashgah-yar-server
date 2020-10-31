module.exports = async (req, res, next) => {
    const authToken = req.headers.authorization
    if (authToken) return res.status(403).json({ 
        message: 'شما از این کار منع شده اید'
    })
    next()
}