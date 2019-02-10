var express = require('express');
var router = express.Router();

/* GET signIn page. */
router.get('/', function(req, res, next) {
  res.render('users/signin', {
     title: 'Private trips',
     currentYear: new Date().getFullYear() 
     });
});

module.exports = router;
