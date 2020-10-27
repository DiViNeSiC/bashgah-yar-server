const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../Models/User')

const resetPasswordConfirm = async (req, res) => {
    const { resetPassToken } = req.params
    const { newPassword } = req.body

    try {
        const payload = await jwt
            .verify(resetPassToken, process.env.JWT_RESET_PASS_SECRET)

        if (!payload) 
            throw 'ََمدت زمان تغییر دادن رمز عبور شما به اتمام رسیده است'
        
        const user = await User.findById(payload.userId)
        if (!user) throw 'کاربری با این مشخصات وجود ندارد'

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await user.updateOne({ 
            password: hashedPassword, 
            entryToken: '', 
            refreshToken: ''
        })

        res.json({ message: 'رمز عبور شما با موفقیت تغییر یافت' })
    } catch (err) {
        if (err.message === 'jwt expired') 
            throw 'ََمدت زمان تغییر دادن رمز عبور شما به اتمام رسیده است'

        res.status(500).json({ message: 'خطا در تغییر رمز عبور' })
    }

}

const deleteAccountConfirm = async (req, res) => {
    const { deleteAccountToken } = req.params
    
    try {
        const payload = await jwt
            .verify(deleteAccountToken, process.env.JWT_DELETE_ACC_SECRET)

        if (!payload) 
            throw 'ََمدت زمان پاک کردن حساب کاربری شما به اتمام رسیده است'

        const user = await User.findById(payload.userId)
        if (!user) throw 'کاربری با این مشخصات وجود ندارد'
        
        await user.deleteOne()
        res.json({ message: 'حساب کاربری شما با موفقیت پاک گردید' })
    } catch (err) {
        if (err.message === 'jwt expired') 
            throw 'ََمدت زمان پاک کردن حساب کاربری شما به اتمام رسیده است'

        res.status(500).json({ message: 'خطا در پاک کردن حساب کاربری' })
    }
}

module.exports = { resetPasswordConfirm, deleteAccountConfirm }