if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

//ROUTERS
//GLOBAL ROUTERS
const loginRouter = require('./Routes/GlobalRoutes/login')
const activeAccountRouter = require('./Routes/GlobalRoutes/activeAccount')
const adminRegistrationRouter = require('./Routes/GlobalRoutes/adminRegistration')
const editAccountRouter = require('./Routes/GlobalRoutes/editAccount')

//SPECIAL ROUTERS
const siteAdminRouter = require('./Routes/MainRoutes/siteAdmin')
const gymAdminRouter = require('./Routes/MainRoutes/gymAdmin')
const gymManagerRouter = require('./Routes/MainRoutes/gymManager')
const gymCoachRouter = require('./Routes/MainRoutes/gymCoach')
const athleteRouter = require('./Routes/MainRoutes/athlete')

//MIDDLEWARES
const auth = require('./Middlewares/Authentication/auth')
const notAuth = require('./Middlewares/Authentication/notAuth')
const rolePass = require('./Middlewares/Authentication/authRole')

//ERRORHANDLER
const { catchErrors } = require('./Handlers/errorHandler')

//ROLES
const {
    ATHLETE_ROLE,
    GYM_ADMIN_ROLE,
    GYM_COACH_ROLE,
    GYM_MANAGER_ROLE,
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

app.use('/login', catchErrors(notAuth), loginRouter)
app.use('/admin-registration', catchErrors(notAuth), adminRegistrationRouter)
app.use('/account-activation', catchErrors(auth), activeAccountRouter)
app.use('/edit-account', catchErrors(auth), editAccountRouter)

app.use('/site-admin', catchErrors(auth), catchErrors(rolePass(SITE_ADMIN_ROLE)), siteAdminRouter)
app.use('/gym-admin', catchErrors(auth), catchErrors(rolePass(GYM_ADMIN_ROLE)), gymAdminRouter)
app.use('/gym-manager', catchErrors(auth), catchErrors(rolePass(GYM_MANAGER_ROLE)), gymManagerRouter)
app.use('/gym-coach', catchErrors(auth), catchErrors(rolePass(GYM_COACH_ROLE)), gymCoachRouter)
app.use('/athlete', catchErrors(auth), catchErrors(rolePass(ATHLETE_ROLE)), athleteRouter)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`APP RUNNING ON ${port}`))