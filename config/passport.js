//const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs')



// TO load User model
require('../models/User');
const User = mongoose.model('users');


module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:'Username', passwordField: 'password'},(email, password, done)=>{
        console.log('working fine here');
        console(req);
        console.log(email);
        console.log(err)
        //To search user
        User.findOne({
            Username:Username
        }).then(user =>{
            if(!user){
                return done(null, false,{message: 'No User found'});
            }
            //To match password that was hatched
            bcrypt.compare(password, user.password,(err, isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else {
                    return done(null, false, {message: 'Password is incorrect'});
            }
        })
    })
    }));

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}