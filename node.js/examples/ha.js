/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */

var PUBNUB = require("../pubnub.js")

var pubnub = PUBNUB({
    publish_key   : "demo",
    subscribe_key : "demo",
            'origin_heartbeat_interval' : 30,
        'origins' : [   
                        'geo1.devbuild.pubnub.com','geo2.devbuild.pubnub.com',
                        'geo4.devbuild.pubnub.com']
});
/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */
pubnub.subscribe({
    channel  : "mychannel",
    callback : function(message) {
        console.log( " > ", message );
    },
    connect : function(message) {
        console.log( " CONNECT > ", message );
    },
    disconnect : function(message) {
        console.log( "DISCONNECT > ", message );
    },
    reconnect : function(message) {
        console.log( " RECONNECT > ", message );
    },
    error : function(r) {
       console.log(JSON.stringify(r));
    }

});
