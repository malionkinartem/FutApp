var express = require('express');
var router = express.Router();
var configurationCrudService =require('../services/configurationcrud');

router.get('/', function(req, res) {

  var configurations = configurationCrudService.getAll(function(configurations){
      res.render('configurations', 
      {
        configurations
      });
    } 
  );


});

router.post('/add', function(req, res) {

  var data = {
    buynowprice: req.body.buynowprice,
    level: req.body.level,
    minprice: req.body.minprice,
    maxprice: req.body.maxprice,
    league: req.body.league,
    playerid: req.body.playerid,
    position: req.body.position,
    isRare: req.body.isRare ? 'CR' : '',
    teamId: req.body.teamid,
    zone: req.body.zone
  };

  configurationCrudService.add(data, function(){
    res.redirect('/configurations');
  })
});

module.exports = router;
 