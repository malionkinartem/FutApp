"use strict";

var futApi = require("fut-api");

module.exports = {
    
    getSalePrice: function(analogicalItemsInTrade, itemPrice, maxPrice){
        var minPrice = 0;
        var minMaxPrice = 0;

        var interest = itemPrice / 100 * 10;
        var maxPriceRanges = new Array(10);

        analogicalItemsInTrade.forEach(function(item){

            if(item.maxPrice > itemPrice + interest){

                var itemPriceRange =  Math.ceil(item.maxPrice / maxPrice * 10) - 1;

                if(maxPriceRanges[itemPriceRange] == undefined){
                    maxPriceRanges[itemPriceRange] = new Array();                   
                }
                
                maxPriceRanges[itemPriceRange].push(item.maxPrice);
            }
        });

        var resultPrice;
        maxPriceRanges.some(function(range){
            if(range.length >= 2){
                var maxPrice = Math.max.apply(null, range);
                var minMaxPrice = Math.min.apply(null, range);

                var minPrice = futApi.calculateNextLowerPrice(minMaxPrice);

                minPrice = itemPrice >= minPrice ? futApi.calculateNextHigherPrice(itemPrice + interest) : minPrice;

                resultPrice = { maxPrice: maxPrice, minPrice: minPrice  };

                return true;
            }
        })

        return resultPrice;
    }
}