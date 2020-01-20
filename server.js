const express = require('express')
const session =require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const passport = require('passport')
const flash = require('connect-flash')

const initPassport=require('./config/pa ssport')
initPassport(passport)

app.use(morgan('dev'))
app.use(cookieParser)
app.use(bodyParser.urlencoded({extended:true}))

app.use('view engine','ejs')
app.use(session({
    secret:'justasecret',
    resave:true,
    saveUninitialized:true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
const initRoutes = require('./app/routes')

initRoutes(app,passport)
const port = process.env.PORT || 3000;
app.listen('port'+port);