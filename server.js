if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

//ROUTERS
const authRouter = require('./Routes/authRouter')
const gymControlRouter = require('./Routes/gymControlRouter')
const userControlRouter = require('./Routes/userControlRouter')
const gymRegistersRouter = require('./Routes/gymRegistersRouter')
const siteAdminRegisterRouter = require('./Routes/siteAdminRegisterRouter')

//Middlewares
const { auth, notAuth } = require('./Middlewares/authenticates')
const { emailVerifiedCheck } = require('./Middlewares/checks')

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

app.use('/auth', authRouter)
app.use('/user', auth, userControlRouter)
app.use('/all-gyms', auth, gymControlRouter)
app.use('/site', notAuth, siteAdminRegisterRouter)
app.use('/gym', auth, emailVerifiedCheck, gymRegistersRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`APP RUNNING ON ${port}`))