var express = require('express');
var router = express.Router();

var processorService = require('../services/processor');
var agentsKeeper = require('../services/agents-keeper');
var loginService = require('../services/login-service');

var iterationProcessor = require('../services/utils/iteration-processor');

router.get('/', function (req, res) {
  // futService.requestLogin();

  res.render('index', {
    title: 'Home'
  });
});


router.post('/login', function (req, res) {

  var data = {
    loginId: req.body.loginid,
    passCode: req.body.passcode
  }

  loginService.login(data);

  res.render('index', {
    title: 'Home'
  });
});

router.post('/loginAll', function (req, res) {

  loginService.loginAll();

  res.render('index', {
    title: 'Home'
  });
});


// router.post('/getCredits', function (req, res) {

//   futService.getCredits(function (credits) {
//     res.render('index', {
//       title: 'Home',
//       credits: credits
//     });
//   });
// });

// router.post('/getWatchList', function (req, res) {
//   futService.getWatchList(function (watchList) {
//     res.render('index', {
//       title: 'Home',
//       data: watchList
//     });
//   });
// });

// router.post('/processcriteria', function (req, res) {

//   var data = {
//     maxbuy: req.body.maxbuy,
//     level: req.body.level,
//     minprice: req.body.minprice,
//     maxprice: req.body.maxprice,
//     league: req.body.league,
//     playerid: req.body.playerid,
//     position: req.body.position,
//     isSpecial: req.body.isSpecial ? 'SP' : '',
//     zone: req.body.zone
//   };

//   futService.processcriteria(data);

//   res.render('index', {
//     title: 'Home'
//   });
// });

router.post('/startprocessing', function (req, res) {

  var agents = agentsKeeper.loggedInAgents();

  iterationProcessor.process(function (iterationCallback) {

    agents.forEach(function (agent) {
      
      agent.client.getCredits(function(funds){
        console.log("Credits " + funds + " for " + agent.id);
      });
    });

    iterationCallback();

  }, undefined, 8 * 60000, 9 * 60000,
    function () { });

  agentsKeeper.enableAll();
  processorService.processBuyNow();

  res.render('index', {
    title: 'Home'
  });
});

router.post('/stopprocessing', function (req, res) {

  agentsKeeper.disableAll();
  var agents = agentsKeeper.loggedInAgents();
  agents[0].client.getCredits();


  res.render('index', {
    title: 'Home'
  });
});

module.exports = router;      