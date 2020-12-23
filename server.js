require("dotenv").config()
const express = require("express")
const app = express()
const ejs = require("ejs")
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash') //use for express-session
const MongoDBStore = require("connect-mongo")(session)
const passport = require('passport')
const Emitter = require('events')

const PORT = process.env.PORT || 3300

// database connection

mongoose.connect('localhost:27017', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true })
const connection = mongoose.connection;
connection.once("open", () => {
    console.log('Database connected....');
}).catch(err => {
    console.log('connection failed');
})


// sessionStorage
let mongoStore = new MongoDBStore({
    mongooseConnection: connection,
    collection: "sessions"
})


//session config
app.use(session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: mongoStore,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }
    }))
    // Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter) //this access any rout


// passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

// assets 
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// global middelwere 
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set tamplate engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/wab')(app)

let server = app.listen(PORT, () => {
    console.log('listening on port 3300')
})

const io = require('socket.io')(server)
io.on('connection', (socket) => {
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})