var pubnubCore = require('../../core/pubnub-common');
var _partial = require('lodash/partial');

/**
 * CORS XHR Request
 * ================
 *  xdr({
 *     url     : ['http://www.blah.com/url'],
 *     success : function(response) {},
 *     fail    : function() {}
 *  });
 */
function xdr(PNSDK, setup) {
  var xhr;
  var timer;
  var complete = 0;
  var loaded = 0;

  var xhrtme = setup.timeout || pubnubCore.DEF_TIMEOUT;
  var data = setup.data || {};
  var fail = setup.fail || function () {};
  var success = setup.success || function () {};

  var finished = function () {
    if (loaded) return;
    loaded = 1;
    var response;

    clearTimeout(timer);

    try {
      response = JSON.parse(xhr.responseText);
    } catch (r) {
      return done(1);
    }

    success(response);
  };

  var async = (typeof(setup.blocking) === 'undefined');
  var done = function (failed, response) {
    if (complete) return;
    complete = 1;

    clearTimeout(timer);

    if (xhr) {
      xhr.onerror = xhr.onload = null;
      if (xhr.abort) {
        xhr.abort();
      }
      xhr = null;
    }

    if (failed) {
      fail(response);
    }
  };

  timer = pubnubCore.timeout(function () { done(1); }, xhrtme);

  // Send
  try {
    xhr = typeof XDomainRequest !== 'undefined' && new XDomainRequest() || new XMLHttpRequest();

    xhr.onerror = xhr.onabort = function () {
      done(1, xhr.responseText || { error: 'Network Connection Error' });
    };
    xhr.onload = xhr.onloadend = finished;
    xhr.onreadystatechange = function () {
      if (xhr && xhr.readyState === 4) {
        switch (xhr.status) {
          case 200:
            break;
          default:
            try {
              var response = JSON.parse(xhr.responseText);
              done(1, response);
            } catch (r) {
              return done(1, { status: xhr.status, payload: null, message: xhr.responseText });
            }
            return;
        }
      }
    };

    data.pnsdk = PNSDK;
    var url = pubnubCore.build_url(setup.url, data);
    xhr.open('GET', url, async);
    if (async) xhr.timeout = xhrtme;
    xhr.send();
  } catch (eee) {
    done(0);
    return xdr(setup);
  }

  // Return 'done'
  return done;
}

module.exports = {
  createInstance: function (PNSDK) {
    return {
      request: _partial(xdr, PNSDK)
    };
  }
};
