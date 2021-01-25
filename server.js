if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

//Socket And Http Setup
const server = require('http').Server(app)
const io = require('socket.io')(server)

//ROUTERS
const authRouter = require('./Routes/authRouter')
const scheduleRouter = require('./Routes/scheduleRouter')
const registersRouter = require('./Routes/registersRouter')
const gymControlRouter = require('./Routes/gymControlRouter')
const userControlRouter = require('./Routes/userControlRouter')
const communicationRouter = require('./Routes/communicationRouter')
const siteAdminRegisterRouter = require('./Routes/siteAdminRegisterRouter')

//Middlewares
const { accountVerifiedCheck } = require('./Middlewares/checks')
const { auth, notAuth } = require('./Middlewares/authenticates')

//Cron Jobs
require('./Handlers/CronJobs/checkPaymentDays')
require('./Handlers/CronJobs/deleteExpireDates')
require('./Handlers/CronJobs/deleteAutomatedMessages')

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
app.use(express.static('./Public'))
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRouter)
app.use('/schedules', scheduleRouter)
app.use('/all-gyms', gymControlRouter)
app.use('/user', auth, userControlRouter)
app.use('/site', notAuth, siteAdminRegisterRouter)
app.use('/communication', auth, communicationRouter)
app.use('/registers', auth, accountVerifiedCheck, registersRouter)

//Socket Io Function
require('./Handlers/socketInstance')(io)

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`APP RUNNING ON ${port}`))