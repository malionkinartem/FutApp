var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017');
mongoose.connect('mongodb://malonkinartem:Cool1989@ds033607.mlab.com:33607/fut-app');

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
        isRare: Boolean,
        zone: String,
        buynowprice: String,
        enabled: Boolean,
        nationid: String
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
                teamid: data.teamId,
                position: data.position,
                buynowprice: data.buynowprice,
                zone: data.zone,
                enabled: true,
                nationid: data.nationid
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

            var dataCollection = new Array();

            configurations.forEach(function(item){
                dataCollection.push(item._doc);
            })

            return callback(dataCollection);
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