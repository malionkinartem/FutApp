var passport = require('passport');

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


router.post('/loginAgent', function (req, res) {

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

router.post('/startprocessing', function (req, res) {

  var agents = agentsKeeper.loggedInAgents();

  iterationProcessor.process(function (iterationCallback) {

    agents.forEach(function (agent) {

      agent.client.getCredits(function (funds) {
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