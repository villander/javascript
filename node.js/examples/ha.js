/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */

var PUBNUB = require("../pubnub.js")

var pubnub = PUBNUB.init({
    publish_key   : "demo",
    subscribe_key : "demo",
    origins       : ['geo1.devbuild.pubnub.com','geo2.devbuild.pubnub.com','geo3.devbuild.pubnub.com','geo4.devbuild.pubnub.com'],
    origin_heartbeat_interval : 30,
    origin_heartbeat_error_callback : function(r) { console.log(JSON.stringify(r)); }
});


/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */
pubnub.subscribe({
    channel  : "a",
    callback : function(message) {
        console.log( " > ", message );
    },
    error : function(r) {
       console.log(JSON.stringify(r));
    },
    restore : false,
    presence : function(r) { /*console.log(JSON.stringify(r)) */ }

});
