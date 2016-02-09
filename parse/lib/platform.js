/* ---------------------------------------------------------------------------
 WAIT! - This file depends on instructions from the PUBNUB Cloud.
 http://www.pubnub.com/account
 --------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
 PubNub Real-time Cloud-Hosted Push API and Push Notification Client Frameworks
 Copyright (c) 2016 PubNub Inc.
 http://www.pubnub.com/
 http://www.pubnub.com/terms
 --------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 --------------------------------------------------------------------------- */
/**
 * UTIL LOCALS
 */
let crypto = require('crypto');
let Buffer = require('buffer').Buffer;
let pubNubCore = require('../../core/pubnub-common');
let packageJSON = require('../../package.json');
let XDR = require('./xdr');

let PNSDK = 'PubNub-JS-' + 'Parse' + '/' + packageJSON.version;

function getHMACSHA256(data, key) {
  return crypto.createHmac('sha256', new Buffer(key, 'utf8')).update(data).digest('base64');
}

/**
 * ERROR
 * ===
 * error('message');
 */
function error(message) {
  console.error(message); // eslint-disable-line no-console
}

/**
 * LOCAL STORAGE
 */
let db = (function () {
  let store = {};

  return {
    get(key) {
      return store[key];
    },
    set(key, value) {
      store[key] = value;
    }
  };
})();

let CREATE_PUBNUB = function (setup) {
  setup.xdr = XDR.createInstance(PNSDK);
  setup.db = db;
  setup.error = setup.error || error;
  setup.hmac_SHA256 = getHMACSHA256;
  setup.crypto_obj = require('./crypto-wrapper');
  setup.params = { pnsdk: PNSDK };

  let SELF = function (setup) {
    return CREATE_PUBNUB(setup);
  };

  let PN = pubNubCore.PN_API(setup);

  for (let prop in PN) {
    if (PN.hasOwnProperty(prop)) {
      SELF[prop] = PN[prop];
    }
  }

  SELF.init = SELF;
  SELF.secure = SELF;

  SELF.subscribe = function () {
    throw Error('#subscribe() method is disabled in Parse.com environment');
  };

  SELF.ready();

  return SELF;
};

CREATE_PUBNUB.init = CREATE_PUBNUB;
CREATE_PUBNUB.unique = pubNubCore.unique;
CREATE_PUBNUB.secure = CREATE_PUBNUB;

module.exports = CREATE_PUBNUB;
module.exports.PNmessage = pubNubCore.PNmessage;
