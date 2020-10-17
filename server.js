if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

mongoose.connect(process.env.DATABASE_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true 
})

const db = mongoose.connection

db.on('error', (err) => console.error(`Mongoose Connection Error ${err}`))
db.once('open', () => console.log('Connected To Mongoose'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('./Public'))

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`APP RUNNING ON ${port}`))