const User = require('../Models/User')

module.exports = (io) => io.on('connection', async (socket) => {
    const loggedUserId = socket.handshake.query.userId || null
    if (loggedUserId) {
        await User.findByIdAndUpdate(loggedUserId, { socketId: socket.id })
    }

    socket.on('send-message', async ({ senderId, receiverId }) => {
        const sender = await User.findById(senderId)
        const receiver = await User.findById(receiverId)

        socket.to(receiver.socketId).broadcast.emit('send-notification', { 
            time: new Date,
            senderUsername: sender.username,
        })
    })

    socket.on('user-update', async (userId) => {
        const user = await User.findById(userId).populate('adminGyms').populate('gym').exec()
        socket.to(user.socketId).broadcast.emit('send-user-updated-profile', user)
    })
})