var furService = function (loginId) {
    var self = this;
    this.loginId = loginId;

    this.requestLogin = function (data, callback) {        
                console.log("Logged in. " + self.loginId);
                callback(true);
    }

    this.getCredits = function (callback) {
        callback(1000);
    }    

    this.findplayer = function (data, callback) {
        callback({id:555});
    }

    this.getWatchList = function (callback) {        

        callback();
    }

    this.buyNow = function (tradeId, price, callback) {        
       callback({ success: false });
    }

    this.listItem = function (itemId, minPrice, maxPrice, callback) {
       callback({});
    }

    this.sendToTransferList = function (itemId, callback) {    
        callback({itemId: 123, tradeId: 123, itemTypeId: 123});
    }

    this.getStatus = function (tradeId, callback) {    
       callback();
    }

    this.getTransferList = function(callback){
       callback({});
    }
}


module.exports = furService;