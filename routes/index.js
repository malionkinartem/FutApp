var express = require('express');
var fut = require('fut-api');
var router = express.Router();
var futService = require('../services/futservice');

router.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

router.get('/about', function(req, res){
  res.render('about', {
    title: 'About'
  });
});

router.get('/contact', function(req, res){
  res.render('contact', {
    title: 'Contact'
  });
});

router.post('/login', function(req, res){
  var passCode = req.body.passcode;
  
  futService.requestLogin(passCode);

  res.render('index', { 
    title: 'Home' 
  });
})


router.post('/getCredits', function(req, res){
  
  futService.getCredits(function(credits){
      res.render('index', { 
        title: 'Home',
        credits: credits
      });
  });


})

router.post('/getPlayer', function(req, res){  
  futService.findplayer(function(credits){
      res.render('index', { 
        title: 'Home'
      });
  });


})

module.exports = router;