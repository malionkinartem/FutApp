var express = require('express');
var fut = require('fut-api');
var router = express.Router();
var futService = require('../services/futservice');
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!

//   var kittySchema = mongoose.Schema({
//     name: String
//   });

//   var Kitten = mongoose.model('Kitten', kittySchema);

//   var fluffy = new Kitten({ name: 'fluffy' });

//   fluffy.save(function (err, fluffy) {
//   if (err) return console.error(err);

//   });

//   Kitten.find(function (err, kittens) {
//   if (err) return console.error(err);
//     console.log(kittens);
//   })
// });

router.get('/', function (req, res) {
  // futService.requestLogin();

  res.render('index', {
    title: 'Home'
  });
});

router.get('/about', function (req, res) {
  res.render('about', {
    title: 'About'
  });
});

router.get('/contact', function (req, res) {
  res.render('contact', {
    title: 'Contact'
  });
});

router.post('/login', function (req, res) {
  var passCode = req.body.passcode;

  futService.requestLogin(passCode);

  res.render('index', {
    title: 'Home'
  });
});


router.post('/getCredits', function (req, res) {

  futService.getCredits(function (credits) {
    res.render('index', {
      title: 'Home',
      credits: credits
    });
  });
});

router.post('/getPlayer', function (req, res) {
  var data = {
    maxbuy: req.body.maxbuy,
    level: req.body.level,
    minprice: req.body.minprice,
    maxprice: req.body.maxprice,
    league: req.body.league,
    playerid: req.body.playerid,
    position: req.body.position,
    isRare: req.body.isRare ? 'CR' : ''
  };

  futService.findplayer(data, function () {
    res.render('index', {
      title: 'Home',
      maxbuy: req.body.maxbuy
    });
  });
});

router.post('/getWatchList', function (req, res) {
  futService.getWatchList(function (watchList) {
    res.render('index', {
      title: 'Home',
      data: watchList
    });
  });
});

router.post('/processcriteria', function (req, res) {

  var data = {
    maxbuy: req.body.maxbuy,
    level: req.body.level,
    minprice: req.body.minprice,
    maxprice: req.body.maxprice,
    league: req.body.league,
    playerid: req.body.playerid,
    position: req.body.position,
    isRare: req.body.isRare ? 'CR' : '',
    data: req.body.zone
  };

  futService.processcriteria(data);

  res.render('index', {
    title: 'Home'
  });
});

module.exports = router;