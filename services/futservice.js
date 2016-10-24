var fut = require('fut-api');

function FutService (){ 
    this.futClient = new fut({saveCookie: true, loadCookieFromSavePath: true, saveCookiePath: "login.txt"});
} 

var futservice = new FutService();

futservice.requestLogin = function(code){
    var self = this;
    this.LoginCode = code;
    
      function twoFactorCodeCb(next){
         next(self.LoginCode);
      }

//malionkin.artem89@gmail.com
//artemochka2007@mail.ru
      this.futClient.login("malionkin.artem89@gmail.com","Cool1989","gerrard", "ps4",
    	twoFactorCodeCb,
    	function(error,response){
            if(error) {
                return console.log("Unable to login.");
            }
            console.log("logged in.");

            // apiClient.search({type: "player", lev: "gold", pos: "CB"}, 
            //     function(error, response){ 
            //     debugger;
            //     var resp = response;
            // });

            // apiClient.getWatchlist(function(error, response){ 
            //     var r = response;
            // });
        });
}

futservice.getCredits = function(callback){
    this.futClient.getCredits(function(error, response){ 
         callback(response.currencies[0].funds);
    });
}

futservice.findplayer = function(callback){
    var self = this;
    this.futClient.search({
        type: "player", lev: "gold", maxb: "350", leag: "13" }, function(error, response){ 
            var responseK = response;

            response.auctionInfo.forEach(function(item) {
                self.futClient.placeBid(item.tradeId, 350, function(error, response){ 
                    var responseK = response;
                });
            }, this);

            // if(response.auc)
        });

    // this.futClient.getTradepile(function(error, response){ 
    //     var responseK = response;
    // });

    // this.futClient.getWatchlist(function(error, response){ 
    //     var responseK = response;
    // });
}

module.exports = futservice;