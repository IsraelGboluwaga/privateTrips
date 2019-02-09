var express = require('express');
var router = express.Router();

/* GET  page. */
router.get('/', function(req, res, next) {
  res.render('sessions/add', {
     title: 'Private trips',
     currentYear: new Date().getFullYear() 
     });
});

module.exports = router;
