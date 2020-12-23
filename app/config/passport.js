const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')


function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async(email, password, done) => {
        // login
        // check if email exists
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false, { message: 'no user with this email' })
        }
        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, { message: "lgged in succesfully" })
            }
            return done(null, false, { message: "Wrong username or password" })

        }).catch(err => {
            return done(null, false, { message: "sumthin went wrong" })

        })
    }))

    passport.serializeUser((user, done) => {
        return done(null, user._id)


    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user)
        })
    })
}

module.exports = init