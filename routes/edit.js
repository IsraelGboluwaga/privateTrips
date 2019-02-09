var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

//To load the idea model
require('../models/Session');
const Session  = mongoose.model('sessions');


/* GET  page. */
router.get('/sessions/edit/:id', (req, res, )=> {
    Session.findOne({
        _id: req.params.id
    })
    .then(session =>{
        res.render('sessions/edit', {
            session:session,
            title: 'Private trips',
            currentYear: new Date().getFullYear() 
            });
    });
 
});

module.exports = router;
