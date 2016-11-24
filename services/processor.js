var Step = require('Step');
var configurationCrudService = require('../services/configurationcrud');
var agentsKeeper = require('../services/agents-keeper');
var iterator = require('../services/utils/iteration-processor');


var priceCalculation = require('../services/price-calculation')
var configurationIndex = 3;


module.exports = {
    processBuyNow: function (clients) {
        var self = this;
        Step(
            function () {
                configurationCrudService.getAll(this);
            },
            function (configurations) {
                var agents = agentsKeeper.loggedInAgents();
                var enabledConfiguration = configurations.filter(function (item) { return item.enabled; });

                if (agents !== undefined) {
                    agents.forEach(function (agent) {
                        self.searchConfigurationsProcessor(enabledConfiguration, agent);
                    });
                }
            }
        )
    },

    searchConfigurationsProcessor: function (configurations, agent) {
        var self = this;

        var oneMinute = 60000;
        var minTimeoutInMinutes = 3 * oneMinute;
        var maxTimeoutInMinutes = 10 * oneMinute;

        // TODO: make request to loggIn if agent is not logged in 

        iterator.process(function (callback) {
            var updatedAgent = agentsKeeper.getAgent(agent.id);
            if (updatedAgent.loggedIn && updatedAgent.enabled) {


                self.processConfiguration(configurations[configurationIndex], agent, function () {
                    callback();
                });

                if (configurations.length - 1 > configurationIndex) {
                    configurationIndex++;
                }
                else {
                    configurationIndex = 0;
                }
            }

        }, undefined, minTimeoutInMinutes, maxTimeoutInMinutes);
    },

    processConfiguration: function (configuration, agent, callback) {

        console.log("processing agent " + agent.id);
        var minTimeoutInSeconds = 1000;
        var maxTimeoutInSeconds = 5000;

        iterator.process(function (iterationCallback) {
            var itemPrice = 0;
            var itemTypeId = 0;
            var tradeId = 0;
            var itemId = 0;
            var itemForSale = "";

            Step(
                function () {
                    agent.client.findplayer(configuration, this);
                },
                function (foundItems) {
                    if (foundItems !== undefined && foundItems.length > 0 && configuration.buynowprice) {
                        console.log("item found " + new Date().toTimeString() + " " + agent.id + " Config Id " + configuration._id.toString());
                        var foundItem = foundItems[0];
                        var buyPrice = itemPrice = foundItem.buyNowPrice;

                        // TODO: create price service method to get price tyoe based on appropriate processing
                        agent.client.buyNow(foundItem.tradeId, buyPrice, this);
                    }
                    else {
                        console.log("item not found" + new Date().toTimeString() + " " + agent.id + " Config Id " + configuration._id.toString());
                    }
                },
                function (response) {
                    if (response.success) {
                        console.log("item was bought.");
                        itemTypeId = response.item.itemData.assetId;
                        itemId = response.item.itemData.id;

                        agent.client.sendToTransferList(itemId, this);
                    }
                },
                function (response) {
                    tradeId = response.tradeId;
                    agent.client.getTransferList(this);
                },
                function (response) {
                    itemForSale = response.auctionInfo.find(function (item) { return item.itemData.id === itemId; });
                    var itemData = itemForSale.itemData;

                    var conf = {
                        playerId: itemData.assetId,
                        league: itemData.leagueId,
                        level: itemData.level,
                        position: itemData.preferredPosition,
                        isSpecial: itemData.rareflag ? 'SP' : '',
                        teamid: itemData.teamid,
                        nationid: itemData.nation
                    };

                    if (itemForSale) {
                        agent.client.findplayer(conf, this);
                    }
                },
                function (response) {
                    var collection = response.map(function (record) {
                        return { maxPrice: record.buyNowPrice };
                    });
                    var price = priceCalculation.getSalePrice(collection, itemPrice, itemForSale.itemData.marketDataMaxPrice)
                    agent.client.listItem(itemId, price.minPrice, price.maxPrice, this);
                },
                function (response) {
                    console.log('item was sent to sale.')
                }
            )

            iterationCallback();

        }, 100, minTimeoutInSeconds, maxTimeoutInSeconds,
            function () {
                callback();
            });
    }
}