/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */

var pubnub = require("./../pubnub.js").init({
    publish_key   : "demo",
    ssl : true,
    subscribe_key : "demo",
    'v2'    : true
});

var pubnub1 = require("./../pubnub.js").init({
    publish_key   : "demo",
    ssl : true,
    subscribe_key : "demo",
    'v2'    : true
});

/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */

function subscribe_v2(channel) {
    pubnub.subscribe({
        v2       : true,
        channel  : channel,
        callback  : function(m,c,rc,e){
            console.log('MESSAGE : ' + JSON.stringify(m,null,2));
            console.log('CHANNEL : ' + JSON.stringify(c));
            console.log('REAL CHANNEL : ' + JSON.stringify(rc));
            console.log('COMPLETE MESSAGE : ' + JSON.stringify(e,null,2));
        },
        error : function(e) {
            console.log(JSON.stringify(e));
        },
        connect : function(c) {
            console.log('CONNECT : ' + JSON.stringify(c));
            function publish(channel, msg, meta) {
                pubnub1.publish({
                    channel  : channel,
                    message  : msg,
                    callback : log,
                    error    : log,
                    meta : meta
                });
                }
                function log(e) { console.log(JSON.stringify(e)) }
                function retry() { console.log('retry?')
            }
            setTimeout(function(){
                publish('abcd','hi', {'name' : 'dev'});
            },5000);
        },
        disconnect : function(c) {
            console.log('DISCONNECT : ' + JSON.stringify(c));
        },
        reconnect : function(c) {
            console.log('RECONNECT : ' + JSON.stringify(c));
        }
    });
}

subscribe_v2('abcd','hi');
