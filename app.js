const createError = require('http-errors');
const express = require('express');
const _ = require('lodash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const yargs =require('yargs');
const fs = require('fs');
const mongoose = require('mongoose');






const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const dashboardRouter = require('./routes/dashboard');


const app = express();

//To get rid of deprecation warning using global promises.
mongoose.Promise = global.Promise;

//to connect to mongoose
mongoose.connect('mongodb://localhost/private-trips', {
  useMongoClient : true 
})
.then(()=> console.log('Mongodb started and conected...'))
.catch(err => console.log(err));


//To register Partials
hbs.registerPartials(__dirname + '/views/partials');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/dashboard', dashboardRouter);
 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
