if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const siteAdminRouter = require('./Routes/MainRoutes/siteAdmin')
const gymAdminRouter = require('./Routes/MainRoutes/gymAdmin')
const gymManagerRouter = require('./Routes/MainRoutes/gymManager')
const gymCoachRouter = require('./Routes/MainRoutes/gymCoach')
const athleteRouter = require('./Routes/MainRoutes/athlete')

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

app.use('/site-admin', siteAdminRouter)
app.use('/gym-admin', gymAdminRouter)
app.use('/gym-manager', gymManagerRouter)
app.use('/gym-coach', gymCoachRouter)
app.use('/athlete', athleteRouter)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`APP RUNNING ON ${port}`))