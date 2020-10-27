module.exports = (req, res, next) => {
    const { verifiedEmail } = req.payload
    if (!verifiedEmail) 
        throw 'برای انجام این عملیات نیاز به تایید کردن ایمیل خود دارید'

    next()
}