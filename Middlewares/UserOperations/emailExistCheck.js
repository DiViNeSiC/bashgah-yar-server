module.exports = (req, res, next) => {
    const { email } = req.payload
    if (!email) 
        throw 'برای انجام این عملیات نیاز به ایمیل دارید'

    next()
}