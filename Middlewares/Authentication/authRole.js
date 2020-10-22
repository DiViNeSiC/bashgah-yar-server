module.exports = (entryRole) => 
    async (req, res, next) => {
        const userRole = req.payload.role

        if (entryRole !== userRole) 
            return res.status(403).json({ 
                message: 'شما نمیتوانید به این بخش دسترسی داشته باشید' 
            }) 

        next()
    }