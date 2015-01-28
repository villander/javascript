/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */

var PUBNUB = require("../pubnub.js")

var pubnub = PUBNUB({
    publish_key   : "demo",
    subscribe_key : "demo",
    heartbeat      : 15
});

pubnub.subscribe({
	channel : 'abcd',
	connect : function(r) {
		console.log(JSON.stringify(r));
	},
	disconnect : function(r) {
		console.log(JSON.stringify(r));
	},
	reconnect : function(r) {
		console.log(JSON.stringify(r));
	},
	error : function(r) {
		console.log(JSON.stringify(r));
	},
	callback : function(r) {
		console.log(JSON.stringify(r));
	},
})
