

function get_random(){
    return Math.floor((Math.random() * 100000000000) + 1);
}

var pubnub = PUBNUB.init({
    publish_key: 'ds',
    subscribe_key: 'ds'
});

var random = get_random();
var channel_group = 'cg' + random;
var ch = 'channel' + random;


pubnub.channel_group_add_channel({
    'channel_group' : channel_group,
    'channel'       : ch,
    'callback'      : function(r) {
        setTimeout(function(){
            pubnub.subscribe({ channel_group : channel_group,
                connect : function(response)  {
                    console.log('SUBSCRIBE CONNECT ' + JSON.stringify(response));
                    pubnub.publish({channel: ch, message: "message" + random,
                        callback : function(response) {
                            console.log('PUBLISH CALLBACK ' + JSON.stringify(response));
                        }
                    });
                },
                callback : function(response) {
                    console.log('SUBSCRIBE CALLBACK ' + JSON.stringify(response));
                }
            });
        }, 2000);
    },
    'error'         : function(r) {
        console.log('SUBSCRIBE ERROR ' + JSON.stringify(response));
    }
});