module.exports = (entryRole) => (req, res, next) => {
    if (entryRole !== req.payload.role) 
        return res.status(403).json({ 
            message: 'شما نمیتوانید به این بخش دسترسی داشته باشید' 
        }) 
    next()
}