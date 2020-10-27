module.exports = (req, res, next) => {
    if (!req.payload.email) 
        throw 'برای انجام این عملیات نیاز به ایمیل دارید'

    next()
}