const mongoose = require('mongoose')
const path = require('path')
const messageFileBasePath = 'Uploads/MessageFiles'

const messageSchema = new mongoose.Schema({
    text: String,
    file: String,
    filePath: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    readCheck: {
        type: Boolean,
        default: false
    },
    automatedMessage: {
        type: Boolean,
        default: false
    },
    time: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

messageSchema.pre('save', function() {
    if (this.file !== '' && this.file != null) {
        return this.filePath = path.join('/', messageFileBasePath, this.file)
    }
})

module.exports = mongoose.model('Message', messageSchema)
module.exports.messageFileBasePath = messageFileBasePath