const createError = require('http-errors');
const express = require('express');
//const _ = require('lodash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
//const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const ssession = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const dashboardRouter = require('./routes/dashboard');
const addsessionRouter = require('./routes/add');
const editsessionRouter = require('./routes/edit');
const viewRouter = require('./routes/view');



const app = express();

//To get rid of deprecation warning using global promises.
mongoose.Promise = global.Promise;

//db config
const db = require('./config/database');

//pasport config
require('./config/passport')(passport);

//to connect to mongoose
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true,
})
  .then(() => console.log('Mongodb started and conected...'))
  .catch(err => console.log(err));


//To load the idea model
require('./models/Session');
const Session = mongoose.model('sessions');

// TO load User model
require('./models/User');
const User = mongoose.model('users');

//to load contact model
require('./models/Contact');
const Contact = mongoose.model('contact');


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// Static folder
app.use(express.static(path.join(__dirname, 'public')));



//methodoverride
app.use(methodOverride('_method'));


//Express session middleware
app.use(ssession({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
//for Passport Middleware  User Session
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
app.use(flash());

//Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
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
app.use('/session/view', viewRouter)

//Edit idea form 
app.get('/sessions/edit/:id', (req, res) => {
  Session.findOne({
    _id: req.params.id
  })
    .then(session => {
      res.render('sessions/edit', {
        session: session
      });
    });

});

//Enlarge sessions
app.get('/sessions/:id', (req,res) =>{
  Session.findOne({
    _id: req.params.id
  })
   .then(session => {
    res.render('sessions/view',{
      title: session.title,
      details: session.details

    });
    

});
});


//to process add form validate empty spaces and push errors 
app.post('/sessions', (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Please add a tittle.' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some content.' });
  }
  if (errors.length > 0) {
    res.render('sessions/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Session(newUser)
      .save()
      .then(session => {
        req.flash('success_msg', 'Added.');
        res.redirect('/sessions/dashboard');
      })
  }
});


// Edit form process
app.put('/sessions/:id', (req, res) => {
  Session.findOne({
    _id: req.params.id
  })
    .then(session => {
      //new values
      session.title = req.body.title;
      session.details = req.body.details;

      session.save()
        .then(session => {
          req.flash('success_msg', 'Done.');
          res.redirect('/sessions/dashboard');
        })
    });
});

// To delete sessions
app.delete('/sessions/:id', (req, res) => {
  Session.remove({ _id: req.params.id })
    .then(() => {
      res.redirect('/sessions/dashboard');

    })
});


//DElete Idea
app.delete('/ideas/:id', (req, res) => {
  Session.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Deleted.')
      res.redirect('/ideas');
    })
  //res.send('DELETE');
});


// Signup form post
app.post('/users/signup', (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  } if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  } if (req.body.Username.length < 4) {
    errors.push({ text: 'Username must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/signup', {
      errors: errors,
      Firstname: req.body.Firstname,
      Lastname: req.body.Lastname,
      Username: req.body.Username,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  }
  else {
    User.findOne({ Username: req.body.Username })
    User.findOne({ email: req.body.email })

      .then(user => {
        if (user) {
          req.flash('error_msg', 'Username has ben taken ');
          req.flash('error_msg', ' email has been registered by another user');
          res.redirect('/users/signup');

        }

        else {
          const newUser = new User({
            Firstname: req.body.Firstname,
            Lastname: req.body.Lastname,
            Username: req.body.Username,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Successfull, Proceed to Sign in');
                  res.redirect('/users/signin');
                })
                .catch(err => {
                  console.log(err);
                  return;

                });
            });
          });
        }
        // console.log(newUser);
        // res.send('Passed');
      });
    // res.send('Successfull')
  }
  //console.log(req.body)
});




//Signin form post
app.post('/users/signin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/sessions',
    failureRedirect: '/users/signin',
    failureFlash: true,

  })(req, res, next)
  if (err) throw err;
});






//COntact form post
app.post('/', (req, res) => {
  console.log(req.body.news)
  console.log(typeof (req.body.news))
  let errors = [];
  if (!req.body.message) {
    errors.push({ text: 'You cant send an empty message.' });
  }
  if (errors.length > 0) {
    res.render('index', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      news: req.body.email,
      message: req.body.message
    });
  } else {
    const newContact = {
      name: req.body.name,
      email: req.body.email,
      news: req.body.news,
      message: req.body.message,

    }
    new Contact(newContact)
      .save()
      .then(contact => {
        req.flash('success_msg', 'Thanks, your message has been sent');
        res.redirect('/');
      })

  }
});






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
