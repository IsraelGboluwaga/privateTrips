const createError = require('http-errors');
const express = require('express');
const _ = require('lodash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const ssession = require('express-session');



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

//db config
const db = require('./config/database')


//to connect to mongoos
mongoose.connect(db.mongoURI, {
  useNewUrlParser:true,
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


//Express session middleware
app.use(ssession({
  secret: 'secret',
  resave: true,
  saveUninitialized : true
}))


// flash middleware
app.use(flash());

//Global variables
app.use(function(req, res, next){
  res.locals.sucess_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


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
app.use('/users/signin', signinRouter);
app.use('/users/signup', signupRouter);
app.use('/sessions/dashboard', dashboardRouter);
app.use('/sessions/add', addsessionRouter);
app.use('/sessions/edit', editsessionRouter);

//Edit idea form 
app.get('/sessions/edit/:id', (req, res) => {
  Session.findOne({
    _id:req.params.id
  })
  .then(session  => {
    res.render('sessions/edit',{
      session:session
    });
  });
  
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
      req.flash('success_msg', 'Added.')
      res.redirect('/sessions/dashboard');
    })
  }
});


// Edit form process
app.put('/sessions/:id', (req, res)=>{
  Session.findOne({
    _id: req.params.id
  })
  .then(session =>{
    //new values
    session.title = req.body.title;
    session.details = req.body.details;

    session.save()
    .then(session =>{
      req.flash('success_msg', 'Done.')
      res.redirect('/sessions/dashboard');
    })
  }); 
});

// To delete sessions
app.delete('/sessions/:id', (req,res) =>{
  Session.remove({_id: req.params.id})
  .then(() => {
    res.redirect('/sessions/dashboard');
  
  })
});


//DElete Idea
app.delete('/ideas/:id', (req,res) =>{
	Session.remove({_id: req.params.id})
	.then(()  => {
    req.flash('success_msg', 'Deleted.')
		res.redirect('/ideas');
	})
	//res.send('DELETE');
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
 