/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

    --------------------------------------------------------------------------- */

    var PUBNUB = require("../pubnub.js")

    var pubnub = PUBNUB({
        'publish_key'                               : "demo",
        'subscribe_key'                             : "demo",
        'origin_heartbeat_interval'                 : 30,
        'origin_heartbeat_max_retries'              : 3,
        'origin_heartbeat_interval_after_failure'   : 15,
        'error'                                     : function(r) { console.log('PUBNUB ERROR : ' + JSON.stringify(r))},
        'origin_heartbeat_callback'                 : function(r) { console.log('PUBNUB HEARTBEAT SUCCESS : ' + JSON.stringify(r))},
        'origin_heartbeat_error_callback'           : function(r) { console.log('PUBNUB HEARTBEAT FAILURE : ' + JSON.stringify(r))},
        'origins'                                   : [   
                    'geo1.devbuild.pubnub.com','geo2.devbuild.pubnub.com',
                    'geo3.devbuild.pubnub.com','geo4.devbuild.pubnub.com' ]
    });
/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */
pubnub.subscribe({
    channel  : "a",
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
    restore  : true,
    error : function(r) {
     console.log(JSON.stringify(r));
 }

});
