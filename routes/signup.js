var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users/signup', {
     title: 'Private trips',
     currentYear: new Date().getFullYear() 
     });
});

module.exports = router;
