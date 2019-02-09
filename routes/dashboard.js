const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//To load the idea model
require('../models/Session');
const Session  = mongoose.model('sessions');

/* GET home page. */
router.get('/', function(req, res, next) {
  Session.find({})
  .sort({date:'desc'})
  .then(sessions =>{
    res.render('sessions/dashboard', {
      sessions:sessions,
      title: 'Private trips',
      currentYear: new Date().getFullYear() 
      });
  });
  
});

module.exports = router;
