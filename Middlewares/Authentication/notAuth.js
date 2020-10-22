const User = require('../../Models/User')

module.exports = async (req, res, next) => {
    try {
        const authToken = req.headers.authorization
        if (authToken) {
            const token = authToken.split(' ')[1]
            const user = await User.findOne({ entryToken: token })

            if (user != null) 
                throw 'شما از این کار منع شده اید'
        }
        
        next()
    } catch (err) {
        res.status(500).json({ message: 'خطا از سمت سرور' })
    }
}