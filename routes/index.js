var express = require('express');
var fut = require('fut-api');
var router = express.Router();
var FutService = require('../services/futservice');
var futService = new FutService(); 

var priceCalculationService = require('../services/price-calculation');
var processorService = require('../services/processor');

var agentsKeeper = require('../services/agents-keeper');

router.get('/', function (req, res) {
  // futService.requestLogin();

  res.render('index', {
    title: 'Home'
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
    isSpecial: req.body.isSpecial ? 'SP' : '',
    zone: req.body.zone
  };

  futService.processcriteria(data);

  res.render('index', {
    title: 'Home'
  });
});

router.post('/startprocessing', function (req, res) {
  
  processorService.processBuyNow()

  res.render('index', {
      title: 'Home'
    });
});

router.post('/stopprocessing', function (req, res) {
  
  agentsKeeper.disableAll()

  res.render('index', {
      title: 'Home'
    });
});

module.exports = router;      