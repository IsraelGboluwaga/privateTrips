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


const argv = yargs.argv;
const command = argv[2];


//requiring my own files
const crud = require('./operations.js');
//fs.writeFileSync('console.json', JSON.stringify(process.argv));
//fs.writeFileSync('console.json', JSON.stringify(argv));

if (command === 'add'){
	crud.getAll();
}


// To connect to mySQL database
// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
//it was giving issues about creating db with password given as TRUE, so i had to comment out the password config object.
const db = mysql.createConnection ({
   host: 'localhost',
   user: 'root',
  // password: 'private',
   database: 'ptrips'	
});

// connect to database
db.connect((err) => {
   if (err) {
        throw err;
		//throw err gave bugs, reverted to console.log
		console.log(err);
		console.log('Sorry, database cannot be reached -- No connection could be made.');
   }else
   	console.log('Connected to database...');
});


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const dashboardRouter = require('./routes/dashboard');


const app = express();


//Here the database is created

app.get('/createdb', (req,res)=>{
	let sql='CREATE DATABASE ptrips';
	db.query(sql,(err,result) =>{
		if(err) {
		//throw err;
		console.log(err);
		console.log('Sorry, database cannot be created');
			console.log(result);
		}else
			res.send('Database has been created');
	});
});

var rquery='INSERT INTO userinfo (FirstName, LastName, Username, Sex, PhoneNumber)'
var values=('Ola', 'Gold', 'golddollarr', 'm', '09030368060')
var fullqueery = rquery,values

db.query(fullqueery,(err, res)=>{
	if(err){
		console.log(err);
	}else
		console.log('Query successful')
})




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
