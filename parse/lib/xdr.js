/* global Parse */

const pubnubCore = require('../../core/pubnub-common.js');

/**
 * Request
 * =======
 *  xdr({
 *     url     : ['http://www.blah.com/url'],
 *     success : function(response) {},
 *     fail    : function() {}
 *  });
 */

class parseXDR {

  constructor(PNSDK) {
    this.PNSDK = PNSDK;
  }

  xdr(setup) {
    let success = setup.success || function () {};
    let fail = setup.fail || function () {};
    let mode = setup.mode || 'GET';
    let data = setup.data || {};
    let options = {};
    let payload;
    let origin;
    let url;

    data.pnsdk = this.PNSDK;

    if (mode === 'POST') {
      payload = decodeURIComponent(setup.url.pop());
    }

    url = pubnubCore.build_url(setup.url, data);
    url = '/' + url.split('/').slice(3).join('/');

    origin = setup.url[0].split('//')[1];

    options.url = 'http://' + origin + url;
    options.method = mode;
    options.body = payload;

    function invokeFail(message, payload) {
      fail({ message, payload });
    }

    let onSuccess = (httpResponse) => {
      let result;

      try {
        result = JSON.parse(httpResponse.text);
      } catch (e) {
        invokeFail('Bad JSON response', httpResponse.text);
        return;
      }

      success(result);
    };

    let onError = (httpResponse) => {
      let response;

      try {
        response = JSON.parse(httpResponse.text);

        if (typeof response === 'object' && 'error' in response && response.error === true) {
          fail(response);
        } else {
          invokeFail('Network error', httpResponse.text);
        }
      } catch (e) {
        invokeFail('Network error', httpResponse.text);
      }
    };

    Parse.Cloud.httpRequest(options).then(onSuccess, onError);
  }
}

module.exports = parseXDR;
