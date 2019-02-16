var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

//To load the idea model
require('../models/Session');
const Session  = mongoose.model('sessions');


/* GET  page. */
router.get('/', function(req, res, next ){
    res.render('sessions/edit/:id', {
       title: 'Private trips',
       currentYear: new Date().getFullYear() 
       });
  });
  

module.exports = router;
