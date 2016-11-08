var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');
var db = mongoose.connection;

function ConfigurationCrud() {
    
    this.configurationSchema = mongoose.Schema({
        playerid: String,
        level: String,
        minprice: String,
        maxprice: String,
        league: String,
        teamid: String,
        position: String,
        isRare: Boolean
    });

    this.saveConfiguration = function(data, callback){
        var Configuration = mongoose.model('Configuration', this.configurationSchema);
        var config = new Configuration(
            {
                isRare: data.isRare,
                playerid: data.playerid,
                level: data.level,
                minprice: data.minprice,
                maxprice: data.maxprice,
                league: data.league,
                teamid: data.teamid,
                position: data.position,
                maxbuy: data.maxbuy
            }
        );

        config.save(function (err, config) {
            if (err) return console.error(err);

            callback();
        });
    }

    this.find = function(query, callback){
        var Configuration = mongoose.model('Configuration', this.configurationSchema);

        Configuration.find(function (err, configurations) {
            return callback(configurations);
        })
    }
}

var configurationcrud = new ConfigurationCrud();

configurationcrud.add = function(data, callback){
    var self = this;
    if(db._hasOpened){
        self.saveConfiguration(data, callback);
    }
    else{
        db.once('open', function() {
            self.saveConfiguration(data, callback);
        });
    }
    
}

configurationcrud.getAll = function(callback){
        var self = this;
    if(db._hasOpened){
        self.find(undefined, callback);
    }
    else{
        db.once('open', function() {
            self.find(undefined, callback);
        });
    }
}

module.exports = configurationcrud;