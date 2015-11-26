
var pubnub = require("../pubnub.js").init({
    publish_key   : "ds",
    subscribe_key : "ds"
});
var i = 0;
function publish(channel, msg) {
	pubnub.publish({
    	channel  : channel,
    	message  : msg,
    	callback : log ,
    	error    : log
	});
}

function log(e) { console.log(JSON.stringify(e)); }

setInterval(function(){
	publish("xyz", ++i);
}, 5000);
