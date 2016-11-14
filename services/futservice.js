var fut = require('fut-api');

function FutService() {
    this.futClient = new fut({ saveCookie: true, loadCookieFromSavePath: true, saveCookiePath: "login.txt" });
    this.continueProcess = true;
}

var futservice = new FutService();

futservice.requestLogin = function (code) {
    var self = this;
    this.LoginCode = code;

    function twoFactorCodeCb(next) {
        next(self.LoginCode);
    }

    //malionkin.artem89@gmail.com
    //artemochka2007@mail.ru
    //coinsup87@bk.ru
    this.futClient.login("coinsup87@bk.ru", "Asdfg99Asdfg", "gerrard", "ps4",
        twoFactorCodeCb,
        function (error, response) {
            if (error) {
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

futservice.getCredits = function (callback) {
    this.futClient.getCredits(function (error, response) {
        callback(response.currencies[0].funds);
    });
}

futservice.findplayer = function (data, callback) {
    // maskedDefId = assetId  is player id

    data.maxprice = fut.calculateNextLowerPrice(data.maxprice);

    var options = {
        type: "player",
        leag: data.league,
        lev: data.level,
        maskedDefId: data.playerid,
        maxb: data.maxbuy,
        micr: data.minprice,
        macr: data.maxprice,
        pos: data.position,
        team: data.teamid,
        zone: data.zone
    };

    var self = this;
    this.futClient.search(options, function (error, response) {
        var responseK = response;

        if (response.code == '460' || response.auctionInfo == undefined ) {
            self.callsCount = 101;
            console.log("exception " + response.code);
            callback();
            return;
        }

        console.log('players count: ' + response.auctionInfo.length + ". " + new Date().toTimeString());

        if (response.auctionInfo !== undefined) {

            var item = response.auctionInfo.find(function(item){ return item.itemData.preferredPosition != "GK"});

            if (item !== undefined) {

                console.log('Current bid: ' + item.currentBid);
                var item = response.auctionInfo[0];
                self.futClient.placeBid(item.tradeId, item.buyNowPrice, function (error, response) {
                    if(error == null){
                        console.log('player was bought for: ' + item.buyNowPrice);
                        console.log('coins: ' + response.credits);
                    }

                    if(response.credits < 1000){
                        self.callsCount = 101;
                    }
                });
            }
        }

        callback();
    });
}

futservice.getWatchList = function (callback) {
    this.futClient.getWatchlist(function(error, response){ 
        callback(response);
    });

    this.continueProcess = false;
    callback();
    console.log('watch list');
}

futservice.processcriteria = function (data) {
    var self = this;    
    this.callsCount = 0;
    var callback = function () {
        var timeout = Math.floor((Math.random() * 5000) + 1000);


        setTimeout(function () {
            if (self.callsCount <= 100) {
                self.findplayer(data, callback);
            }
            else{
                console.log('processing finished.')
            }
        }, timeout);

        this.callsCount++;
    }
    self.findplayer(data, callback);
}

module.exports = futservice;

    // this.futClient.getTradepile(function(error, response){ 
    //     var responseK = response;
    // });

    // this.futClient.getWatchlist(function(error, response){ 
    //     var responseK = response;
    // });