var Step = require('Step');
var configurationCrudService = require('../services/configurationcrud');
var agentsKeeper = require('../services/agents-keeper');
var iterator = require('../services/utils/iteration-processor');
var futService = require('../services/futservice')
var priceCalculation = require('../services/price-calculation')

module.exports = {
    processBuyNow: function (clients) {
        var self = this;
        Step(
            function () {
                configurationCrudService.getAll(this);
            },
            function (configurations) {
                var agents = agentsKeeper.loggedInAgents();

                if(agents !== undefined){
                    agents.forEach(function (agent) {
                        self.searchConfigurationsProcessor(configurations, agent);
                    });
                }
            }
        )
    },

    searchConfigurationsProcessor: function (configurations, agent) {
        var self = this;

        var configurationIndex = 0;
        var oneMinute = 6000;
        var minTimeoutInMinutes = 10 * oneMinute;
        var maxTimeoutInMinutes = 20 * oneMinute;

        // TODO: make request to loggIn if agent is not logged in 

        iterator.process(function () {
            var updatedAgent = agentsKeeper.getAgent(agent.Id);
            if (updatedAgent.loggedIn) {
                self.processConfiguration(configurations[configurationIndex], agent);

                if (configurations.length - 1 > configurationIndex) {
                    configurationIndex++;
                }
                else {
                    configurationIndex = 0;
                }

            }
        }, undefined, minTimeoutInMinutes, maxTimeoutInMinutes);

    },

    processConfiguration: function (configuration, agent) {

        var minTimeoutInSeconds = 1000;
        var maxTimeoutInSeconds = 5000;

        iterator.process(function (callback) {
            var itemPrice = 0;
            var itemTypeId = 0;
            var tradeId = 0;      
            var itemId = 0;
            var itemForSale = "";

                Step(
                    function () {
                        agent.futClient.findplayer(configuration, this);
                    },
                    function (foundItems) {
                        if (foundItems !== undefined && foundItems.length > 0) {
                            var foundItem = foundItems[0];
                            var buyPrice = itemPrice = foundItem.buyNowPrice;
                            // TODO: create price service method to get price tyoe based on appropriate processing
                            agent.futClient.buyNow(foundItem.tradeId, buyPrice, this);
                        }
                    },
                    function (response) {
                        if (response.success) {
                            console.log("item was bought.");
                            itemTypeId = response.item.itemData.assetId;
                            itemId = response.item.itemData.id;

                            agent.futClient.sendToTransferList(itemId, this);
                        }
                    },
                    function(response){
                        tradeId = response.tradeId;
                        agent.futClient.getTransferList(this);
                    },
                    function(response){
                        configuration.playerId = itemTypeId;
                        configuration.buynowprice = "";
                        configuration.minprice = "";
                        configuration.maxprice = "";

                        itemForSale = response.auctionInfo.find(function(item){return item.itemData.id === itemId;});

                        if(itemForSale){
                            agent.futClient.findplayer(configuration, this);
                        }
                    },
                    function (response) {
                        var collection = response.map(function(record){
                            return { maxPrice: record.buyNowPrice };
                        });
                        var price = priceCalculation.getSalePrice(collection, itemPrice, itemForSale.itemData.marketDataMaxPrice)
                        agent.futClient.listItem(itemId, price.minPrice, price.maxPrice, this);
                    },
                    function(response){
                        console.log('item was sent to sale.')
                    }
                )

                callback();

        }, 100, minTimeoutInSeconds, maxTimeoutInSeconds)
    }
}