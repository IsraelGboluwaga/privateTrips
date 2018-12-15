const createError = require('http-errors');
const express = require('express');
const _ = require('lodash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');

//const mongoose= require('mongoose');



// To connect to mySQL database
// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'private',
    database: 'privateTrips'
	
});

// connect to database
db.connect((err) => {
    if (err) {
        //throw err;
		console.log('Sorry database cannot be reached');
		console.log(err);
    }
    	console.log('Connected to database...');
});
global.db = db;




const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const dashboardRouter = require('./routes/dashboard');
const changepasswordRouter = require('./routes/changepassword');

const app = express();

//Here the database is created

app.get('/createdb', (reeq,res)=>{
	let sql='CREATE DATABASE nodemysql';
	db.query(sql,(err,result) =>{
		if(err) throw err;
		res.send('Database has been created');
	})
});


//Ive been trying to connect to mongooose.. this shit isn t working!!!!

//to get rid of promise deprecation
//mongoose.promise = global.Promise;

//Connecting to mongoose
//in the bracket , you can have a local mongodb or a remote on e from m-lab
//mongoose.connect('mongodb://localhost/privatetrips-dev',{
//   useNewUrlParser: true 
//})
//.then(() => console.log("MongoDb has connected..."))
//.catch( err => console.log(err));
	
//To load idea models
//require('./models/Idea');
//const Idea = mongoose.mode('ideas');

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
app.use('/changepassword', changepasswordRouter);

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
