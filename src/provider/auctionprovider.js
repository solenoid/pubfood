/**
 * pubfood
 */

'use strict';

var util = require('../util');
var AuctionDelegate = require('../interfaces').AuctionDelegate;
var Event = require('../event');

/**
 * AuctionProvider decorates the {@link AuctionDelegate} to implement the publisher ad server requests.
 *
 * @class
 * @memberof pubfood#provider
 * @param {AuctionDelegate} auctionDelegate
 */
function AuctionProvider(auctionDelegate) {
  this.name = auctionDelegate.name || '';
  this.slots_ = [];
  this.auctionDelegate = auctionDelegate;
  this.mediator = null;
}

/**
 * Set the central auction mediator that orchestrates the auctions.
 *
 * @param {AuctionMediator} mediator - the auction mediator
 */
AuctionProvider.prototype.setMediator = function(mediator) {
  this.mediator = mediator;
};

/**
 * Create a new [AuctionProvider]{@link pubfood#provider.AuctionProvider} from an object.
 *
 * @param {AuctionDelegate} delegate - provider object literal
 * @returns {pubfood#provider.AuctionProvider|null} instance of [AuctionProvider]{@link pubfood#provider.AuctionProvider}. <em>null</em> if delegate is invalid.
 */
AuctionProvider.withDelegate = function(delegate) {
  if (!AuctionProvider.validate(delegate)) {
    Event.publish(Event.EVENT_TYPE.INVALID, {msg: 'Warn: invalid auction delegate - ' + (delegate && JSON.stringify(delegate)) || ''});
    return null;
  }
  var p = new AuctionProvider(delegate);
  return p;
};

/**
 * Validate a auction provider delegate.
 *
 * Checks that the delegate has the required properties specified by {@link AuctionDelegate}
 *
 * @param {AuctionDelegate} delegate - bid provider delegate object literal
 * @returns {boolean} true if delegate has required functions and properties
 */
AuctionProvider.validate = function(delegate) {
  return util.validate(AuctionDelegate, delegate);
};

/**
 * Set the provider's name.
 *
 * @param {string} name - the auction provider name
 * @return {pubfood#provider.AuctionProvider}
 */
AuctionProvider.prototype.setName = function(name) {
  this.name = name;
  return this;
};

/**
 * Get the auction provider JavaScript library Uri/Url.
 *
 * @return {string}
 */
AuctionProvider.prototype.libUri = function() {
  return this.auctionDelegate.libUri;
};

/**
 * Initialize a auction provider.
 *
 * The AuctionProvider delegate Javascript and other tag setup is done here.
 *
 * @param {array.<SlotTargetingObject|PageTargetingObject>} targeting - objects with bids and page level targeting. Can be arran of both {@link SlotTargetingObject} <em>and</em> {@link PageTargetingObject}.
 * @param {auctionDoneCallback} done - a callback to execute on init complete
 */
AuctionProvider.prototype.init = function(targeting, done) {
  this.auctionDelegate.init(targeting, done);
};

/**
 * Refresh for ad slots
 *
 * @param {array.<SlotTargetingObject|PageTargetingObject>} targeting - objects with bids and page level targeting. Can be arran of both {@link SlotTargetingObject} <em>and</em> {@link PageTargetingObject}.
 * @param {auctionDoneCallback} done a callback to execute on init complete
 */
AuctionProvider.prototype.refresh = function(targeting, done) {
  var refresh = (this.auctionDelegate && this.auctionDelegate.refresh) || null;
  if (!refresh) {
    Event.publish(Event.EVENT_TYPE.WARN, 'AuctionProvider.auctionDelegate.refresh not defined.');
    return;
  }
  refresh(targeting, done);
};

module.exports = AuctionProvider;
