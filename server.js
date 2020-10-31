if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

//ROUTERS
//GLOBAL ROUTERS
const loginRouter = require('./Routes/GlobalRoutes/login')
const forgotPasswordRouter = require('./Routes/GlobalRoutes/forgotPassword')
const activeAccountRouter = require('./Routes/GlobalRoutes/activeAccount')
const adminRegistrationRouter = require('./Routes/GlobalRoutes/adminRegistration')
const getUserRouter = require('./Routes/GlobalRoutes/getLoggedUser')
const editAccountRouter = require('./Routes/GlobalRoutes/editAccount')

//MAIN ROUTERS
const siteAdminRouter = require('./Routes/MainRoutes/siteAdmin')
const gymAdminRouter = require('./Routes/MainRoutes/gymAdmin')
const gymManagerRouter = require('./Routes/MainRoutes/gymManager')
const gymCoachRouter = require('./Routes/MainRoutes/gymCoach')
const athleteRouter = require('./Routes/MainRoutes/athlete')

//MIDDLEWARES
const auth = require('./Middlewares/Authentication/auth')
const notAuth = require('./Middlewares/Authentication/notAuth')
const rolePass = require('./Middlewares/Authentication/authRole')

//ROLES
const {
    ATHLETE_ROLE, GYM_ADMIN_ROLE, 
    GYM_COACH_ROLE, GYM_MANAGER_ROLE, 
    SITE_ADMIN_ROLE
} = require('./Handlers/Constants/roles')

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

app.use('/login', notAuth, loginRouter)
app.use('/forgot-password', notAuth, forgotPasswordRouter)
app.use('/admin-registration', notAuth, adminRegistrationRouter)

app.use('/user', auth, getUserRouter)
app.use('/account-activation', auth, activeAccountRouter)
app.use('/edit-account', auth, editAccountRouter)

app.use('/site-admin', auth, rolePass(SITE_ADMIN_ROLE), siteAdminRouter)
app.use('/gym-admin', auth, rolePass(GYM_ADMIN_ROLE), gymAdminRouter)
app.use('/gym-manager', auth, rolePass(GYM_MANAGER_ROLE), gymManagerRouter)
app.use('/gym-coach', auth, rolePass(GYM_COACH_ROLE), gymCoachRouter)
app.use('/athlete', auth, rolePass(ATHLETE_ROLE), athleteRouter)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`APP RUNNING ON ${port}`))