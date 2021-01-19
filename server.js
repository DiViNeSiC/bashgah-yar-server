if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

//ROUTERS
const authRouter = require('./Routes/authRouter')
const scheduleRouter = require('./Routes/scheduleRouter')
const gymControlRouter = require('./Routes/gymControlRouter')
const userControlRouter = require('./Routes/userControlRouter')
const gymRegistersRouter = require('./Routes/gymRegistersRouter')
const communicationRouter = require('./Routes/communicationRouter')
const siteAdminRegisterRouter = require('./Routes/siteAdminRegisterRouter')

//Middlewares
const { accountVerifiedCheck } = require('./Middlewares/checks')
const { auth, notAuth } = require('./Middlewares/authenticates')

mongoose.connect(process.env.DATABASE_URI, { 
    useCreateIndex: true,
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
})

const db = mongoose.connection

db.on('error', (err) => console.error(`Mongoose Connection Error ${err}`))
db.once('open', () => console.log('Connected To Mongoose'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./Public'))

app.use('/auth', authRouter)
app.use('/schedules', scheduleRouter)
app.use('/all-gyms', gymControlRouter)
app.use('/user', auth, userControlRouter)
app.use('/communication', communicationRouter)
app.use('/site', notAuth, siteAdminRegisterRouter)
app.use('/gym', auth, accountVerifiedCheck, gymRegistersRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`APP RUNNING ON ${port}`))