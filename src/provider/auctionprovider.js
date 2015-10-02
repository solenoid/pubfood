'use strict';

var util = require('../util');
var BaseProvider = require('./baseprovider');

/**
 * AuctionProvider implements the  publisher ad server requests. 
 *
 * @class
 * @memberOf pubfood/provider
 */
function AuctionProvider() {

}

util.inherits(AuctionProvider, BaseProvider);

module.exports = AuctionProvider;