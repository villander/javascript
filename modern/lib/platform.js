var pubnubCore = require('../../core/pubnub-common');
var packageJSON = require('../../package.json');
var cryptoJS = require('../../core/external_js/hmac-sha256');

var PNSDK = 'PubNub-JS-' + 'Modern' + '/' + packageJSON.version;
var XDR = require('./xdr');

/**
 * LOCAL STORAGE
 */
var db = (function () {
  var ls = typeof localStorage !== 'undefined' && localStorage;
  return {
    get: function (key) {
      try {
        if (ls) return ls.getItem(key);
        if (document.cookie.indexOf(key) === -1) return null;
        return ((document.cookie || '').match(
            RegExp(key + '=([^;]+)')
          ) || [])[1] || null;
      } catch (e) {
        return;
      }
    },
    set: function (key, value) {
      try {
        if (ls) return ls.setItem(key, value) && 0;
        document.cookie = key + '=' + value +
          '; expires=Thu, 1 Aug 2030 20:00:00 UTC; path=/';
      } catch (e) {
        return;
      }
    }
  };
})();


/**
 * BIND
 * ====
 * bind( 'keydown', search('a')[0], function(element) {
 *     ...
 * } );
 */
function bind(type, el, fun) {
  pubnubCore.each(type.split(','), function (etype) {
    var rapfun = function (e) {
      if (!e) e = window.event;
      if (!fun(e)) {
        e.cancelBubble = true;
        e.returnValue = false;

        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
      }
    };

    if (el.addEventListener) el.addEventListener(etype, rapfun, false);
    else if (el.attachEvent) el.attachEvent('on' + etype, rapfun);
    else el['on' + etype] = rapfun;
  });
}

/**
 * ERROR
 * ===
 * error('message');
 */
function error(message) {
  console.error(message);
}

/**
 * EVENTS
 * ======
 * PUBNUB.events.bind( 'you-stepped-on-flower', function(message) {
 *     // Do Stuff with message
 * } );
 *
 * PUBNUB.events.fire( 'you-stepped-on-flower', "message-data" );
 * PUBNUB.events.fire( 'you-stepped-on-flower', {message:"data"} );
 * PUBNUB.events.fire( 'you-stepped-on-flower', [1,2,3] );
 *
 */
var events = {
  list: {},
  unbind: function (name) {
    events.list[name] = [];
  },
  bind: function (name, fun) {
    (events.list[name] = events.list[name] || []).push(fun);
  },
  fire: function (name, data) {
    pubnubCore.each(
      events.list[name] || [],
      function (fun) {
        fun(data);
      }
    );
  }
};

/**
 * ATTR
 * ====
 * var attribute = attr( node, 'attribute' );
 */
function attr(node, attribute, value) {
  if (value) node.setAttribute(attribute, value);
  else return node && node.getAttribute && node.getAttribute(attribute);
}

/**
 * $
 * =
 * var div = $('divid');
 */
function $(id) {
  return document.getElementById(id);
}


/**
 * SEARCH
 * ======
 * var elements = search('a div span');
 */
function search(elements, start) {
  var list = [];
  pubnubCore.each(elements.split(/\s+/), function (el) {
    pubnubCore.each((start || document).getElementsByTagName(el), function (node) {
      list.push(node);
    });
  });
  return list;
}

/**
 * CSS
 * ===
 * var obj = create('div');
 */
function css(element, styles) {
  for (var style in styles) {
    if (styles.hasOwnProperty(style)) {
      try {
        element.style[style] = styles[style] + (
            '|width|height|top|left|'.indexOf(style) > 0 &&
            typeof styles[style] === 'number'
              ? 'px' : ''
          );
      } catch (e) {
        error(e);
      }
    }
  }
}

/**
 * CREATE
 * ======
 * var obj = create('div');
 */
function create(element) {
  return document.createElement(element);
}


function getHmacSHA256(data, key) {
  var hash = cryptoJS.HmacSHA256(data, key);
  return hash.toString(cryptoJS.enc.Base64);
}

/* =-====================================================================-= */
/* =-====================================================================-= */
/* =-=========================     PUBNUB     ===========================-= */
/* =-====================================================================-= */
/* =-====================================================================-= */

function CREATE_PUBNUB(setup) {
  setup.db = db;
  setup.xdr = XDR.createInstance(PNSDK);
  setup.error = setup.error || error;
  setup.hmac_SHA256 = getHmacSHA256;
  setup.crypto_obj = crypto_obj();
  setup.params = { pnsdk: PNSDK };

  var SELF = function (setup) {
    return CREATE_PUBNUB(setup);
  };
  var PN = pubnubCore.PN_API(setup);
  for (var prop in PN) {
    if (PN.hasOwnProperty(prop)) {
      SELF[prop] = PN[prop];
    }
  }

  SELF.init = SELF;
  SELF.$ = $;
  SELF.attr = attr;
  SELF.search = search;
  SELF.bind = bind;
  SELF.css = css;
  SELF.create = create;
  SELF.crypto_obj = crypto_obj();

  if (typeof(window) !== 'undefined') {
    bind('beforeunload', window, function () {
      SELF['each-channel'](function (ch) {
        SELF.LEAVE(ch.name, 1);
      });
      return true;
    });
  }

  // Return without Testing
  if (setup['notest']) return SELF;

  if (typeof(window) !== 'undefined') {
    bind('offline', window, SELF.offline);
  }

  if (typeof(document) !== 'undefined') {
    bind('offline', document, SELF.offline);
  }

  SELF.ready();
  return SELF;
}
CREATE_PUBNUB.init = CREATE_PUBNUB;
CREATE_PUBNUB.secure = CREATE_PUBNUB;
CREATE_PUBNUB.crypto_obj = crypto_obj();
PUBNUB = CREATE_PUBNUB({});

typeof module !== 'undefined' && (module.exports = CREATE_PUBNUB) ||
typeof exports !== 'undefined' && (exports.PUBNUB = CREATE_PUBNUB) || (PUBNUB = CREATE_PUBNUB);
