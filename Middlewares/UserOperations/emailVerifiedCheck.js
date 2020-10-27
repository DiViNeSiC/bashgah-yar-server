module.exports = (req, res, next) => {
    if (!req.payload.verifiedEmail) 
        throw 'برای انجام این عملیات نیاز به تایید کردن ایمیل خود دارید'

    next()
}