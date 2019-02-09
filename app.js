const createError = require('http-errors');
const express = require('express');
const _ = require('lodash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');




const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const dashboardRouter = require('./routes/dashboard');
const addsessionRouter = require('./routes/add');
const editsessionRouter = require('./routes/edit');



const app = express();

//To get rid of deprecation warning using global promises.
mongoose.Promise = global.Promise;

//to connect to mongoose
mongoose.connect('mongodb://localhost/private-trips', {
  useNewUrlParser:true
})
.then(()=> console.log('Mongodb started and conected...'))
.catch(err => console.log(err));


//To load the idea model
require('./models/Session');
const Session     = mongoose.model('sessions');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

//methodoverride
app.use(methodOverride('_method'));


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
app.use('/sessions/dashboard', dashboardRouter);
app.use('/sessions/add', addsessionRouter);
app.use('/sessions/edit', editsessionRouter);

//Edit idea form 
app.get('/sessions/edit/:id', (req, res) => {
  res.render('sessions/edit')
});


//to process add form validte empty spaces and push errors 
app.post('/sessions', (req,res) =>{
  let errors = [];
  if(!req.body.title){
    errors.push({text:'Please add a tittle.'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some content.'});
  }
  if(errors.length > 0){
    res.render('sessions/add',{
    errors: errors,
    title: req.body.title,
    details: req.body.details
    });
  } else{
    const newUser = {
      title:req.body.title,
      details:req.body.details
    }
    new Session(newUser)
    .save()
    .then(session =>{
      res.redirect('/sessions/dashboard');
    })
  }
});


// Edit form process
app.put('/sessions/:id', (req,res)=>{
  Session.findOne({
    _id:req.params.id
  
  })
  .then(session =>{
    //new values
    session.title = req.body.title;
    session.details = req.body.details;

    idea.save()
    .then(session =>{
      res.redirect('/sessions/dashboard')
    })
  });
  
});


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
 