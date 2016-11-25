var fut = require('fut-api');

var furService = function (loginId) {
    this.loginId = loginId;

    this.futClient = new fut({ saveCookie: true, loadCookieFromSavePath: true, saveCookiePath: this.loginId });

    this.requestLogin = function (data, callback) {
        var self = this;
        this.LoginCode = data.code;        

        function twoFactorCodeCb(next) {
            next(self.LoginCode);
        }

        this.futClient.login(data.id, data.password, data.secretKey, data.platform,
            twoFactorCodeCb,
            function (error, response) {
                if (error) {
                    console.log("Unable to login. " + self.loginId);
                    callback(false);
                    return;
                }
                console.log("Logged in. " + self.loginId);
                callback(true);                
            });
    }

    this.getCredits = function (callback) {
        this.futClient.getCredits(function (error, response) {
            callback(response.currencies[0].funds);
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
            rare: data.isSpecial,
            team: data.teamid,        
            nat: data.nationid
        };

        var props = Object.getOwnPropertyNames(options);
        props.forEach(function (prop) {
            if (!options[prop]) {
                delete options[prop];
            }
        })

        this.futClient.search(options, function (error, response) {
            var responseK = response;

            if (response.auctionInfo !== undefined) {
                callback(response.auctionInfo);
            }

            if(response.code !== undefined){
                callback(response);
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