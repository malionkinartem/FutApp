var fut = require('fut-api');
var agentsKeeper = require('../services/agents-keeper');

//futagent
var furService = function () {
    this.futClient = new fut({ saveCookie: true, loadCookieFromSavePath: true, saveCookiePath: "coinsup88@bk.ru" });
    this.continueProcess = true;

    this.requestLogin = function (code) {
        var self = this;
        this.LoginCode = code;

        var id = "coinsup88@bk.ru";
        agentsKeeper.addAgent({ Id: id, client: this });

        function twoFactorCodeCb(next) {
            next(self.LoginCode);
        }

        //malionkin.artem89@gmail.com
        this.futClient.login(id, "Asdfg99Asdfg", "gerrard", "ps4",
            twoFactorCodeCb,
            function (error, response) {
                if (error) {
                    return console.log("Unable to login.");
                }
                console.log("logged in.");
                agentsKeeper.loginAgent(id);
            });
    }

    this.getCredits = function (callback) {
        this.futClient.getCredits(function (error, response) {
            callback(response.currencies[0].funds);
        });
    }

    this.findplayerold = function (data, callback) {
        // maskedDefId = assetId  is player id

        var options = {
            type: "player",
            leag: data.league,
            lev: data.level,
            maskedDefId: data.playerid,
            maxb: data.maxbuy,
            micr: data.minprice,
            macr: data.maxprice,
            pos: data.position,
            zone: data.zone,
            rare: data.isSpecial
        };

        var props = Object.getOwnPropertyNames(options);
        props.forEach(function (prop) {
            if (!options[prop]) {
                delete options[prop];
            }
        })

        var self = this;
        this.futClient.search(options, function (error, response) {
            var responseK = response;

            if (response.code == '460') {
                callback();
                return;
            }

            console.log('players count: ' + response.auctionInfo.length);

            if (response.auctionInfo !== undefined) {
                var item = response.auctionInfo[0];

                if (item !== undefined) {

                    console.log('Current bid: ' + item.currentBid);
                    self.futClient.placeBid(item.tradeId, data.maxbuy, function (error, response) {
                        if (error == null) {
                            console.log('player was bought.')
                        }
                    });

                }
            }

            callback();
        });
    }

    this.findplayer = function (data, callback) {
        // maskedDefId = assetId  is player id

        var options = {
            type: "player",
            leag: data.league,
            lev: data.level,
            maskedDefId: data.playerid,
            maxb: data.buynowprice,
            micr: data.minprice,
            macr: data.maxprice,
            pos: data.position,
            zone: data.zone,
            rare: data.isSpecial
        };

        var props = Object.getOwnPropertyNames(options);
        props.forEach(function (prop) {
            if (!options[prop]) {
                delete options[prop];
            }
        })

        this.futClient.search(options, function (error, response) {
            var responseK = response;

            if (response.code == '460') {
                callback();
            }

            if (response.auctionInfo !== undefined) {
                callback(response.auctionInfo);
            }
        });
    }

    this.getWatchList = function (callback) {
        // this.futClient.getWatchlist(function(error, response){ 
        //     callback(response);
        // });

        this.continueProcess = false;
        callback();
        console.log('watch list');
    }

    this.processcriteria = function (data) {
        var self = this;
        var callback = function () {
            setTimeout(function () {
                if (self.continueProcess) {
                    self.findplayerold(data, callback);
                }
            }, 1000);
        }
        self.findplayerold(data, callback);
    }

    this.buyNow = function (tradeId, price, callback) {
        this.futClient.placeBid(tradeId, price, function (error, response) {
            if (response.code == undefined || response.code === "") {
                callback({ success: true, item: response.auctionInfo[0] });
            }
            else {
                callback({ success: false });
            }
        });
    }

    this.listItem = function (itemId, minPrice, maxPrice, callback) {
        this.futClient.listItem(itemId, minPrice, maxPrice, 3600, function (error, response) {
            callback(response);
        });
    }

    this.sendToTransferList = function (itemId, callback) {    
        var self = this;
        this.futClient.sendToTradepile(itemId, function (error, response) {
            callback({itemId: itemId, tradeId: response.itemData[0].id, itemTypeId: response.itemData[0].assetId});
        });
    }

    this.getStatus = function (tradeId, callback) {    
        var self = this;
        this.futClient.getStatus([tradeId], function(error, response) {
            callback();
        });
    }

    this.getTransferList = function(callback){
        this.futClient.getTradepile(function(error, response){ 
            callback(response);
        });
    }
}


module.exports = furService;