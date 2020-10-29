const mongoose = require('mongoose')

const codeSchema = new mongoose.Schema({
    code: { 
        type: String,
        lowercase: true,
        required: true
    },
    createdAt: {
        type: Date, 
        expires: '2m', 
        default: Date.now 
    }
}, { timestamps: true })

module.exports = mongoose.model('TimeBasedCode', codeSchema)